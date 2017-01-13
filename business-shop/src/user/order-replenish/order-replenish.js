angular.module("App.User.OrderReplenish", []).controller("App.User.OrderReplenish.Controller", [
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
        $scope.replenish_status_value = '-1';
        $scope.page = 1;
        $scope.limit = 10;
        $scope.AllPage = 0;
        $scope.form = {
            cur_keyword: ''
        }
        $scope.moreDataCanBeLoaded = true;
        $scope.doRefresh = function () {
            $scope.replenish_list = [];
            $scope.page = 1;
            $scope.loadMore("doRefresh");
        }
        //上拉加载
        $scope.replenish_list = []
        $scope.loadMore = function (type) {
            //处理参数，如果没传参
            var params = {
                replenish_status_value: $scope.replenish_status_value,
                search: $scope.form.cur_keyword,
                page: $scope.page,
                limit: $scope.limit,
            }
            angular.forEach(params, function (value, key) {
                if (value == "" || value == null || value == undefined) {
                    delete params[key];
                }
            });
            //获取列表数据
            Order.getReplenishList(params).$promise.then(function (data) {
                $scope.count = data.count;
                $scope.shop_count = data.shop_count;

                angular.forEach($scope.shop_count, function (value, key) {
                    $scope.shop_count[key]['checked'] = true;
                });
                if (data.total == 0) {
                    $scope.moreDataCanBeLoaded = false;
                    $scope.noData = true;
                    $scope.isShow = false;
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
                        $scope.replenish_list.push(item);
                    })
                    if (type == "doRefresh") {
                        $scope.moreDataCanBeLoaded = true;
                        $scope.$broadcast('scroll.refreshComplete');
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }

                    if ($scope.page === $scope.AllPage) {
                        $scope.moreDataCanBeLoaded = false;
                        $scope.noData = false;
                        $scope.isShow = true;
                    }
                    $scope.page = $scope.page + 1;
                }
            }, function (error) {

            });
        }
        $scope.filterList = function (replenish_status_value) {
            $scope.replenish_list = [];
            $scope.page = 1;
            $scope.replenish_status_value = replenish_status_value;
            $scope.loadMore();
        }
        $scope.replenishApply = function (item) {
            var params = {pick_id: item.id};
            Order.replenishApply(params).$promise.then(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: '补货申请成功',
                    okText: "确定"
                });
                alertPopup.then(function () {
                    // item.replenish_status = 1;
                    $scope.doRefresh();
                });
            }, function (error) {
                $ionicPopup.alert({
                    title: error.data.message,
                    okText: "确定"
                });
            });
        }
        $scope.replenishReceipt = function (item) {
            var params = {
                pick_id: item.id,
            }
            var confirmPopup = $ionicPopup.confirm({
                cancelText: '取消',
                okText: '确定',
                title: '是否确认收货?',
            });

            confirmPopup.then(function (res) {
                if (res) {
                    Order.replenishReceipt(params).$promise.then(function (data) {
                        item.replenish_status = 3;
                    }, function (error) {
                        $ionicPopup.alert({
                            title: error.data.message,
                            okText: "确定"
                        });
                    });
                } else {
                }
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
            '5': {
                title: '交易完成',
                color: 'green'
            },
            '4': {
                title: '交易关闭',
                color: 'gray'
            }
        };
        //订单补货状态
        $scope.replenish_status = {
            '0': {
                title: '可补货',
                color: 'red'
            },
            '1': {
                title: '已申请补货',
                color: 'yellow'
            },
            '2': {
                title: '已发货',
                color: 'blue'
            },
            '3': {
                title: '补货成功',
                color: 'green'
            },
        };
        $scope.replenish_button = {
            '0': "申请补货",
            '2': '确认收货',
        };
        //订单列表标题
        $scope.index = $state.params.status;
        if ($state.params.status == '') {
            $scope.all = true;
        }
        $scope.flag_selectCard = false;
        //补货选择
        $scope.selectType = {
            showSelectType: function () {
                $scope.flag_selectCard = true;
            },
            hideSelectType: function () {
                $scope.flag_selectCard = false;
            },
            confirmSelect: function () {

                var shop_id = [];
                angular.forEach($scope.shop_count, function (value) {
                    if (value.checked) {
                        shop_id.push(value.id);
                    }
                });
                var params = {pick_id: -1, shop_id: shop_id};
                Order.replenishApply(params).$promise.then(function (data) {
                    var alertPopup = $ionicPopup.alert({
                        title: '补货申请成功',
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
                this.hideSelectType()
            },
        }
        $scope.search_list = function (search) {
            $scope.replenish_list = [];
            $scope.page = 1;
            $scope.form.cur_keyword = search;
            $scope.loadMore();
        }


        // 清除搜索关键词
        $scope.clearKeyword = function($event) {
            $event.stopPropagation();
            $scope.form.cur_keyword = "";
        }

        // 回车键搜索
        $scope.keyUpSearch = function($event) {
            if ($event.keyCode === 13) {
                $scope.replenish_list = [];
                $scope.page = 1;
                // $scope.search($scope.form.cur_keyword);
                $scope.loadMore();
            }
        }
    }
])
