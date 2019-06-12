import { Item } from 'feedparser';
import { Collection } from 'discord.js';

export class RssData {

    public list: DataList = new Collection();
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

export type DataList = Collection<string, Item>;

import { IRssFeedObject } from '../RssFeedEmitter';
