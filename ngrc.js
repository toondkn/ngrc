import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { camelCaseIt, kebabCaseIt } from 'case-it'

// A function that converts an angularjs scope object into a props object for a react component.
function scopeToProps(scope, funcWrapper) {
    const props = {}
    for (const [key, value] of Object.entries(scope)) {
        const propKey = camelCaseIt(key)
        if (typeof value === 'function') {
            props[propKey] = funcWrapper(value)
        }
        else {
            props[propKey] = value
        }
    }
    return props
}


export default function (Component, propAttrPrefix) {
    // We don't just use generate bindings for any attribute,
    // because we may want to set some arbitrary attributes on the wrapper element itself.
    // Be they regular HTML attributes, or angularjs specific ones.
    // So we simply ask for a prefix.
    const bindings = {}
    // Use a react component's ngBindings definition to generate 
    if (typeof Component.ngBindings === 'object') {
        for (const [propName, bindingType] of Object.entries(Component.ngBindings)) {
            const propNameAttr = kebabCaseIt(propName)
            // Angularjs expects bindings to be defined in camelCase,
            // even though you pass them with kebab-cased attributes on the component element.
            bindings[camelCaseIt(`${propAttrPrefix}${propNameAttr}`)] = bindingType
        }
    }

    return {
        bindings,
        // We use this kind of controller definition because it doesn't break after minification.
        controller: ['$element', '$attrs', '$rootScope', ($element, $attrs, $rootScope) => {
            console.log($element)
            console.log($attrs)

            // Since the functions passed to a react component can update a scope variable,
            // we need to wrap the function to trigger a digest cycle after it executes.
            function wrapFuncWithDigest(callback) {
                return (...args) => {
                    callback(...args)
                    $rootScope.$apply()
                }
            }

            // Note: angular sets 'this' to the '$scope'
            const scope = this

            // Handle angularjs <-> react component lifecycle syncing.
            const mountEl = $element[0]
            this.$onInit = () => {
                render(React.createElement(Component, scopeToProps(scope, wrapFuncWithDigest), mountEl))
            }
            this.$onChanges = () => {
                render(React.createElement(Component, scopeToProps(scope, wrapFuncWithDigest), mountEl))
            }
            this.$onDestroy = () => {
                unmountComponentAtNode(mountEl)
            }
        }],
    }
}
