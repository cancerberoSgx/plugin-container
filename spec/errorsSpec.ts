import { PluginContainer } from '../src/index';

xdescribe('errors in plugins', () => {
  let container:PluginContainer;
  beforeEach(() => {
    container = new PluginContainer();
  });
  
  it('plugin throw exception shouldallow the rest of plugins to execute, by default', () => {
    container.install({
      name: 'thrower plugin',
      execute(input) {
        throw Error('thrower!');
      },
    });
    expect(1).toBe(1);
  });
});
