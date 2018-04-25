import { EventEmitter } from 'events';


export interface PluginExceptionEventData {
  plugin: IPlugin;
  error: any;
  input: any;
}

export class PluginContainer extends EventEmitter implements IPluginContainer {

 
  constructor(config?:PluginContainerConfig) {
    super();
    this.plugins = [];
    this.config = Object.assign({}, this.defaultConfig, config || {});
  }

  

  // public static 'plugin-exception': 'plugin-exception' = 'plugin-exception';



  private config: PluginContainerConfig;
  public static DEFAULT_PRIORITY: number = 5;

  private plugins: IPlugin[];

  private defaultConfig:PluginContainerConfig = {
    onErrorPolicy: 'continue',
  };

  public executeAll(input?: any): any {
    let value = input;
    this.plugins.some((p) => {
      try {
        this.emit('plugin-before-execute', { plugin: p, input: value });
        value = p.execute(value) || value;
        this.emit('plugin-success', { plugin: p, result: value });
      } catch (error) {
        if (this.config.onErrorPolicy === 'continue') {
          this.emit('plugin-exception', { plugin: p, error, input: value });
          return false;
        } else if (this.config.onErrorPolicy === 'break') {
          this.emit('plugin-exception', { plugin: p, error, input: value });
          return true; // we are using array.some - returning true will break the loop
        } else /*if (this.config.onErrorPolicy === 'throw') */{
          this.emit('plugin-exception', { plugin: p, error, input: value });
          throw error;
        }
      }
    });
    return value;
  }
  

  public install(plugin: IPlugin): void {
    plugin.priority = plugin.priority || PluginContainer.DEFAULT_PRIORITY;
    this.plugins.push(plugin);
    this.plugins = this.plugins.sort((a, b) => (a.priority < b.priority ? 1 : -1));
  }

  public uninstall(plugin: IPlugin|string): void {
    const name = this.getPluginName(plugin);
    this.plugins = this.plugins.filter(p => p.name !== name);
  }

  private getPluginName(plugin: IPlugin| string): string {
    return typeof plugin === 'string' ? plugin : plugin.name;
  }

}

export interface PluginContainerConfig{
  onErrorPolicy: 'continue'|'break'|'throw';
}

/**
 * Plugin that can be installed in a PluginContainer (see [[install]]). There is no concrete API, only an execute method. 
 * It's up to the users to define de Plugin semantics and collaboration between plugins of the same container to resolve a problem.
 */
export interface IPlugin {
  /**
   *  name used to identify the plugins in the container
   */
  name: string;
  /**
   * Executes this plugin. 
   * @param input the data transformed by the previous plugin that this plugin can also transform to be passed to the next one. 
   * @return if any, the input data provided by the previous plugin, transformed somehow and passed to the next plugin. 
   */
  execute(input?:any) : any;
  /**
   * priority lower numbers will execute before higher numbers
   */
  priority?: number;
}

/**
 * The PluginContainer pattern is very similar to events listeners pattern but
 * designed to let listeners hook more appropriately into some processing. One or more Plugin objects
 * are installed into a PluginContainer and the owner of the container runs container.executeAll()
 * Registered plugins will be then executed by priority order and if any input is passed 
 * it will transformed
 */
export interface IPluginContainer extends EventEmitter {

  /**
   * Executes all the plugins (see [[IPlugin.execute]], in order of priority passing the data 
   * returned by previous plugin as input of the next plugin, if any. If a plugin throws an 
   * exception [[pluginException]] will be emitted. 
   * @param input. Optional. The input that the first plugin receives and transform.
   * @return the output, if any
   */
  executeAll(input?: any): any | void;

  /**
   * add given plugin instance in this container
   */
  install(plugin: IPlugin): void;

  /**
   * Remove an given plugin instance or plugin with given name from this container
   */
  uninstall(plugin: IPlugin | string): void;

  on(eventName: 'plugin-exception', eventHandler: typeof pluginException): this;  

  on(eventName: 'plugin-success', eventHandler: typeof pluginSuccess): this;  

  on(eventName: 'plugin-before-execute', eventHandler: typeof pluginBeforeExecute): this;  
}
/** Information about the exception ocurred in [[pluginException]] */
export interface IPluginExceptionEvent {
  plugin: IPlugin;
  error: Error;
  input: any;
}
/**
 * Triggered by [[executeAll]] when there is an exception in one of the plugins executions.
 * Register to this event by using `container.on('plugin-exception', ...)`
 * @asMemberOf IPluginContainer
 * @event
 */
export declare function pluginException(event: IPluginExceptionEvent):void;


/** Information about the context of [[pluginBeforeExecute]] */
export interface IPluginBeforeExecuteEvent {
  plugin: IPlugin;
  input: any;
}
/**
 * Triggered by [[executeAll]] just before calling [[execute]] on a plugin
 * Register to this event by using `container.on('plugin-before-execute', ...)`
 * @asMemberOf IPluginContainer
 * @event
 */
export declare function pluginBeforeExecute(event: IPluginExceptionEvent):void;


/** Information about context of [[pluginBeforeExecute]] */
export interface IPluginSuccessEvent {
  plugin: IPlugin;
  result: any;
}
/**
 * Triggered by [[executeAll]] right after a plugin's [[execute]] call finish.
 * Register to this event by using `container.on('plugin-success', ...)`
 * @asMemberOf IPluginContainer
 * @event
 */
export declare function pluginSuccess(event: IPluginSuccessEvent):void;
