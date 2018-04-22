function define(name, dependencies, handler){
  var exports = {}
  handler(function(){}, exports)
  for(var i in exports){
    window[i] = exports[i]
  }
}

