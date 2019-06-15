import { EventEmitter } from 'events';
import FeedParser from 'feedparser';
import fetch, { Response } from 'node-fetch';
import { AdvancedMap } from '@advancedmap/advancedmap';
import { RssData } from './structures/RssData';

export class RssFeedEmitter extends EventEmitter {

    public userAgent: string;

    private _options: IRssFeedEmitterOptions;
    private _defaultRefresh: number;
    private _historyLengthModifier: number;
    private _feedList: FeedList = new AdvancedMap();
    private _intervalList: IntervalList = new AdvancedMap();

    public constructor(options: IRssFeedEmitterOptions = {}) {
        super();

        this._options = options;
        this.userAgent = this._options.userAgent || 'Trident RssFeedEmitter Library';
        this._historyLengthModifier = this._options.historyLengthModifier || 3;
        this._defaultRefresh = this._options.defaultRefreshTime || 60000;
    }

    public Add(params: IRssFeedObject): FeedList {
        params = {
            refresh: this._defaultRefresh,
            ...params
        };
        return this._UpdateFeedList(params);
    }

    public get GetList(): FeedList {
        return this._feedList;
    }

    private _UpdateFeedList(entry: IRssFeedObject): FeedList {
        const foundEntry: IRssFeedObject | undefined = this._feedList.find(v => v.url === entry.url);
        if (foundEntry) this._feedList.delete(foundEntry.url);
        return this._AddToFeed(entry);
    }

    private _AddToFeed(entry: IRssFeedObject): FeedList {
        return this._feedList.set(entry.url, entry);
    }

    private async _FeedContentFetch(url: string): Promise<any> {
        const data: RssData = await this._Fetch(url);
        data.feed = this._feedList.find(v => v.url === url);
        data.feed.maxHistoryLength = data.list.size * this._historyLengthModifier;

        // eslint-disable-next-line no-warning-comments
        // TODO: Need to figure out how to sort this
        data.list = data.list.sort();
        return;
    }

    private async _Fetch(url: string): Promise<RssData> {
        const fParser: FeedParser = new FeedParser({
            feedurl: url
        });

        const data = new RssData(url);

        const result: Response = await fetch(url, { headers: {
            accept: 'text/html,application/xhtml+xml,application/xml,text/xml',
            'user-agent': this.userAgent
        } });
        if (result.ok) result.body.pipe(fParser);
        if (!result.ok) throw new Error(`This URL returned a ${result.status} status code`);

        fParser.on('readable', () => {
            const item: FeedParser.Item = fParser.read();
            item.meta.link = url;
            data.insertItem(item);
        });

        return data;
    }

}

export interface IRssFeedEmitterOptions {
    userAgent?: string;
    defaultRefreshTime?: number;
    historyLengthModifier?: number;
}

export interface IRssFeedObject {
    url: string;
    refresh?: number;
    maxHistoryLength?: number;
}

export type FeedList = AdvancedMap<string, IRssFeedObject>;
export type IntervalList = AdvancedMap<string, NodeJS.Timer>;
