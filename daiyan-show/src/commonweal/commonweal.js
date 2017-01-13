angular.module("App.Commonweal", ["App.Commonweal.Draft","App.Commonweal.Competition","App.Commonweal.Contribution","App.Commonweal.add", "App.Commonweal.Detail"]).controller("App.Commonweal.Controller", [
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

angular.module('App.Commonweal').service('PickService',[function(){
    var list={};
    function get(id){
        return list[id] || '';
    };
    function set(id,obj){
        list[id]=obj;
    };
    return {
        get:get,
        set:set
    };
}]);
