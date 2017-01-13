angular.module('App.Mine', ['App.Mine.Show']).controller('App.Mine.Controller', [
    '$rootScope',
    '$scope',
    '$stateParams',
    '$q',
    '$location',
    '$window',
    '$timeout',
    function(
        $rootScope,
        $scope,
        $stateParams,
        $q,
        $location,
        $window,
        $timeout
    ) {
        $scope.onSlideMove = function(data) {
            console.log("You have selected " + data.index + " tab");
        };

    }
])

