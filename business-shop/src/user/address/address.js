angular.module("App.User.Address", []).controller("App.User.Address.Controller", [
    "$scope",
    "$state",
    "Member",
    "Loading",
    "$ionicHistory",
    "$ionicPopup",
    "$timeout",
    function(
        $scope,
        $state,
        Member,
        Loading,
        $ionicHistory,
        $ionicPopup,
        $timeout
    ) {

        var wateTimeCount = 500;
        // 是否从订单页面跳转而来
        var isComeFromOrder = false;
        // console.log($ionicHistory.viewHistory());
        if ($ionicHistory.viewHistory().backView != null && $ionicHistory.viewHistory().backView.stateName == "order.order-fill") {
            isComeFromOrder = true;
        }

        //返回
        $scope.back = function() {
            $ionicHistory.goBack();
        };

        //获取地址列表
        Loading.show();
        Member.getAddressList().$promise.then(function(address_list) {
            $scope.address_list = address_list;
            Loading.hide();
            // console.log(address_list);
        }, function(error) {
            console.log(error);
        });

        // 编辑收货地址
        $scope.edit = function(id) {
            // console.log(id);
            $state.go("user.address-edit", { id: id, come: isComeFromOrder });
        }

        // 添加收货地址
        $scope.addNewAddress = function() {
            if ($scope.address_list) {
                Member.getAddressList().$promise.then(function(address_list) {
                    if ($scope.address_list.length === 5) {
                        $ionicPopup.alert({
                            title: "<span class='assertive'>添加失败</span>",
                            okText: "确定",
                            template: "收货地址个数已达上限,最多只能添加5个！"
                        })
                        return false;
                    } else {
                        $state.go("user.address-edit");
                    }
                }, function(error) {
                    console.log(error);
                });
            } else {
                $state.go("user.address-edit");
            }
        }

        // 删除收货地址
        $scope.delete = function(id) {
            $ionicPopup.confirm({
                title: "<span class='assertive'>删除提示</span>",
                template: "确定要删除该地址？",
                cancelText: "取消",
                okText: "确定"
            }).then(function(res) {
                if (res) {
                    Loading.show();
                    Member.delAddress({ id: id }).$promise.then(function(response) {
                        $timeout(function() {
                            Loading.hide();
                            for (var i = 0; i < $scope.address_list.length; i++) {
                                if ($scope.address_list[i].id == id) {
                                    $scope.address_list.splice(i, 1);
                                    break;
                                }
                            }
                            $ionicPopup.alert({
                                title: '删除成功！',
                                okText: "确定"
                            });
                        }, 500);
                    }, function(response) {
                        $ionicPopup.alert({
                            title: '删除失败！',
                            okText: "确定",
                            template: response.data.message
                        });
                    });
                }
            })
        }

        // 设置为默认地址
        $scope.setDefault = function(id) {
            var timeStart = new Date().getTime();
            Loading.show("修改中...");
            Member.setAddressDefault({ id: id }).$promise.then(function(response) {
                Member.getAddressList().$promise.then(function(address_list) {
                    $scope.address_list = address_list;
                    var timeEnd = new Date().getTime();
                    console.log(timeEnd - timeStart);
                    if (timeEnd - timeStart > wateTimeCount) {
                        Loading.hide();
                        $ionicPopup.alert({
                            title: '修改成功！',
                            okText: "确定"
                        }).then(function() {
                            // console.log(isComeFromOrder);
                            if (isComeFromOrder) {
                                $ionicHistory.goBack();
                            }
                        });
                    } else {
                        $timeout(function() {
                            Loading.hide();
                            $ionicPopup.alert({
                                title: '修改成功！',
                                okText: "确定"
                            }).then(function() {
                                console.log(isComeFromOrder);
                                if (isComeFromOrder) {
                                    $ionicHistory.goBack();
                                }
                            });
                        }, wateTimeCount);
                    }
                }, function(error) {
                    console.log(error);
                });
            }, function(response) {
                $ionicPopup.alert({
                    title: '修改失败！',
                    okText: "确定",
                    template: response.data.message
                });
            });
        }
    }
]);
