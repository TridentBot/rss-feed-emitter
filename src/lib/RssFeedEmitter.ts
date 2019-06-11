import { EventEmitter } from 'events';
import { Collection, Util } from 'discord.js';
import * as FeedParser from 'feedparser';
import fetch, { Response } from 'node-fetch';

export class RssFeedEmitter extends EventEmitter {

    public userAgent: string;

    private _options: IRssFeedEmitterOptions;
    private _defaultRefresh: number;
    private _feedList: FeedList = new Collection();

    public constructor(options: IRssFeedEmitterOptions = {}) {
        super();

        this._options = options;
        this.userAgent = options.userAgent || 'Trident RssFeedEmitter Library';
        this._defaultRefresh = options.defaultRefreshTime || 60000;
    }

    public add(params: IRssFeedObject): FeedList {
        params = Util.mergeDefault({
            refresh: this._defaultRefresh
        }, params) as IRssFeedObject;
        return this._updateFeedList(params);
    }

    public get getList(): FeedList {
        return this._feedList;
    }

    private _updateFeedList(entry: IRssFeedObject): FeedList {
        const foundEntry: IRssFeedObject | undefined = this._feedList.find(v => v.url === entry.url);
        if (foundEntry) this._feedList.delete(foundEntry.url);
        return this._addToFeed(entry);
    }

    private _addToFeed(entry: IRssFeedObject): FeedList {
        return this._feedList.set(entry.url, entry);
    }

    private async _fetch(url: string): Promise<any> {
        const fParser: FeedParser = new FeedParser({
            feedurl: url
        });

        const result: Response = await fetch(url, { headers: {
            accept: 'text/html,application/xhtml+xml,application/xml,text/xml',
            'user-agent': this.userAgent
        } });
        if (result.ok) result.body.pipe(fParser);
    }

}

export interface IRssFeedEmitterOptions {
    userAgent?: string;
    defaultRefreshTime?: number;
}

export interface IRssFeedObject {
    url: string;
    refresh: number;
}

export type FeedList = Collection<string, IRssFeedObject>;
