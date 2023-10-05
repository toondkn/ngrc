# ngrc


## What is `ngrc`?

`ngrc` is an ES2018 module to generate angularjs (1.5+) component definitions from react components.

It enables you to build anything with react components _inside_ an angularjs app:
- Generate an angularjs component from a react component with one trivial function call
- Use the generated components in your angularjs templates
- Pass variables from inside your templates (~=$scope) to react components
- Pass callbacks from your angularjs controllers and call them from react components
- ...

Simple, very lightweight, to the point.

This module has **no dependencies**, it only has `react` and `react-dom` as peer dependencies so you can decide on the versions of those.

You have to **bring your own ES2018+ transpiler and minifier** for generating production-ready code for the browser range you are targeting. This is almost a hard requirement for using react components in production anyway.

Liberal use of comments in `./ngrc.js` makes up for the 0% code test coverage. 🙃


## Use cases

- Enabling devs with a react background to contribute to an existing angularjs app at their full potential
- Using sweet new react components from npm in your angularjs app
- Slowly converting a legacy angularjs app to react from the inside out
- ...?


## What is supported?

- `angular` 1.5+, <2
- `react` function/class components
- Internally, only `'<'` bindings are used for angularjs component generation, which means no support for mapped function args like you would get with `'&'` bindings.

Limiting to `'<'` bindings has a nice side-effect: it forces a clean separation between angularjs and react concepts. Allowing `'&'` could result in angular's function argument object mapping to seep into your react code, making it less portable. With only `'<'` bindings, your react components are **almost guaranteed to be fully portable without refactoring**. This limitation only closes a door to potential bad code, creative coders will always find another.



# How does it work?

This package provides a function to generate an angularjs component definition based on a react component you pass into it.

It will infer the angularjs bindings from your component's `.propTypes` definition, if available.

If you are not using the `prop-types` package, or wish to only expose a subset of props as bindings, you can define a `.ngrcBinds` property on your react component. It must be an array of strings, corresponding to the names of the props you wish to expose. You can assign `.ngrcBinds` from outside your component code to increase your component's portability.

`ngrc` will prefix all bindings with `"p-"` to avoid collisions with HTML attributes. This allows eg. `style="color: pink;"` and `p-style="{ backgroundColor: 'dodgerblue' }"` to co-exist.

This prefix can be customized, but not disabled.


# Learn by example

All example code assumes ES module compatible build tools and `npm` are used for your project.


## First up, installing...

```sh
npm i ngrc
```


## Using a react component in an angularjs template, while passing in a scope variable as a prop

```js
import ngrc from 'ngrc'
import react from 'react'
import PropTypes from 'prop-types'
import angularjs from 'angular'

// define a react component
function MyComponent(props) {
    return (
        <div>{props.value}</div>
    )
}
MyComponent.propTypes = {
    value: PropTypes.number,
}

// your angularjs app
angular.module('myApp')
    // --- register your react component with angularjs ---
    // camelCase the component name, angularjs expects it this way
    .component('myComponent', ngrc(MyComponent))
    // --- this is all you need ---
    .controller('myCtrl', ['$scope', function($scope) {
        $scope.value = 42
    }])
```

Using the component in your angularjs templates:
```html
<!-- SNIP -->
<body ng-app="myApp">
    <div ng-controller="myCtrl">
        <!-- remember the `p-` prefix when passing in a prop via the component's element attribute. -->
        <my-component p-value="value"><my-component>
    </div>
</body>
```


## Using a react component (no `.propTypes`) in an angularjs template, while passing in a scope variable as a prop

```js
// SNIP
function MyComponent(props) {
    return (
        <div>{props.value}</div>
    )
}
// if you don't have/want prop-types,
// or limit the props that get exposed to a subset of the propTypes
MyComponent.ngrcBinds = ['value']

angular.module('myApp')
    .component('myComponent', ngrc(MyComponent))
    // SNIP
```

Using the component in your angularjs templates:
```html
<!-- SNIP -->
<my-component p-value="value"><my-component>
<!-- SNIP -->
```


## Using a react component (with a custom prop attribute prefix) in an angularjs template, while passing in a scope variable as a prop

```js
//SNIP
angular.module('myApp')
    // pass in a custom prefix as second argument to ngrc
    .component('myComponent', ngrc(MyComponent, 'customPrefix'))
    // SNIP
```

Using the component with a custom prefix in your angularjs templates:
```html
<!-- SNIP -->
<my-component custom-prefix-value="value"><my-component>
<!-- SNIP -->
```


## Basic 2-way dataflow from angularjs ⇄ react

See the `./example` folder of the repository.
