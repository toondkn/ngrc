# ngrc


## What is ngrc?

ES module to generate angularjs (1.5+) component definitions from react components.

Pass scope variables as props, define callbacks in your controllers and call them from your react components,... Enables you to build 

Simple, very lightweight, to the point.


## What is supported?

- `angularjs` 1.5+
- `react` function/class components
- internally, only `'<'` bindings are used on the angularjs side, which means no support for mapped function args


## Use cases?

- slowly converting a legacy angularjs app to react from the inside out
- just for fun
- ...


## BYOT

Bring your own tooling and libraries:
- `react-dom`
- minifier/transpiler

Transpiled and minified library is possible, if there is demand.


## The name?

- `ngrc` = `ng` + `rc`
- `ng` = angularjs
- `rc` = react component


# How does it work?

This package provides a function to generate an angularjs component definition, based on a react component you pass into it.

It will infer the angularjs bindings from your component's `.propTypes` definition, if available.

If you are not using the `prop-types` package, or wish to only expose a subset of props as bindings, you can define a `.ngrcBinds` property on your react component. It must be an array of strings, corresponding to the names of the props you wish to expose.

`ngrc` will prefix all bindings with `"p-"` to avoid collisions with HTML attributes. This allows eg. `style="color: pink;"` and `p-style="{ backgroundColor: 'dodgerblue' }"` to co-exist.

This prefix can be customized, but not disabled.


# In action

All examples assume ES module compatible build tools and importing angular with a package manager.

Also works just fine if angularjs is included with a script tag, but would make for some long-winded examples.


## Using a react component in an angularjs template, while passing in a prop

```js
import ngrc from 'ngrc'
import react from 'react'
import PropTypes from 'prop-types'
import angular from 'angular'

// define component
function MyComponent(props) {
    return (
        <div>{props.count}</div>
    )
}
MyComponent.propTypes = {
    count: PropTypes.number,
}

// register it as angularjs component
angular.module('myApp')
    .component('myComponent', ngrc(MyComponent))
    .controller('myCtrl', ['$scope', function($scope) {
        $scope.count = 42
    }])
```
**Note: camelCase the component name, angularjs expects it this way.**


Use the component in your angular template
```html
<!-- SNIP -->
<body ng-app="myApp">
    <div ng-controller="myCtrl">
        <my-component p-count="count"><my-component>
    </div>
</body>
```
**Note: remember the `p-` prefix when passing in a prop via the component's element attribute.**


