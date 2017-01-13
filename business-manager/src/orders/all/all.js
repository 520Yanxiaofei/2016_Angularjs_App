angular.module('App.Orders.All', ['ui.bootstrap']).controller('App.Orders.All.Controller', [
        '$scope',
        '$state',
        'Orders',
        'Alert',
        '$filter',
        '$uibModal',
        function ($scope,
                  $state,
                  Orders,
                  Alert,
                  $filter,
                  $uibModal) {
            var form = {};
            $scope.form = form;
            $scope.data = [];

            $scope.maxPage = 10;
            $scope.itemPerPage = 10;
            $scope.total = 0;
            $scope.pageNum = 1;
            $scope.pageStatus = $state.current.name;

            //路由对应订单查询状态
            var status = {
                'orders.completed': '3',
                'orders.undelivered': '1',
                'orders.unsigned': '2'
            };

            //时间控件数据
            $scope.datePicker = {
                d1: false,
                d2: false
            };
            $scope.dateOptions = {
                //dateDisabled: disabled,
                formatYear: 'yyyy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(2000, 1, 1),
                startingDay: 1
            };

            //订单状态字典
            $scope.statusEmum = {
                0: "未支付",
                1: "已支付",
                2: "已发货",
                3: "交易完成",
                4: "交易关闭"
            };
            //订单状态
            form.status = "";
            form.area_id = "000000";

            //配送方式字典
            $scope.shipEmum = {
                1: "快递",
                2: "自提",
                4: "预约服务"
            };

            //优惠类型
            $scope.discounts = {
                1: "红包",
                2: "代言币",
                4: "颜值分"
            };

            //查询
            function search(params) {
                params = params || angular.copy(form);
                angular.forEach(params, function (value, key) {
                    if (value == "" || value == null || value == undefined) {
                        delete params[key];
                    }
                });
                if (params.start_time) {
                    params.start_time = params.start_time.getTime() / 1000;
                    if (!params.end_time) {
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: '请选择结束时间',
                            closeable: true
                        });
                    }
                    ;
                }
                ;
                if (params.end_time) {
                    params.end_time = params.end_time.getTime() / 1000 + 86400;
                    if (!params.start_time) {
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: '请选择开始时间',
                            closeable: true
                        });
                    }
                    ;
                }
                ;
                if (!angular.isDefined(params.status) && status[$scope.pageStatus] != undefined) {
                    params.status = status[$scope.pageStatus];
                }
                ;
                params.limit = $scope.itemPerPage;
                params.page = $scope.pageNum;
                Orders.getList(params).$promise.then(function (response) {
                    if (response.error == "0") {
                        $scope.data = response.data.list;
                        $scope.total = parseInt(response.data.total, 10);
                        angular.forEach($scope.data, function (item) {
                            var selectedTypeList = []
                            angular.forEach(item.order_goods[0].attrbute_value, function (attrbute) {
                                selectedTypeList.push(attrbute.value)
                            })
                            item.selectedType = selectedTypeList.join("、")
                            item.pay_list_count = 0;
                            angular.forEach(item.pay_list,function (val) {
                                item.pay_list_count += parseInt(val)
                            })
                        });
                    } else {
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: response.message,
                            closeable: true
                        });
                    }
                });
            };

            //初始化页面
            function init() {
                search();
            }

            init();
            $scope.search = search;

            //优惠类型
            $scope.benefit = function benefit(arr) {
                var res = [];
                if (!angular.isArray(arr)) {
                    return "";
                }
                if (arr[0] > 0) {
                    res.push('颜值分');
                }
                if (arr[1] > 0) {
                    res.push('代言币');
                }
                if (arr[2] > 0) {
                    res.push('红包');
                }


                return res.length > 0 ? res.join('，') : '';

            }
            $scope.changePrice = function (item) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'change-price.html',
                    controller: 'changePrice1',
                    size: 'lg',
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    console.log(result);
                })
            }
        }
    ])
    // 属性管理
    .controller('changePrice1', [
        '$scope',
        'Goods',
        '$uibModalInstance',
        'item',
        'Alert',
        'Orders',
        function ($scope, Goods, $uibModalInstance, item, Alert, Orders) {
            $scope.item = item;
            $scope.type = '1';
            $scope.price = '0.00';
            var ship_fee = item.ship_fee / 100 || 0;
            $scope.ship_fee = ship_fee ? ship_fee.toFixed(2) : '0';
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.ok = function () {
                var goods_fee = parseInt(item.goods_fee) / 100;
                if ($scope.type == '1') {
                    goods_fee = goods_fee - parseFloat($scope.price);
                }
                if ($scope.type == '2') {
                    goods_fee = goods_fee + parseFloat($scope.price);
                }
                Orders.changePrice({
                    'order_id': item.id,
                    'goods_fee': goods_fee,
                    'ship_fee': $scope.ship_fee,
                }).$promise.then(function (response) {
                    if (response.error == "0") {
                        item.goods_fee = $scope.pay_fee - $scope.new_ship_fee;
                        item.ship_fee = $scope.new_ship_fee;
                        item.total_fee = item.total_fee - parseFloat($scope.price) * 100;
                        console.log(item);
                        $uibModalInstance.dismiss('cancel');
                    } else {
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: response.message,
                            closeable: true
                        });
                    }
                });
            }
            $scope.new_goods_fee = parseInt(item.total_fee) - parseInt(item.ship_fee);
            $scope.new_ship_fee = parseInt(item.ship_fee);
            $scope.discount_fee = $scope.new_goods_fee - parseInt(item.goods_fee);
            $scope.pay_fee = $scope.new_goods_fee + $scope.new_ship_fee - $scope.discount_fee;
            $scope.viewPrice = function () {
                var price = parseFloat($scope.price) * 100 || 0;
                if ($scope.type == '1') {
                    $scope.new_goods_fee = parseInt(item.total_fee) - parseInt(item.ship_fee) - price;
                }
                if ($scope.type == '2') {
                    $scope.new_goods_fee = parseInt(item.total_fee) - parseInt(item.ship_fee) + price;
                }
                $scope.new_ship_fee = parseFloat($scope.ship_fee) * 100;
                $scope.pay_fee = $scope.new_goods_fee + $scope.new_ship_fee - $scope.discount_fee;
                if($scope.pay_fee - $scope.new_ship_fee < 1){
                    $scope.price = '0.00';
                    var ship_fee = item.ship_fee / 100 || 0;
                    $scope.ship_fee = ship_fee ? ship_fee.toFixed(2) : '0';
                    $scope.new_goods_fee = parseInt(item.total_fee) - parseInt(item.ship_fee);
                    $scope.new_ship_fee = parseInt(item.ship_fee);
                    $scope.discount_fee = $scope.new_goods_fee - parseInt(item.goods_fee);
                    $scope.pay_fee = $scope.new_goods_fee + $scope.new_ship_fee - $scope.discount_fee;
                }

            }

        }
    ])