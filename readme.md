# ngrc


## What is `ngrc`?

`ngrc` is an ES module to generate angular (1.5+) component definitions from react components.

Pass scope variables as props, define callbacks in your controllers and call them from react components,... Enables you to build anything with react components _inside_ angular.

Simple, very lightweight, to the point.


## What is supported?

- `angular` 1.5+, <2
- `react` function/class components
- internally, only `'<'` bindings are used on the angular side, which means no support for mapped function args (you won't miss out on anything though!)


## Use cases

- slowly converting a legacy angular app to react from the inside out
- ...?


## BYO[X]

Bring your own tooling and libraries:
- `react-dom`
- a minifier/transpiler setup

A transpiled and minified library is possible, but I see no use for it. It there is demand, it will be added.


# How does it work?

This package provides a function to generate an angular component definition based on a react component you pass into it.

It will infer the angular bindings from your component's `.propTypes` definition, if available.

If you are not using the `prop-types` package, or wish to only expose a subset of props as bindings, you can define a `.ngrcBinds` property on your react component. It must be an array of strings, corresponding to the names of the props you wish to expose.

`ngrc` will prefix all bindings with `"p-"` to avoid collisions with HTML attributes. This allows eg. `style="color: pink;"` and `p-style="{ backgroundColor: 'dodgerblue' }"` to co-exist.

This prefix can be customized, but not disabled.


# In action

All example code assume ES module compatible build tools and `npm` are used for your project.

`ngrc` also works just fine if angular is included with a script tag, but would make for some long-winded examples.


## First up, installing...

```sh
npm i ngrc
```


## Using a react component in an angular template, while passing in a scope variable as a prop

```js
import ngrc from 'ngrc'
import react from 'react'
import PropTypes from 'prop-types'
import angular from 'angular'

// define a react component
function MyComponent(props) {
    return (
        <div>{props.count}</div>
    )
}
MyComponent.propTypes = {
    count: PropTypes.number,
}

// your angular app
angular.module('myApp')
    // --- register your react component with angular ---
    // camelCase the component name, angular expects it this way
    .component('myComponent', ngrc(MyComponent))
    // --- this is all you need ---
    .controller('myCtrl', ['$scope', function($scope) {
        $scope.count = 42
    }])
```

Using the component in your angular templates:
```html
<!-- SNIP -->
<body ng-app="myApp">
    <div ng-controller="myCtrl">
        <!-- remember the `p-` prefix when passing in a prop via the component's element attribute. -->
        <my-component p-count="count"><my-component>
    </div>
</body>
```


## Using a react component (no `.propTypes`) in an angular template, while passing in a scope variable as a prop

```js
// SNIP
function MyComponent(props) {
    return (
        <div>{props.count}</div>
    )
}
// if you don't have/want prop-types,
// or limit the props you expose to a subset if the propTypes
MyComponent.ngrcBinds = ['count']

angular.module('myApp')
    .component('myComponent', ngrc(MyComponent))
    // SNIP
```

Using the component in your angular templates:
```html
<!-- SNIP -->
<my-component p-count="count"><my-component>
<!-- SNIP -->
```


## Using a react component (with a custom prop attribute prefix) in an angular template, while passing in a scope variable as a prop

```js
//SNIP
angular.module('myApp')
    // pass in a custom prefix as second argument to ngrc
    .component('myComponent', ngrc(MyComponent, 'customPrefix'))
    // SNIP
```

Using the component with a custom prefix in your angular templates:
```html
<!-- SNIP -->
<my-component custom-prefix-count="count"><my-component>
<!-- SNIP -->
```


## Setting up a basic data-flow from angular ⇄ react?

See the `./example` folder of the repository.