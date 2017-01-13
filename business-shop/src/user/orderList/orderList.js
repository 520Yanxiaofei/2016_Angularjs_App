angular.module("App.User.OrderList", []).controller("App.User.OrderList.Controller", [
    "$scope",
    "$state",
    "$ionicActionSheet",
    "$ionicModal",
    "$ionicHistory",
    "Order",
    "$ionicPopup",
    "Loading",
    function(
        $scope,
        $state,
        $ionicActionSheet,
        $ionicModal,
        $ionicHistory,
        Order,
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

        //确定取消按钮
        $scope.ok = function() {
            console.log($scope.id)
            $scope.modal.hide();
        }

        //支付按钮
        $scope.pay = function(orderid) {
            $state.go('order.pay', {
                order_id: orderid
            });
        }

        // Model
        $ionicModal.fromTemplateUrl('user/orderList/model-backOrder.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        //取消按钮
        $scope.openModal = function(id) {
            $scope.id = id;
            $scope.modal.show();
        };

        $scope.Cancel = {
            reson: 0
        }; //取消理由

        $scope.doRefresh = function() {
                $scope.order_list = [];
                $scope.page = 1;
                $scope.loadMore("doRefresh");
            }
            //确定取消订单按钮
        $scope.ok = function() {

            Loading.show();
            Order.cancel({
                order_id: $scope.id,
                remark: $scope.Cancel.reson
            }).$promise.then(function(response) {
                Loading.hide();
                $ionicPopup.alert({
                    title: '订单取消成功',
                    okText: "确定"
                });
                $scope.modal.hide();

                //如果当前页面是待付款状态
                if ($state.params.status == '0') {
                    for (var i = 0; i < $scope.order_list.length; i++) {
                        if ($scope.order_list[i].id == $scope.id) {
                            $scope.order_list.splice(i, 1);
                            break;
                        }
                    }
                }

                $scope.doRefresh();

            }, function(response) {
                Loading.hide();
                $ionicPopup.alert({
                    title: response.data.message,
                    okText: "确定",
                    template: response.message
                });
            });
        };

        //暂不取消订单按钮
        $scope.closeModal = function() {
            $scope.modal.hide();
        };


        $scope.cancel_resons = [{
            code: 0,
            text: '不想买了'
        }, {
            code: 1,
            text: '收货信息有误'
        }, {
            code: 2,
            text: '价格太贵'
        }, {
            code: 3,
            text: '商品缺货'
        }, {
            code: 4,
            text: '无法支付'
        }];




        // 快递确认收货
        $scope.comfirmGoods = function(id) {
            $ionicPopup.confirm({
                title: "<span class='assertive'>收货提示</span>",
                template: "请签收快递后，再点击确认收货",
                cancelText: "取消",
                okText: "确定"
            }).then(function(res) {
                // console.log(res);
                if (res) {
                    Order.receiptConfirm({
                        order_id: id
                    }).$promise.then(function(response) {
                        for (var i = 0; i < $scope.order_list.length; i++) {
                            if ($scope.order_list[i].id == id) {
                                if($state.params.status == "2"){
                                    $scope.order_list.splice(i, 1);
                                }else {
                                    $scope.order_list[i].status = 3;
                                }
                                break;
                            }
                        }
                        $ionicPopup.alert({
                            title: '确认收货成功，交易已完成',
                            okText: "确定"
                        });
                    }, function(response) {
                        $ionicPopup.alert({
                            title: response.data.message,
                            okText: "确定"
                        });
                    });
                }
            })
        }


        //上拉加载
        $scope.order_list = []
        $scope.loadMore = function(type) {

            //处理参数，如果没传参
            var params = {
                page: $scope.page,
                limit: $scope.limit,
                status: $state.params.status
            }
            angular.forEach(params, function(value, key) {
                if (value == "" || value == null || value == undefined) {
                    delete params[key];
                }
            });

            //获取列表数据
            Order.getOrderList(params).$promise.then(function(order) {
                if (order.total == 0) {
                    $scope.moreDataCanBeLoaded = false;
                    $scope.noData = true;
                } else {
                    $scope.AllPage = Math.ceil(order.total / $scope.limit)

                    angular.forEach(order.list, function(order) {
                        var selectedTypeList = []
                        angular.forEach(order.goods[0].attrbute_value, function(detailItem) {
                            selectedTypeList.push(detailItem.value)
                        });
                        order.selectedType = selectedTypeList.join("、")
                        $scope.order_list.push(order);

                    })


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
                    $scope.page = $scope.page + 1;
                }

            }, function(error) {

            });
        }



        //订单状态
        $scope.status = {
            '0': {
                title: '待付款',
                color: 'red'
            },
            '1': {
                title: '已支付',
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

        //改变路由时销毁modal
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });


    }
])
