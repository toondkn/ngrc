import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

// naive functions to add or remove a str prefix (handles it camelCased)
function addCcPrefix(prefix, str) {
    return prefix + str.charAt(0).toUpperCase() + str.slice(1)
}
function removeCcPrefix(prefix, str) {
    const withoutPrefix = str.slice(prefix.length)
    return withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1)
}

function ngrc(Component, bindPrefix = 'p') {
    // return early if Component argument is unsatisfactory,
    if (!Component) {
        console.warn('ngrc: Did you forget to pass a react component?')
        return {}
    }
    if (Component.ngrcBinds && !Array.isArray(Component.ngrcBinds)) {
        console.warn('ngrc: [Component].ngrcBinds must be an array!')
        return {}
    }
    if (!bindPrefix) {
        console.warn('ngrc: Did you pass in a bind-prefix (nrgc() 2nd arg) that isn\'t a string of at least length 1?')
        return {}
    }

    let binds
    // set binds from [Component].ngrcBinds,
    if (Array.isArray(Component.ngrcBinds)) {
        binds = Component.ngrcBinds
    }
    // or infer them from Component's propTypes definition
    if (!binds && typeof Component.propTypes === 'object') {
        binds = Object.keys(Component.propTypes)
    }

    // create angular bindings object
    const bindings = {}
    for (const bind of (binds || [])) {
        // we keep it simple: one-way binding only! why?:
        // - disallows use of boilerplatey syntax due to angular func arg mapping obj (with '&' binding)
        // - makes this code way simpler
        // - '<' works for regular variables as well as functions
        // - behaves the most like actual react props
        bindings[addCcPrefix(bindPrefix, bind)] = '<'
    }

    // return angular controller definition object with a dash of react interop
    return {
        bindings,
        controller: ['$element', '$rootScope', function ($element, $rootScope) {
            // NOTE: angular passes in the component scope into `this`
            // it's the reason why the controller function is a regular anon func
            // instead of an arrow function
            // it's also the reason why we _have_ to define the below function in this scope,
            // because `$rootScope.$apply()` uses `this` internally!...

            // a function that returns a function,
            // with a rootScope.apply(), which wraps the passed in function
            function wrapWithApply(func) {
                return (...args) => {
                    func(...args)
                    // trigger an angular "re-render"
                    $rootScope.$apply()
                }
            }
            
            // get root component of angular component
            const mountEl = $element[0]

            // map angular <-> react lifecycles
            // $onChanges is called before $onInit..., which is great for us:
            // it means we only have to define $onChanges and not $onInit to cover all bases!
            this.$onChanges = () => {
                // react will just re-render the component if it is already mounted at the mountEl!
                render(
                    React.createElement(
                        Component,
                        scopeToProps(this, bindPrefix, bindings, wrapWithApply),
                    ),
                    mountEl
                )
            }
            this.$onDestroy = () => {
                // clean up react component
                unmountComponentAtNode(mountEl)
            }
        }],
    }
}

// massage angular scope object into a props object:
// - only include bound scope properties
// - wrap functions with passed in wrapFunc
function scopeToProps(scope, bindPrefix, bindings, wrapFunc) {
    const props = {}
    for (const [key, value] of Object.entries(scope)) {
        if (bindings[key]) {
            const propName = removeCcPrefix(bindPrefix, key)
            if (typeof value === 'function') {
                props[propName] = wrapFunc(value)
            }
            else {
                props[propName] = value
            }
        }
    }
    return props
}


export default ngrc