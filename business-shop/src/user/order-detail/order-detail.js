angular.module("App.User.OrderDetail", []).controller("App.User.OrderDetail.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Order",
    "$ionicPopup",
    "Loading",
    "$http",
    function(
        $scope,
        $state,
        $ionicHistory,
        Order,
        $ionicPopup,
        Loading,
        $http
    ) {
        var id = $state.params.id;
        $scope.detail = {};
        $scope.id = id;
        $scope.back = function() {
                $ionicHistory.goBack();
            }
            //交易状态
        $scope.orderStatus = {
            "0": "未支付",
            "1": "已支付",
            "2": "卖家已发货",
            "3": "交易完成",
            "4": "交易关闭"
        };
        //配送方式
        $scope.shipType = {
            "1": "快递",
            "2": "自提",
            "4": "预约服务"
        };

        //获取订单数据
        Loading.show();

        function getDetail(id) {
            Order.getDetail({
                order_id: id
            }).$promise.then(function(data) {
                Loading.hide();
                $scope.detail = data;
                
                var selectedTypeList = []
                angular.forEach($scope.detail.goods[0].attrbute_value ,function(attrbute){
                    selectedTypeList.push(attrbute.value)
                })
                $scope.detail.selectedType = selectedTypeList.join("、")//商品属性

                $http.get('http://wap.cellmyth.cn/city.data-3.json').success(function(data) {
                    if ($scope.detail.service_address) {
                        var addreText = getAddress(data, $scope.detail.service_address.area_id);
                        $scope.detail.service_address.addresd = addreText.join('');
                    } else {
                        var addreTexts = getAddress(data, $scope.detail.shop.area_id);
                        $scope.detail.addresloal = addreTexts.join('') + $scope.detail.shop.address;
                    }
                }).error(function(data) {});
            }, function(response) {
                $ionicPopup.alert({
                    title: "错误",
                    template: response.message || "服务器错误！"
                });
                Loading.hide();
            });
        };

        //根据地址id取省市县
        function getAddress(data, value) {
            var temId, result, parent;
            var id = parseInt(value, 10);
            result = [];
            for (var i = 0; i < data.length; i++) {
                temId = parseInt(data[i].value, 10);
                if (temId == id) {
                    result = result.concat(data[i].text);
                    break;
                } else if (Math.abs(temId - id) < 10000 && data[i].children) {
                    parent = data[i].text;
                    result = getAddress(data[i].children, value);
                    if (result.length > 0) {

                        result.unshift(parent);
                        break;
                    }
                }
            }
            return result;
            console.log(result)
        }


        // 快递确认收货
        $scope.comfirmGoods = function(id) {
                $ionicPopup.confirm({
                    title: "<span class='assertive'>收货提示</span>",
                    template: "请签收快递后，再点击确认收货",
                    cancelText: "取消",
                    okText: "确定"
                }).then(function(res) {
                    if (res) {
                        Order.receiptConfirm({
                            order_id: id
                        }).$promise.then(function(response) {
                            $ionicPopup.alert({
                                title: '确认收货成功，交易已完成',
                                okText: "确定"
                            }).then(function() {
                                $state.go("user.info");
                            });
                        }, function(response) {
                            $ionicPopup.alert({
                                title: "错误",
                                template: response.message || "服务器错误！"
                            });
                        });
                    }
                })
            }
            //计算商品总数
        function getTotalGoods(goods) {
            var n = 0;
            angular.forEach(goods, function(item) {
                if (item.quantity) {
                    n += item.quantity;
                }
            });
            return n;
        };
        getDetail(id);
        $scope.getTotalGoods = getTotalGoods;

    }
]);
