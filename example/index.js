import angular from 'angular'
import ngrc from '../ngrc.js'
import HelloReact from './HelloReact'

// angularjs app
angular.module('helloAngular', [])
    .component('helloReact', ngrc(HelloReact))
    .controller('helloCtrl', ['$scope', ($scope) => {
        $scope.count = 0;
        $scope.amount = 1;
        $scope.increaseAmount = () => {
            $scope.amount++
        }
        $scope.setCount = (newCount) => {
            $scope.count = newCount
        }
    }])