angular.module("App.Order", ["App.Order.OrderAddress", "App.Order.Orderfill","App.Order.Pay", "App.Order.OrderAppointment", "App.Order.AnotherPayInfo", "App.Order.Anotherpay"]).controller("App.Order.Controller", [
	"$scope",
	"$state",
	function(
		$scope,
		$state
	) {


	}
]);
angular.module('App.Order').service('PickService',[function(){
    var list={};
    function get(id){
        return list[id] || '';
    };
    function set(id,obj){
        list[id]=obj;
    };
    function clear(){
        list={};
    }

    return {
        get:get,
        set:set,
        clear:clear
    };
}]);