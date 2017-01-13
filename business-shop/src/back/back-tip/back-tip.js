angular.module("App.Back.BackTip", []).controller("App.Back.BackTip.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    function(
        $scope,
        $state,
        $ionicHistory
    ) {
    	$scope.back = function(){
            $ionicHistory.goBack();
        }
    }
]);
