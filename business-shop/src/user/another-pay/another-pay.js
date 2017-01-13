angular.module("App.User.AnotherPay", []).controller("App.User.AnotherPay.Controller", [
    "$scope",
    "$state",
    "$ionicActionSheet",
    "$ionicModal",
    "$ionicHistory",
    "Member",
    "$ionicPopup",
    "Loading",
    function(
        $scope,
        $state,
        $ionicActionSheet,
        $ionicModal,
        $ionicHistory,
        Member,
        $ionicPopup,
        Loading
    ) {
        $scope.page = 1;
        $scope.limit = 10;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;

        $scope.back = function() {
            $ionicHistory.goBack();
        };

        $scope.doRefresh = function(type) {
            $scope.order_list = [];
            $scope.page = 1;
            $scope.loadMore(type, true);
        }

        $scope.onTabSelected = function (type) {
            $scope.loadMore(type, true)
        }

        //上拉加载
        $scope.order_list = []
        $scope.loadMore = function(type, is_refresh) {
            console.log(is_refresh)
            if(is_refresh){
                $scope.page = 1
                $scope.order_list = []
                $scope.moreDataCanBeLoaded = true
            }
            //处理参数，如果没传参
            var params = {
                page: $scope.page,
                limit: $scope.limit,
                status: type
            }

            //获取列表数据
            Member.helpBuyList(params).$promise.then(function(order) {
                if (order.total == 0) {
                    $scope.moreDataCanBeLoaded = false;
                    $scope.noData = true;
                    $scope.isShow = true;
                    $scope.$broadcast('scroll.refreshComplete');
                } else {
                    $scope.AllPage = Math.ceil(order.total / $scope.limit)
                    console.log($scope.AllPage)

                    angular.forEach(order.list, function(order) {
                        $scope.order_list.push(order);
                    })

                    if (is_refresh) {
                        console.log(is_refresh)
                        $scope.moreDataCanBeLoaded = true;
                        $scope.$broadcast('scroll.refreshComplete');
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }

                    if ($scope.page === $scope.AllPage) {

                        $scope.moreDataCanBeLoaded = false;
                        $scope.isShow = true;
                    }
                    $scope.page = $scope.page + 1;
                }

            }, function(error) {

            });
        }

        //为他人代付
        $scope.payAnother = function(order_id) {
            $ionicPopup.confirm({
                title: "<span class='assertive'>代付提示</span>",
                template: "确认为TA代付？",
                cancelText: "取消",
                okText: "确定"
            }).then(function(res) {
                console.log(res);
                if (res) {
                    $state.go("order.anotherPay", {order_id: order_id})
                }
            })
        }

        //取消代付
        $scope.cancelPayAnother = function(order_id) {
            $ionicPopup.confirm({
                title: "<span class='assertive'>代付提示</span>",
                template: "确认取消为TA代付？",
                cancelText: "取消",
                okText: "确定"
            }).then(function(res) {
                console.log(res);
                if (res) {
                    Member.helpBuyDeny({
                        id: order_id
                    }).$promise.then(function(response) {
                        Loading.hide();
                        $ionicPopup.alert({
                            title: '拒绝代付成功',
                            okText: "确定"
                        });

                        //如果当前页面是待付款状态
                        console.log(order_id)
                        for (var i = 0; i < $scope.order_list.length; i++) {
                            if ($scope.order_list[i].id == order_id) {
                                $scope.order_list.splice(i, 1);
                                break;
                            }
                        }

                        //$scope.doRefresh();

                    }, function(response) {
                        Loading.hide();
                        $ionicPopup.alert({
                            title: '拒绝代付失败',
                            okText: "确定",
                            template: response.message
                        });
                    });
                }
            })
        }


    }
])
