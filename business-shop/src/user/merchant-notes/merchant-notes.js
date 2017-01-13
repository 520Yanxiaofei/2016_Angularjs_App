angular.module("App.User.MerchantNotes", []).controller("App.User.MerchantNotes.Controller", [
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
    	// 是否已经阅读须知
    	$scope.btn_readme = false;
    	
    }
]);
