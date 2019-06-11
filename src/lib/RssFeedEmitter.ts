import { EventEmitter } from 'events';

export class RssFeedEmitter extends EventEmitter {

    public userAgent: string;

    private _options: RssFeedEmitterOptions;

    constructor(options: RssFeedEmitterOptions = {}) {
        super();

        this._options = options;
        this.userAgent = options.userAgent ? options.userAgent : 'Trident RssFeedEmitter Library';
    }

}

export type RssFeedEmitterOptions = {
    userAgent?: string;
};
