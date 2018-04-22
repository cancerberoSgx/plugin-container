/**
 * The PluginContainer pattern is very similar to events listeners pattern but
 * designed to let listeners hook more appropiately into some processing. One or more Plugin objects
 * are installed into a PluginContainer and the owner of the container runs container.executeAll()
 * Registered plugins will be then executed by priority order and if any input is passed 
 * it will transformed
 */
export class PluginContainer {

  public static DEFAULT_PRIORITY: number = 5;

  public plugins: any[] = [];

  constructor() {
    this.initialize();
  }

  public initialize() {
    this.plugins = [];
  }

  /**
   * Execute all registered plugins The first param is the
   * input and the rest of the params will be passed to Plugin's execute method.
   * @param input. Optional. The input that plugins will take and transform.
   * @return the output, if any
   */
  public executeAll(input?: any): any|void {
    const args = Array.prototype.slice.call(arguments, 0);
    this.plugins.forEach((p) => {
      args[0] = p.execute(...args) || args[0];
    });
    return args[0];
  }

  /**
   * Execute all registered plugins The first param is the
   * context and the rest of the params will be passed to Plugin's execute method.
   * @param context Optional. The context that plugins will take and transform.
   * @return {Any} the output, if any
   */
  public executeAllWithContext(context?: any): any|void {
    const theContext = arguments[0];
    const args = Array.prototype.slice.call(arguments, 1);
    this.plugins.forEach((p) => {
      args[0] = p.execute.apply(theContext || p, args) || args[0];
    });
    return args[0];
  }

  /**
   * install add a new plugin
   */
  public install(plugin: IPlugin): void {
    plugin.priority = plugin.priority || PluginContainer.DEFAULT_PRIORITY;
    this.plugins.push(plugin);
    this.plugins = this.plugins.sort((a, b) => (a.priority < b.priority ? 1 : -1));
  }

  /**
   * Remove an installed plugin
   */
  public uninstall(plugin: IPlugin|string): void {
    const name = this.getPluginName(plugin);
    this.plugins = this.plugins.filter(p => p.name !== name);
  }

  private getPluginName(plugin: IPlugin|string): string {
    return typeof plugin === 'string' ? plugin : plugin.name;
  }

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
