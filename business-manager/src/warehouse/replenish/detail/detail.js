angular.module('ReplenishDetail', []).controller('DetailController', [
    '$scope',
    '$state',
    'Orders',
    'Alert',
    function ($scope,
              $state,
              Orders,
              Alert) {
        $scope.data = {};
        $scope.count = 0;
        function getDetail() {
            Orders.getReplenishDetail({
                id: $state.params.id
            }).$promise.then(function (response) {
                $scope.data = response.data;
                $scope.count = 0;
                angular.forEach(response.data.pick,function (value) {
                    angular.forEach(value.goods,function (v) {
                        $scope.count += parseInt(v.quantity);
                    })
                })
            });
        }

        $scope.send_status = {
            0: "等待发货",
            1: "已发货",
            2: "补货成功",
        };
        //订单补货状态
        $scope.replenish_status = {
            0: '可补货',
            1: '已申请补货',
            2: '已发货',
            3: '补货成功',
        };
        getDetail();

        $scope.send = function (data) {
            //处理参数，如果没传参
            var params = {
                id: data.replenish.id,
            }
            angular.forEach(params, function (value, key) {
                if (value == "" || value == null || value == undefined) {
                    delete params[key];
                }
            });
            //获取列表数据
            Orders.replenishSend(params).$promise.then(function (response) {
                if (response.error === "0") {
                    data.replenish.status = 1;
                    Alert.show({
                        title: '成功',
                        type: 'success',
                        msg: '发货成功',
                        closeable: true
                    });
                    getDetail();
                }else{
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message || '服务器错误！',
                        closeable: true
                    });
                }
            })
        }
    }
])