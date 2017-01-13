angular.module("App.Goods.Reward", []).controller("App.Goods.Reward.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Goods",
    "$ionicPopup",
    "Shop",
    "Member",
    "$ionicSlideBoxDelegate",
    "Loading",
    "dyLocation",
    "PickService",
    "$ionicModal",
    "$http",
    function(
        $scope,
        $state,
        $ionicHistory,
        Goods,
        $ionicPopup,
        Shop,
        Member,
        $ionicSlideBoxDelegate,
        Loading,
        dyLocation,
        PickService,
        $ionicModal,
        $http
    ) {

    	var rolename = {
            "1": {
                title: "代言粉",
            },
            "2": {
                title: "代言人"
            },
            "3": {
                title: "代言商"
            },
            "4": {
                title: "代言店"
            }
        };
	     Goods.getReward({
	            goods_id: $state.params.id,//获取浏览器第一个参数
	            shop_id: $state.params.shop_id//获取浏览器第二个参数
	        }).$promise.then(function(response) {
	            $scope.rewardList = response;
	            console.log($scope.rewardList);
	           
	            $scope.rolename = rolename[response.rid];
	        }, function(response) {
	            
	        })



    }
]);