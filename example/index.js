import ngrc from '../ngrc.js'
import React from 'react'
import angular from 'angular'

// react component
function HelloReact({
    count,
    amount,
    handleIncrement,
    ...props
}) {
    return (
        <div style={{ backgroundColor: 'dodger' }} {...props}>
            <h1>Hello from react!</h1>
            <p>count: {count}</p>
            <button
                onClick={() => { handleIncrement(count + amount) }}
            >&plus; {amount}</button>
        </div>
    )
}

// angularjs code
angular.module('helloAngular', [])
    .component("helloReact", ngrc(HelloReact, 'rp'))
    .controller('helloCtrl', ['$scope', ($scope) => {
        $scope.count = 0;
        $scope.amount = 3;
        $scope.setCount = (newCount) => {
            $scope.count = newCount
        }
    }])