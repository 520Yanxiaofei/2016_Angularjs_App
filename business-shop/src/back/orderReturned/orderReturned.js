angular.module("App.Back.OrderReturned", []).controller("App.Back.OrderReturned.Controller", [
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
        };
        
    }
])
