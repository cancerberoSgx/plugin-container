import { PluginContainer } from '../src/index';

describe('errors in plugins', () => {
  let container:PluginContainer;
  beforeEach(() => {
    container = new PluginContainer();
  });
  
  it('by default, plugins throwing exceptions should allow the rest of plugins to execute', () => {
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
        input.goodPluginGreets = 'hellofromgoodone';
        return input;
      },
    });
    container.install({
      name: 'good pluginbefore',
      priority: 0,
      execute(input:any) {
        input.pluginbefore = 'pluginbefore';
        return input;
      },
    });
    try {
      const obj:any = {};
      const result = container.executeAll(obj);
      expect(obj.goodPluginGreets).toBe('hellofromgoodone');
    } catch (error) {
      fail(error);
    }

  });

  // TODO: a sync plugin that throws inside a settimeout


});
