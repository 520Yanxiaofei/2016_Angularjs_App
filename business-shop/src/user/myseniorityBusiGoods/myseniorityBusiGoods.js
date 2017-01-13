angular.module("App.User.MyseniorityBusiGoods", []).controller("App.User.MyseniorityBusiGoods.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Loading",
    "Member",
    function(
        $scope,
        $state,
        $ionicHistory,
        Loading,
        Member
    ) {
        $scope.page = 1;
        $scope.limit = 5;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;

        $scope.back = function() {
            $ionicHistory.goBack();
        };
        //加载
        Loading.show();

        //下拉加载
        $scope.goods_list = []
        $scope.loadMore = function() {
            console.log('loadMore')
            //处理参数，如果没传参
            var params = {
                page: $scope.page,
                limit: $scope.limit
            }
            angular.forEach(params, function(value, key) {
                if (value == "" || value == null || value == undefined) {
                    delete params[key];
                }
            });

            //获取列表数据
            Member.getMyseniorityBusiGoods(params).$promise.then(function(goods_list) {
                Loading.hide();
                if (goods_list.total == 0) {
                    $scope.moreDataCanBeLoaded = false;
                    $scope.noData = true;
                } else {
                    $scope.AllPage = Math.ceil(goods_list.total / $scope.limit)

                    angular.forEach(goods_list.list, function(goods) {
                        $scope.goods_list.push(goods);

                    })


                    // if (type == "doRefresh") {
                    //     $scope.moreDataCanBeLoaded = true;
                    //     $scope.$broadcast('scroll.refreshComplete');
                    // } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    // }

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
])
