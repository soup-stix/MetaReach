export declare type DevtoolsOptions = {
    /** instance name visible in devtools */
    name: string;
    /**  maximum allowed actions to be stored in the history tree */
    maxAge: number;
    latency: number;
    actionsBlacklist: string[];
    actionsWhitelist: string[];
    storesWhitelist: string[];
    shouldCatchErrors: boolean;
    logTrace: boolean;
    predicate: (state: any, action: any) => boolean;
    shallow: boolean;
    sortAlphabetically: boolean;
};
export declare type NgZoneLike = {
    run: any;
};
export declare function akitaDevtools(ngZone: NgZoneLike, options?: Partial<DevtoolsOptions>): any;
export declare function akitaDevtools(options?: Partial<DevtoolsOptions>): any;
