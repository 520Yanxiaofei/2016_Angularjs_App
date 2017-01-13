angular.module("App.Goods.Seller", ["App.Footer"]).controller("App.Goods.Seller.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Shop",
    "dyLocation",
    function(
        $scope,
        $state,
        $ionicHistory,
        Shop,
        dyLocation
    ) {
        $scope.tab = "shop";
        // 获取行业列表
        Shop.getTopIndustry().$promise.then(function(industry_list) {
            $scope.industry_list = industry_list;
            // console.log(industry_list);
            $scope.brand_title = "全部行业";
            $scope.$watch('form.industry_id', function(newValue, oldValue) {
                console.log(newValue);
                if (newValue == 0) {
                    $scope.brand_title = "全部行业";
                } else {
                    for (var i = 0; i < $scope.industry_list.length; i++) {
                        if ($scope.industry_list[i].id == newValue) {
                            $scope.brand_title = $scope.industry_list[i].title;
                        }
                    }
                }

            }, true);
        }, function(error) {
            console.log(error);
        });

        $scope.back = function() {
            $ionicHistory.goBack();
        }

        $scope.form = {
            industry_id: "0",
            area_id: "000000",
            lat: 0,
            lng: 0
        };
        $scope.firstLoad = true;

        $scope.city = { position: [] };
        $scope.pro = "全部省份";
        //监听地址选择
        $scope.$watch('form.area_id', function(newVal, oldVal) {
            $scope.form.area_id = newVal;
            if (!$scope.firstLoad) {
                console.log(newVal);
                $scope.page = 1;
                $scope.search_list = [];
                $scope.noData = false;
                $scope.moreData = false;
                $scope.loadMore();
                if (newVal == "000000") {
                    $scope.pro = "全部省份";
                } else {
                    $scope.pro = $scope.city.position[0];
                }
            }
        })

        var showPosition = function(position) {
            $scope.form.lng = position[0];
            $scope.form.lat = position[1];
        }

        //搜索
        $scope.search = function(industry_id) {
            $scope.form.industry_id = industry_id;
            $scope.page = 1;
            $scope.search_list = [];
            $scope.noData = false;
            $scope.moreData = false;
            $scope.loadMore();
        }

        // 上拉加載更多数据
        $scope.page = 1;
        $scope.limit = 4;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;
        $scope.noData = false;
        $scope.moreData = false;

        $scope.search_list = [];

        function getList(){
            Shop.getSearchList({
                industry_id: $scope.form.industry_id,
                area_id: parseInt($scope.form.area_id),
                lat: $scope.form.lat,
                lng: $scope.form.lng,
                page: $scope.page,
                limit: $scope.limit
            }).$promise.then(function(res) {
                $scope.firstLoad = false;
                if (res.total == 0) {
                    $scope.moreDataCanBeLoaded = false;
                    $scope.noData = true;
                } else {
                    $scope.AllPage = Math.ceil(res.total / $scope.limit)
                    if ($scope.page === 1) {
                        // Loading.hide();
                    }
                    angular.forEach(res.list, function(list) {
                        $scope.search_list.push(list);
                        // Loading.hide();
                    })
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    if ($scope.page === $scope.AllPage) {
                        $scope.moreDataCanBeLoaded = false;
                        $scope.moreData = true;
                    }
                    $scope.page = $scope.page + 1;
                }

            }, function(error) {

            });
        };

        $scope.loadMore = function() {
            if ($scope.firstLoad){
                dyLocation.get().then(function(data){
                     showPosition(data);
                     getList();
                },function(error){
                    getList();
                    console.log(error);
                });
            }else{
                getList();
            }
            
        }
    }
    
]);
