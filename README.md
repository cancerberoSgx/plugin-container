# Plugin container

 Plugin-container is a design pattern similar to Observer, but with ore emphasis on data processing, state change, and cancelable actions.   
 
 Powerfull and simple pattern to add extension points to your APIs or frameworks.  

# Install 

```sh
npm install --save plugin-container
```

# Usage

```js
import { PluginContainer } from 'plugin-container';
const plugins = new PluginContainer();
plugins.install({
  name: 'secondPlugin',
  priority: 2,
  execute(input) {
    return `avacadabra${input}flumflumblablasrpic`;
  },
});
plugins.install({
  name: 'first plugin',
  priority: 1,
  execute(input) {
    return input.replace(/blabla/gi, 'loremipsum');
  },
});

const input = 'hello world blabla world';
output = plugins.executeAll((str = 'hello world blabla world'));
// the output is the transformation, in orther, of all the plugins, in this case:
// 'avacadabrahello world loremipsum worldflumflumloremipsumsrpic'
```