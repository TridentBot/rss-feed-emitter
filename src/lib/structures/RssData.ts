import { Item } from 'feedparser';
import { Collection } from 'discord.js';

export class RssData extends Collection<string, Item> {
    public readonly feedURL: string = '';

    public constructor(url: string, data?: readonly (readonly [string, Item])[]) {
        super(data);
        this.feedURL = url;
    }

    public insertItem(item: Item): RssData {
        return super.set(item.title, item);
    }
}
