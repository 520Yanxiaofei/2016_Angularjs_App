angular.module("App.User.AddressEdit", []).controller("App.User.AddressEdit.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Member",
    "Loading",
    "$ionicPopup",
    function(
        $scope,
        $state,
        $ionicHistory,
        Member,
        Loading,
        $ionicPopup
    ) {

        // 返回
        $scope.back = function() {
            $ionicHistory.goBack();
        }

        var isComeFromOrder = false;
        var come_url = {};
        console.log($ionicHistory.viewHistory().histories.root.stack[$ionicHistory.viewHistory().histories.root.stack.length - 3]);
        if ($ionicHistory.viewHistory().histories.root.stack != null &&
            $ionicHistory.viewHistory().histories.root.stack[$ionicHistory.viewHistory().histories.root.stack.length - 3].stateName == "order.order-fill") {
            isComeFromOrder = true;
            come_url = $ionicHistory.viewHistory().histories.root.stack[$ionicHistory.viewHistory().histories.root.stack.length - 3];
        }

        $scope.isOperating = false;
        var isAdd;
        if ($state.params.id) {
            Loading.show();
            $scope.pageTitle = "编辑收货地址";
            isAdd = false;
            Member.getAddressById({ id: $state.params.id }).$promise.then(function(address) {
                $scope.address = address;
                Loading.hide();
            }, function(response) {
                console.log(response);
            })
        } else {
            $scope.pageTitle = "添加收货地址";
            isAdd = true;
            $scope.address = {
                consignee: "",
                address: "",
                mobile: "",
                zipcode: "",
                area_id: "000000"
            };
        }

        // 添加收货地址
        $scope.updateAddress = function() {
            $scope.isOperating = true;
            if (isAdd) {
                if (checkInfo()) {
                    Loading.show();
                    $scope.address.zipcode = $scope.address.zipcode.trim() == "" ? "000000" : $scope.address.zipcode.trim();
                    Member.addAddress($scope.address).$promise.then(function(response) {
                        // console.log(response);
                        Member.setAddressDefault({ id: response.id }).$promise.then(function(response) {
                            Loading.hide();
                            if (isComeFromOrder) {
                                $state.go("order.order-fill", come_url.stateParams);
                            } else {
                                $state.go("user.info");
                            }

                            // $scope.isOperating = false;
                        }, function(response) {
                            $ionicPopup.alert({
                                title: '修改失败！',
                                okText: "确定",
                                template: response.data.message
                            });
                            $scope.isOperating = false;
                        });
                    }, function(response) {
                        Loading.hide();
                        $ionicPopup.alert({
                            title: '添加失败！',
                            okText: "确定",
                            template: response.data.message
                        });
                        $scope.isOperating = false;
                    });
                } else {
                    $scope.isOperating = false;
                }
            } else {
                if (checkInfo()) {
                    Loading.show();
                    $scope.address.zipcode = ($scope.address.zipcode.trim() == "0" || $scope.address.zipcode.trim() == "") ? "000000" : $scope.address.zipcode.trim();
                    Member.editAddress($scope.address).$promise.then(function(response) {
                        Member.setAddressDefault({ id: $scope.address.id }).$promise.then(function(response) {
                            Loading.hide();
                            if (isComeFromOrder) {
                                $state.go("order.order-fill", come_url.stateParams);
                            } else {
                                $state.go("user.info");
                            }
                            $scope.isOperating = false;
                        }, function(response) {
                            $ionicPopup.alert({
                                title: '修改失败！',
                                okText: "确定",
                                template: response.data.message
                            });
                            $scope.isOperating = false;
                        });
                    }, function(response) {
                        // console.log(response.data.message);
                        Loading.hide();
                        $ionicPopup.alert({
                            title: "修改失败！",
                            okText: "确定",
                            template: response.data.message
                        });
                        $scope.isOperating = false;
                    });
                } else {
                    $scope.isOperating = false;
                }
            }
        }

        // 表单验证
        function checkInfo() {
            var checkResult = true;
            // 验证收货人
            var reg_consignee = /^[\u4e00-\u9fa5]{2,4}$/;
            if (!$scope.address.consignee.match(reg_consignee)) {
                checkResult = false;
                $ionicPopup.alert({
                    title: "收货人只能输入2-4个汉字",
                    okText: "确定"
                });
                return checkResult;
            }

            // 验证手机号
            var reg_phone = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
            if (!$scope.address.mobile.match(reg_phone)) {
                checkResult = false;
                $ionicPopup.alert({
                    title: "手机号码不正确",
                    okText: "确定"
                });
                return checkResult;
            }

            // 验证邮政编码 
            if (!($scope.address.zipcode.match(/\d{6}/) || $scope.address.zipcode == "0" || $scope.address.zipcode == "")) {
                checkResult = false;
                $ionicPopup.alert({
                    title: "邮政编码不正确",
                    okText: "确定"
                });
                return checkResult;
            }

            // 验证省市区
            if ($scope.address.area_id == "000000") {
                checkResult = false;
                $ionicPopup.alert({
                    title: "请选择收货地址",
                    okText: "确定"
                });
                return checkResult;
            };

            // 详细地址
            if ($scope.address.address.trim() == "") {
                checkResult = false;
                $ionicPopup.alert({
                    title: "详细地址不能为空",
                    okText: "确定"
                });
                return checkResult;
            };

            return checkResult;
        }
    }
]);
