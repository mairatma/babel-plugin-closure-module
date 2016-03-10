babel-plugin-closure-module
===================================

A plugin that helps integrate closure modules into babel projects.

It wraps any modules defined by `goog.module` inside `goog.loadModule` calls, as explained in [closure library's docs](https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide#bundling-googmodule-files-with-other-javascript).

## Usage

This is a [babel plugin](http://babeljs.io/docs/plugins/). To use it, just add it to your package.json and pass it as a plugin when calling babel:

```javascript
{
  "plugins": ["closure_module"]
}
```
