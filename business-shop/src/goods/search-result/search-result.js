angular.module("App.Goods.SearchResult", []).controller("App.Goods.SearchResult.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Shop",
    "Loading",
    function(
        $scope,
        $state,
        $ionicHistory,
        Shop,
        Loading
    ) {
        $state.tab = "shop";
        $scope.back = function() {
            $ionicHistory.goBack();
        }

        // 下拉加载
        $scope.page = 1;
        $scope.limit = 4;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;
        $scope.noData = false;
        $scope.isShow = false;  //没有跟多数据了

        $scope.search_list = []
        $scope.loadMore = function() {
            Shop.getSearchList({
                keyword: $state.params.key,
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
                        $scope.isShow = true;
                    }
                    $scope.page = $scope.page + 1;
                }
            }, function(error) {

            });
        }
    }
]);
