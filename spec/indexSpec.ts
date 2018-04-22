import { PluginContainer } from '../src/index';

describe('Plugin Container', () => {
  let plugins;
  // two plugin that perform some modification in a string.
  let plugin1;
  let plugin2;
  let str;
  let output;

  it('init', () => {
    plugin1 = {
      name: 'p1',
      priority: 1,
      execute(input) {
        return input.replace(/blabla/gi, 'loremipsum');
      },
    };
    plugin2 = {
      name: 'p2',
      priority: 2,
      execute(input) {
        return `avacadabra${input}flumflumblablasrpic`;
      },
    };
    str = 'hello world blabla world';
  });

  it('registration of prioritized plugins', () => {
    plugins = new PluginContainer();
    str = 'hello world blabla world';
    output = plugins.executeAll(str);
    expect(output).toBe(str);
    plugins.install(plugin1);
    output = plugins.executeAll(str);
    expect(output).toBe('hello world loremipsum world');
  });

  it('plugin uninstall', () => {
    plugins.uninstall(plugin1);
    output = plugins.executeAll(str);
    expect(output).toBe(str);
  });

  it('plugin are executed according priority', () => {
    plugins.install(plugin2);
    plugins.install(plugin1);
    output = plugins.executeAll(str);
    expect(output).toBe('avacadabrahello world loremipsum worldflumflumloremipsumsrpic');
    // delete all
    plugins.uninstall(plugin1);
    plugins.uninstall(plugin2);
    output = plugins.executeAll(str);
    expect(output).toBe(str);
    // install them again but in different order and it should output the same thing.
    plugins.install(plugin1);
    plugins.install(plugin2);
    output = plugins.executeAll(str);
    expect(output).toBe('avacadabrahello world loremipsum worldflumflumloremipsumsrpic');
  });
});
