import { Item } from 'feedparser';
import { AdvancedMap } from '@advancedmap/advancedmap';

export class RssData {

    public list: DataList = new AdvancedMap();
    public readonly feedURL: string = '';
    public feed: IRssFeedObject;

    public constructor(url: string) {
        this.feedURL = url;
        this.feed = { url: this.feedURL };
    }

    public insertItem(item: Item): DataList {
        return this.list.set(item.title, item);
    }
}

export type DataList = AdvancedMap<string, Item>;

import { IRssFeedObject } from '../RssFeedEmitter';
