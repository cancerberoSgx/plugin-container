[![Build Status](https://travis-ci.org/cancerberoSgx/plugin-container.png?branch=master)](https://travis-ci.org/cancerberoSgx/plugin-container) [![appveyor Build status](https://ci.appveyor.com/api/projects/status/w3ynfan159ejobkv/branch/master?svg=true)](https://ci.appveyor.com/project/cancerberoSgx/plugin-container/branch/master) [![codecov](https://codecov.io/gh/cancerberoSgx/plugin-container/branch/master/graph/badge.svg)](https://codecov.io/gh/cancerberoSgx/plugin-container/tree/master/packages/plugin-container/src) [![dependencies](https://david-dm.org/cancerberosgx/plugin-container/status.svg)](https://david-dm.org/cancerberosgx/plugin-container?path=packages/plugin-container) [![devDependencies](https://david-dm.org/cancerberosgx/plugin-container/dev-status.svg)](https://david-dm.org/cancerberosgx/plugin-container-dev?path=packages/plugin-container#info=devDependencies)


# Plugin container

 Plugin-container is a design pattern similar to Observer, but with ore emphasis on data processing, state change, and cancelable actions.   
 
 Powerfull and simple pattern to add extension points to your APIs or frameworks.  

# API Reference

https://cancerberosgx.github.io/plugin-container/index.html

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

const output = plugins.executeAll('hello world blabla world');
console.log(output)
// the output is the transformation, in orther, of all the plugins, in this case:
// 'avacadabrahello world loremipsum worldflumflumloremipsumsrpic'
```

# Use it in the browser

plugin-container supports very old browsers. Just use files in `build/es3`, for example, after loading plugin-container-globals.js the global variable `PluginContainer` will be available: 

```html
<script src="plugin-container-globals.js"></script>
<script>
var plugins = new PluginContainer();
....
``` 

Or you can use the AMD version if you want: 


```html
<script src="https://cdn.jsdelivr.net/npm/almond@0.3.3/almond.min.js"></script>
<script src="plugin-container-amd.js"></script>
<script>
var PluginContainer = require('PluginContainer')
var plugins = new PluginContainer();
....
``` 


# Ideas / TODOs

## Errors

if a plugin.execute throws an exception - what the container should do ? 


## asynchronous plugins

 * executeAll is sync and plugins.execute() must be sync

Proposal: 

// install an asynchronous plugin. If execute returns a promise / thenable - then the ocntainer will wait for it to resolve / reject before executing the next plugins

plugins.install({
  name: 'my-async-plugin,
  priority: 1
  execute: (input){
    return new Promise(resolve=>{
      return request('third/party/service').then(error=>{
        if(error){
          input.thirdPartyValidationError = error
          reject(error)
        }
        else{
          input.thirdPartyValidationOk=!error;
          resolve(input) // so next plugins can keep processing the input
        }
      })
    })
  }
})

// install a synchronous plugin - it wil lbe executed after the first one is resolved or rejected
plugins.install(
  name: 'my-async-plugin,
  priority: 2
  execute: function(input){
    if(input.thirdPartyValidationOk){
      doSomethingWith(input)
    }
    return input
  }
)

Questions: What is the semantics of a rejected promise ? What the container should do ? probably rejected promises have same semantics that throws. 


## Cancelling

* use case: I want my users to be able to subscribe plugins before something happens and  