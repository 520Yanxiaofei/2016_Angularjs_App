angular.module('App.Goods', ["App.Goods.Classification", "App.Goods.Publish", "App.Goods.Add","App.Goods.Shelves","App.Goods.Unreleased","App.Goods.Unshelves"]).controller('App.Goods.Controller', [
    '$scope',
    '$state',
    "Goods",
    function(
        $scope,
        $state
    ) {

       console.log('asdsa')
    }
]);