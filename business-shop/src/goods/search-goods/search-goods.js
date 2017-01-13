angular.module("App.Goods.SearchGoods", []).controller("App.Goods.SearchGoods.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Goods",
    "Loading",
    function(
        $scope,
        $state,
        $ionicHistory,
        Goods,
        Loading
    ) {
        $state.tab = "find";
        var key = $state.params.key; // 搜索关键字
        $scope.brand_id = "0"; //品牌
        $scope.category_id = $state.params.category_id || "0"; //分类  

        if ($ionicHistory.viewHistory().backView != null && $ionicHistory.viewHistory().backView.stateName == "goods.search") {
            $scope.page_title = "商品搜索列表";
        } else {
            $scope.page_title = "全部精品";
        }

        // 返回
        $scope.back = function() {
            $ionicHistory.goBack();
        }

        // 获取行业列表
        Goods.getBrandList().$promise.then(function(brand_list) {
            $scope.brand_list = brand_list;
            $scope.brand_title = "全部品牌";
            $scope.$watch('brand_id', function(newValue, oldValue) {
                // console.log(newValue);
                if (newValue == 0) {
                    $scope.brand_title = "全部品牌";
                } else {
                    for (var i = 0; i < $scope.brand_list.list.length; i++) {
                        if ($scope.brand_list.list[i].id == newValue) {
                            $scope.brand_title = $scope.brand_list.list[i].title;
                        }
                    }
                }
            }, true);
        }, function(error) {
            console.log(error)
        });

        // 获取商品分类（二级分类）
        Goods.getCategoryList().$promise.then(function(category_list) {
            $scope.category_list = category_list;
            // console.log(category_list);
            $scope.category_title = "全部分类";
            $scope.$watch('category_id', function(newValue, oldValue) {
                // console.log(newValue);
                if (newValue == 0) {
                    $scope.category_title = "全部分类";
                } else {
                    for (var i = 0; i < $scope.category_list.length; i++) {
                        if ($scope.category_list[i].id == newValue) {
                            $scope.category_title = $scope.category_list[i].title;
                        }
                    }
                }
            }, true);

        }, function(error) {
            console.log(error);
        });

        // 根据条件搜索
        $scope.searchByBrand = function(brand) {
            $scope.brand_id = brand;
            $scope.page = 1;
            $scope.limit = 4;
            $scope.AllPage = 0;
            $scope.noData = false;
            $scope.moreData = false;
            $scope.search_list = [];

            $scope.loadMore();
        }

        $scope.searchByCategory = function(category) {
                $scope.category_id = category;
                $scope.page = 1;
                $scope.limit = 4;
                $scope.AllPage = 0;
                $scope.noData = false;
                $scope.moreData = false;
                $scope.search_list = [];
                $scope.loadMore();
            }
            //上拉加载数据
        $scope.page = 1;
        $scope.limit = 5;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;
        $scope.noData = false;
        $scope.moreData = false;
        $scope.search_list = [];
        $scope.loadMore = function() {
            Goods.getSearchList({
                title: key,
                brand_id: $scope.brand_id,
                category_id: $scope.category_id,
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
                        $scope.search_list.push(list);
                    })
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    if ($scope.page === $scope.AllPage) {
                        $scope.moreDataCanBeLoaded = false;
                        $scope.moreData = true;
                    } else {
                        $scope.page = $scope.page + 1;
                        $scope.moreDataCanBeLoaded = true;
                    }
                }
            }, function(error) {

            });
        }

    }
]);
