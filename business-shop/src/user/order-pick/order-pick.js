angular.module("App.User.OrderPick", []).controller("App.User.OrderPick.Controller", [
    "$scope",
    "$state",
    "$ionicPopup",
    "Order",
    "Loading",
    function ($scope,
              $state,
              $ionicPopup,
              Order,
              Loading) {
        $scope.page = 1;
        $scope.limit = 10;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;
        $scope.doRefresh = function() {
            $scope.pick_list = [];
            $scope.page = 1;
            $scope.loadMore("doRefresh");
        }
        //上拉加载
        $scope.pick_list = []
        $scope.loadMore = function (type) {

            //处理参数，如果没传参
            var params = {
                page: $scope.page,
                limit: $scope.limit,
            }
            angular.forEach(params, function (value, key) {
                if (value == "" || value == null || value == undefined) {
                    delete params[key];
                }
            });
            //获取列表数据
            Order.getPickList(params).$promise.then(function (data) {
                if (data.total == 0) {
                    $scope.moreDataCanBeLoaded = false;
                    $scope.noData = true;
                } else {
                    $scope.AllPage = Math.ceil(data.total / $scope.limit)
                    angular.forEach(data.list, function (item) {
                        var count = 0;
                        item.pay_fee = parseInt(item.order.goods_fee) + parseInt(item.order.ship_fee);
                        angular.forEach(item.goods, function (value, key) {
                            count += parseInt(value['quantity']);
                            var selectedTypeList = [];
                            angular.forEach(value.attrbute_value, function (attrItem) {
                                selectedTypeList.push(attrItem.value)
                            });
                            item.goods[key].selectedType = selectedTypeList.join("、");
                        })
                        item.quantity = count;
                        $scope.pick_list.push(item);
                    })
                    console.log($scope.pick_list);
                    if (type == "doRefresh") {
                        $scope.moreDataCanBeLoaded = true;
                        $scope.$broadcast('scroll.refreshComplete');
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                    if ($scope.page === $scope.AllPage) {
                        $scope.moreDataCanBeLoaded = false;
                        $scope.isShow = true;
                    }
                    $scope.noData = false;
                    $scope.page = $scope.page + 1;
                }
            }, function (error) {

            });
        }


        //订单状态
        $scope.status = {
            '0': {
                title: '待付款',
                color: 'red'
            },
            '1': {
                title: '待发货',
                color: 'yellow'
            },
            '2': {
                title: '待收货',
                color: 'blue'
            },
            '3': {
                title: '交易完成',
                color: 'green'
            },
            '4': {
                title: '交易关闭',
                color: 'gray'
            }
        };
        //订单列表标题
        $scope.index = $state.params.status;
        if ($state.params.status == '') {
            $scope.all = true;
        }

        // Triggered on a button click, or some other target
        $scope.showPopup = function (data) {
            $scope.data = data;
            $scope.data.people_num = '';
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                templateUrl: 'user/order-pick/popup.html',
                title: '自提信息',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>确认</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.people_num) {
                                //don't allow the user to close unless he enters wifi password
                                $ionicPopup.alert({
                                    title: '自提码不能为空',
                                    okText: "确定"
                                });
                                e.preventDefault();
                            } else {
                                return $scope.data;
                            }
                        }
                    },
                    {text: '取消'}
                ]
            });
            myPopup.then(function (res) {
                console.log(res);
                Order.orderSince({id:res.id, number:res.people_num, ship_type:res.order.ship_type, shop_id:res.order.shop_id}).$promise.then(function (data) {
                    var alertPopup = $ionicPopup.alert({
                        title: '订单商品自提成功',
                        okText: "确定"
                    });
                    alertPopup.then(function () {
                        $scope.doRefresh();
                    });
                }, function (error) {
                    $ionicPopup.alert({
                        title: error.data.message,
                        okText: "确定"
                    });
                });

            });
        };

    }
])
