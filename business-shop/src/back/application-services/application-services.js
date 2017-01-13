angular.module("App.Back.ApplicationService", []).controller("App.Back.ApplicationService.Controller", [
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