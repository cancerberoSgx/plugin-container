import { create, IPluginContainer, IPluginContainerConfig } from '../src/index';

describe('errors in plugins', () => {
  let container:IPluginContainer;
 
  function createContainerAndInstallPlugins(config?:IPluginContainerConfig) {
    container = create(config);
    container.install({
      name: 'thrower plugin',
      priority: 2,
      execute(input:any) {
        input.badPluginGreets = 'helloFromBadPlugin';
        throw Error('thrower!');
      },
    });
    container.install({
      name: 'good plugin',
      priority: 3,
      execute(input:any) {
        input.goodPluginGreets = 'helloFromGoodOne';
        return input;
      },
    });
    container.install({
      name: 'good firstPlugin',
      priority: 1,
      execute(input:any) {
        input.firstPlugin = 'firstPluginGreet';
        return input;
      },
    });
  }

  it('by default, plugins throwing exceptions should allow the rest of plugins to execute', () => {
    createContainerAndInstallPlugins();
    const obj:any = {};
    try {
      const result = container.executeAll(obj);
      expect(obj.goodPluginGreets).toBe('helloFromGoodOne');
      expect(obj.firstPlugin).toBe('firstPluginGreet');
      expect(obj.badPluginGreets).toBe('helloFromBadPlugin');
    } catch (error) {
      fail(error);
    }
  });

  it('onErrorPolicy==break should not throw but should now allow following plugins to execute', () => {
    createContainerAndInstallPlugins({ onErrorPolicy: 'break' });
    const obj:any = {};
    try {
      const result = container.executeAll(obj);
      expect(obj.firstPlugin).toBe('firstPluginGreet');
      expect(obj.goodPluginGreets).toBe(undefined);
      expect(obj.badPluginGreets).toBe('helloFromBadPlugin');
    } catch (error) {
      fail(error);
    }
  });

  // TODO: a sync plugin that throws inside a settimeout


});
