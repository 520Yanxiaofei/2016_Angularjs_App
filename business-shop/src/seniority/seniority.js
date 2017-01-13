angular.module("App.Seniority", []).controller("App.Seniority.Controller", [
    "$scope",
    "$state",
    "$ionicScrollDelegate",
    "$ionicSlideBoxDelegate",
    "Loading",
    "Goods",
    function(
        $scope,
        $state,
        $ionicScrollDelegate,
        $ionicSlideBoxDelegate,
        Loading,
        Goods
    ) {
        Loading.show();


        //代言资格专区banar图片
        Goods.getSeniority({app_version: "1.1.0"}).$promise.then(function(response) {
            //轮播图
            $scope.adverts = response.advert;
            $ionicSlideBoxDelegate.update();        
            $ionicSlideBoxDelegate.loop(true);
            //代言人商品
            $scope.seniority_people_list = response.spokes;
            //代言商商品
            $scope.seniority_business_list = response.dealer;

            Loading.hide();
        }, function(response) {
            console.log(response);
        })
  
        $scope.$on('$stateChangeSuccess',function(){
            window.setTimeout(function(){
                $ionicSlideBoxDelegate.stop(); 
                $ionicSlideBoxDelegate.start(); 
           },0);
        })
    }
]);
