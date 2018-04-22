/**
 * The PluginContainer pattern is very similar to events listeners pattern but
 * designed to let listeners hook more appropiately into some processing. One or more Plugin objects
 * are installed into a PluginContainer and the owner of the container runs container.executeAll()
 * Registered plugins will be then executed by priority order and if any input is passed
 * it will transformed
 */
export declare class PluginContainer {
    static DEFAULT_PRIORITY: number;
    plugins: any[];
    constructor();
    initialize(): void;
    /**
     * Execute all registered plugins The first param is the
     * input and the rest of the params will be passed to Plugin's execute method.
     * @param input. Optional. The input that plugins will take and transform.
     * @return the output, if any
     */
    executeAll(input?: any): any | void;
    /**
     * Execute all registered plugins The first param is the
     * context and the rest of the params will be passed to Plugin's execute method.
     * @param context Optional. The context that plugins will take and transform.
     * @return {Any} the output, if any
     */
    executeAllWithContext(context?: any): any | void;
    /**
     * install add a new plugin
     */
    install(plugin: IPlugin): void;
    /**
     * Remove an installed plugin
     */
    uninstall(plugin: IPlugin | string): void;
    private getPluginName(plugin);
}
/**
 * Plugin installable in a PluginContainer. There is no concrete API, only an execute method and .
 * It's up to the users to define de Plugin semantics
 */
export interface IPlugin {
    /**
     *  name used to identify the plugins in the container
     */
    name: string;
    /**
     * @return pugins have the possibility of, optionally, modify the input somehow
     * so next plugins in the container will receive
     * its modifications will do some modifications to any passed object and will return these
     * modifications - implementer freedom
     */
    execute: (input: any) => any;
    /**
     * priority lower numbers will execute before higher numbers
     */
    priority?: number;
}
