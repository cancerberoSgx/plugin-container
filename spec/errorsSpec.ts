import { PluginContainer } from '../src/index';

describe('errors in plugins', () => {
  let container:PluginContainer;
  beforeEach(() => {
    container = new PluginContainer();
  });
  
  xit('by default, plugins throwing exceptions should allow the rest of plugins to execute', () => {
    container.install({
      name: 'thrower plugin',
      priority: 1,
      execute(input:any) {
        input.badplugingreets = 'hello from bad';
        throw Error('thrower!');
      },
    });
    container.install({
      name: 'good plugin',
      priority: 2,
      execute(input:any) {
        return input.goodPluginGreets = 'hellofromgoodone';
      },
    });
    container.install({
      name: 'good pluginbefore',
      priority: 0,
      execute(input:any) {
        return input.pluginbefore = 'pluginbefore';
      },
    });
    try {
      const obj:any = {};
      var result = container.executeAll(obj);
      expect(obj.goodPluginGreets).toBe('hellofromgoodone');
    } catch (error) {
      fail(error);
    }

  });

  // TODO: a sync plugin that throws inside a settimeout


});
