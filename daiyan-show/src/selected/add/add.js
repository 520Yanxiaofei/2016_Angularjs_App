angular.module("App.Selected.add", []).controller("App.Selected.add.Controller", [
    "$scope",
    "$state",
    "Manage",
    "$ionicPopup",
    "$ionicHistory",
    "Loading",
    function(
        $scope,
        $state,
        Manage,
        $ionicPopup,
        $ionicHistory,
        Loading
    ) {

        //初始化
        $scope.addUser = {
                showId: $state.params.id,
                slogan: '',
                verify: ''
            }
            //提交表单
        var sumit = true;
        $scope.checkboxModel = {
            value: false
        };
        $scope.addClick = function() {
                subCode();
                if (sumit) {
                    Loading.show();
                    console.log($scope.addUser);
                    Manage.getrankAdd($scope.addUser).$promise.then(function(data) {
                            Loading.hide();
                            $ionicPopup.alert({
                                title: '申请提示',
                                template: '<div style="text-align:center;color:red">加入选秀申请提交成功！</div>',
                                okText: "确定"
                            }).then(function(response) {
                                if (response) {
                                    $ionicHistory.goBack();
                                } else {}
                            });
                    }, function(error) {
                        Loading.hide();
                            $ionicPopup.alert({
                                title: "提示",
                                template: (error && error.data && error.data.message) || "服务器错误！"
                            });
                    })
                }
            }
            //验证表单
        function subCode() {
            sumit = true;
            if ($scope.addUser.slogan == "") {
                sumit = false;
                $ionicPopup.alert({
                    title: '验证提示',
                    template: '<div style="text-align:center;color:red">参赛宣言不能为空！</div>',
                    okText: "确定"
                });
                return sumit;
            };
            if ($scope.addUser.slogan.length >= 30) {
                sumit = false;
                $ionicPopup.alert({
                    title: '验证提示',
                    template: '<div style="text-align:center;color:red">参赛宣言内容不能超过30字之内！</div>',
                    okText: "确定"
                });
                return sumit;
            };
            if ($scope.addUser.verify == "") {
                sumit = false;
                $ionicPopup.alert({
                    title: "验证提示",
                    template: '<div style="text-align:center;color:red">验证消息不能为空！</div>',
                    okText: "确定"
                });
                return sumit;
            }
            if ($scope.addUser.verify.length >= 20) {
                sumit = false;
                $ionicPopup.alert({
                    title: "验证提示",
                    template: '<div style="text-align:center;color:red">验证消息不能超过20字之内！</div>',
                    okText: "确定"
                });
                return sumit;
            };
            if ($scope.checkboxModel.value == false) {
                sumit = false;
                $ionicPopup.alert({
                    title: "验证提示",
                    template: '<div style="text-align:center;color:red">请勾选已阅读并且同意以上协议！</div>',
                    okText: "确定"
                });
                return sumit;
            }

        }

        //取消
        $scope.close = function() {
            $ionicPopup.confirm({
                title: '温馨提示',
                template: '<div style="text-align:center">参赛信息没填写，确定取消选秀？</div>',
                cancelText: "取消",
                okText: "确定"
            }).then(function(response) {
                if (response) {
                    $ionicHistory.goBack();
                } else {

                }

            });
        }

    }
]);
