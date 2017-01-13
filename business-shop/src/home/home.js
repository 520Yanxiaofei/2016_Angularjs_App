angular.module("App.Home", ["App.Footer"]).controller("App.Home.Controller", [
    "$scope",
    "$state",
    "$ionicScrollDelegate",
    "$ionicSlideBoxDelegate",
    "Loading",
    "Home",
    "System",
    function(
        $scope,
        $state,
        $ionicScrollDelegate,
        $ionicSlideBoxDelegate,
        Loading,
        Home,
        System
    ) {
        //loading页面加载
        $scope.tab = "home";

        // 是否显示迷你搜索按钮
        $scope.miniSearch = {
            search : false
        };
        $scope.contentScroll = function() {
            var topSize = $ionicScrollDelegate.getScrollPosition().top;
            if (topSize >= 230) {
                $scope.miniSearch.search = true;
            }
            if(topSize < 230){
                $scope.miniSearch.search = false;
            }
            $scope.$apply();
        }
        // 下拉刷新
        $scope.doRefresh = function() {
            $scope.$broadcast('scroll.refreshComplete');
        }

        // 精品小店
        Home.getShopList({ limit: 4 }).$promise.then(function(response) {
            $scope.recommend_shops = response;
            // console.log($scope.recommend_shops);
        }, function(response) {
            console.log(response);
        })

        // 下拉加载
        $scope.page = 1;
        $scope.limit = 10;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;
        $scope.noData = false;
        $scope.noMoreData = false; //没有跟多数据了

        $scope.goods_list = []
        $scope.loadMore = function() {
            Home.getGoodsList({
                page: $scope.page,
                limit: $scope.limit
            }).$promise.then(function(res) {
                if (res.total == "0") {
                    $scope.noData = true;
                    $scope.moreDataCanBeLoaded = false;
                } else {
                    $scope.AllPage = Math.ceil(res.total / $scope.limit)
                    if ($scope.page === 1) {
                        Loading.hide();
                    }
                    angular.forEach(res.list, function(list) {
                        $scope.goods_list.push(list);
                    })
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    if ($scope.page === $scope.AllPage) {
                        $scope.moreDataCanBeLoaded = false;
                        $scope.noMoreData = true;
                    }
                    $scope.page = $scope.page + 1;
                }
            }, function(error) {
                console.log(error);
            });
        }

        // get top adverts
        var advert_params = {
            advert_id: 1,
            app_version: 9.0,
            type: 3
        }
        System.getAdverts(advert_params).$promise.then(function(response) {
            $scope.adverts = response;
            $ionicSlideBoxDelegate.update();        
            $ionicSlideBoxDelegate.loop(true);
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
