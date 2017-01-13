angular.module("App.Goods", ["App.Goods.Search","App.Goods.Detail","App.Goods.Seller","App.Goods.SearchResult","App.Goods.SearchGoods","App.Goods.Change","App.Goods.Reward"]).controller("App.Goods.Controller", [
    "$scope",
    "$state",
    function(
        $scope,
        $state
    ) {
        $scope.onTouch = function() {
               $state.go("user");
        }
    }
]);
