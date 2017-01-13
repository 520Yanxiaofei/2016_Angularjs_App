angular.module('Replenish', ['ReplenishDetail']).controller('ReplenishController', [
    '$scope',
    '$state',
    'Orders',
    "Alert",
    function ($scope,
              $state,
              Orders,
              Alert) {
        //申请人代言号
        $scope.number = "";
        //申请人代言昵称
        $scope.nickname = "";
        //申请人代言姓名
        $scope.realname = "";
        //补货状态
        $scope.status = '-1';
        // 分页
        $scope.totalItems = 0; //总共数据条数
        $scope.currentPage = 1; //当前在第几页
        $scope.itemsPerPage = 10; //每页显示的数据条数
        $scope.maxSize = 4; //分页显示的最大页数

        //初始化list
        var initList = function (search_obj) {

            Orders.getReplenishList(search_obj).$promise.then(function (response) {
                $scope.apply_list = response;
                if (response.error === "0") {
                    $scope.totalItems = parseInt($scope.apply_list.data.total);
                } else {

                }
            });
        }
        //调用初始化数据
        initList({
            status: $scope.status,
            page: $scope.currentPage,
            limit: $scope.itemsPerPage
        });

        //翻页
        $scope.pageChanged = function () {
            initList({
                page: $scope.currentPage,
                limit: $scope.itemsPerPage,
                number: $scope.number,
                nickname: $scope.nickname,
                realname: $scope.realname,
                status: $scope.status
            });
        };

        //搜索
        $scope.search = function () {
            initList({
                page: 1,
                limit: $scope.itemsPerPage,
                number: $scope.number,
                nickname: $scope.nickname,
                realname: $scope.realname,
                status: $scope.status
            });
        }
        $scope.send_status = {
            0: "等待发货",
            1: "已发货",
            2: "补货成功",
        };
        $scope.send = function (apply) {
            //处理参数，如果没传参
            var params = {
                id: apply.id,
            }
            angular.forEach(params, function (value, key) {
                if (value == "" || value == null || value == undefined) {
                    delete params[key];
                }
            });
            //获取列表数据
            Orders.replenishSend(params).$promise.then(function (response) {
                if (response.error === "0") {
                    apply.status = 1;
                    Alert.show({
                        title: '成功',
                        type: 'success',
                        msg: '发货成功',
                        closeable: true
                    });
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
]);