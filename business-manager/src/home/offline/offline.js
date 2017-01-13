angular.module('App.Offline', []).controller('App.Offline.Controller', [
    '$scope',
    '$state',
    '$uibModal',
    "Category",
    "Goods",
    "Alert",
    "Subshop",
    "$timeout",
    function(
        $scope,
        $state,
        $uibModal,
        Category,
        Goods,
        Alert,
        Subshop,
        $timeout
    ) {

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

        //搜索表单数据
        $scope.form = {
            area_id: "000000",
            sub_shop_name: "",
            create_time: "",
            status: "0"
        };

        //增加弹窗控制器
        var ModalController = [
            "$scope",
            "$uibModalInstance",
            "$timeout",
            "data",
            "Alert",
            function(
                $scope,
                $uibModalInstance,
                $timeout,
                data,
                Alert
            ) {

                $scope.data = data;
                $scope.form = {
                    sub_number: "",
                    sub_shop_name: "",
                    area_id: "000000",
                    sub_street_address: "",
                    sub_username: "",
                    tel_phone: "",
                    status: "2",
                    isinit: false
                };

                $scope.getInfo = function () {
                    Subshop.getShopByNumber({number: $scope.form.sub_number}).$promise.then(function(data) {
                        if(data.error == "0"){
                            $scope.form = angular.extend($scope.form, data.data)
                            $scope.form.isinit = true;
                            $scope.form.area_id = data.data.sub_shop_area_id
                            console.log($scope.form.area_id)
                            $timeout(function () {
                                $scope.form.isinit = false; 
                            },3000)
                        }
                    })
                }

                //确认
                $scope.ok = function() {
                    console.log($scope.form)
                    if($scope.form.sub_number == '' || $scope.form.sub_number == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写代言号",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.sub_shop_name == '' || $scope.form.sub_shop_name == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写线下店名称",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.area_id == '000000' || $scope.form.area_id == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请选择所在区域",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.sub_street_address == '' || $scope.form.sub_street_address == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写详细地址",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.sub_username == '' || $scope.form.sub_username == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写联系人姓名",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.tel_phone == '' || $scope.form.tel_phone == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写联系人电话",
                            closeable: true
                        });

                        return false;

                    }else if(!(/^1[3|4|5|7|8]\d{9}$/.test($scope.form.tel_phone))){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "联系人电话输入有误",
                            closeable: true
                        });
                        return false;
                    }


                    // for (var item in $scope.form) {
                    //     if ($scope.form[item] == "" || $scope.form[item] == undefined) {
                            // Alert.show({
                            //     title: '失败',
                            //     type: 'danger',
                            //     msg: "信息不完整！",
                            //     closeable: true
                            // });

                    //         return false;
                    //     }
                    // }
                    $scope.form.sub_shop_area_id = $scope.form.area_id
                    Subshop.addShop($scope.form).$promise.then(function(data) {
                        if (data.error === "0") {
                            var item = angular.copy($scope.form);
                            if (data.data) {
                                item = angular.extend(item, data.data);
                            }
                            console.log(item)
                            $uibModalInstance.close(item); 
                        }else {
                            Alert.show({
                                title: '失败',
                                type: 'danger',
                                msg: data.message,
                                closeable: true
                            });
                        }
                        
                    },function (error) {
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: error.data.message,
                            closeable: true
                        });
                    });

                }
                $scope.cancel = function() {
                    $uibModalInstance.dismiss("cancel")
                }

            }
        ];

        //增加弹窗
        function showAdd() {
            return $uibModal.open({
                backdrop: 'static',
                animation: true,
                templateUrl: "home/offline/offline-add.html",
                windowClass: "address-modal",
                controller: ModalController,
                resolve: {
                    data: {
                        modal_title: "增加线下店"
                    }
                }
            })
        }


        //添加
        $scope.add = function() {
            var modal = showAdd();
            modal.result.then(function(data) {
                $scope.goods.data.list.unshift(data);
            }, function(data) {

            })
        };


        //编辑弹窗控制器
        var EditModalController = [
            "$scope",
            "$uibModalInstance",
            "$timeout",
            "data",
            "Alert",
            function(
                $scope,
                $uibModalInstance,
                $timeout,
                data,
                Alert
            ) {

                $scope.data = data;
                $scope.form = angular.copy(data.form)
                $scope.form.area_id = $scope.form.sub_shop_area_id
                
                $scope.ok = function() {
                    console.log($scope.form)
                    if($scope.form.sub_number == '' || $scope.form.sub_number == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写代言号",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.sub_shop_name == '' || $scope.form.sub_shop_name == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写线下店名称",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.area_id == '000000' || $scope.form.area_id == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请选择所在区域",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.sub_street_address == '' || $scope.form.sub_street_address == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写详细地址",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.sub_username == '' || $scope.form.sub_username == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写联系人姓名",
                            closeable: true
                        });
                        return false;
                    }

                    if($scope.form.tel_phone == '' || $scope.form.tel_phone == undefined){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "请填写联系人电话",
                            closeable: true
                        });

                        return false;

                    }else if(!(/^1[3|4|5|7|8]\d{9}$/.test($scope.form.tel_phone))){
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: "联系人电话输入有误",
                            closeable: true
                        });
                        return false;
                    }
                    
                    Subshop.editShop($scope.form).$promise.then(function(data) {
                        if (data.error === "0") {
                            var item = angular.copy($scope.form);
                            $uibModalInstance.close(item); 
                        }else {
                            Alert.show({
                                title: '失败',
                                type: 'danger',
                                msg: data.message,
                                closeable: true
                            });
                        }
                    },function (error) {
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: error.data.message,
                            closeable: true
                        });
                    });

                }
                $scope.cancel = function() {
                    $uibModalInstance.dismiss("cancel")
                }

            }
        ];

        //编辑
        $scope.edit = function(shop) {
            var modal = showEdit(shop);
            modal.result.then(function(data) {
                angular.extend(shop,data);
            }, function(data) {

            })
        };

        //增加弹窗
        function showEdit(shop) {
            return $uibModal.open({
                backdrop: 'static',
                animation: true,
                templateUrl: "home/offline/offline-edit.html",
                windowClass: "address-modal",
                controller: EditModalController,
                resolve: {
                    data: {
                        modal_title: "编辑线下店",
                        form: shop
                    }
                }
            })
        }

        //$scope.originScope=$scope;
        //搜索品牌brand_id
        $scope.brand_id = "0";
        //搜索分类category_sys_id
        $scope.category_sys_id = "0";
        // 分页         
        $scope.totalItems = 0; //总共数据条数
        $scope.currentPage = 1; //当前在第几页
        $scope.itemsPerPage = 10; //每页显示的数据条数
        $scope.maxSize = 4; //分页显示的最大页数
        //品牌列表
        $scope.brand_list = Category.getBrand();
        //分类列表
        $scope.category_sys_list = Category.getSysCategoryTree();

        //初始化list
        var initList = function(search_obj) {
            $scope.goods = Subshop.getListShop(search_obj);
            $scope.goods.$promise.then(function(response) {
                if (response.error === "0") {
                    $scope.totalItems = parseInt(response.data.total);
                } else {

                }
            })
        }

        //调用初始化数据
        initList({
            page: $scope.currentPage,
            limit: $scope.itemsPerPage
        });

        //翻页
        $scope.pageChanged = function() {
            initList({
                page: $scope.currentPage,
                limit: $scope.itemsPerPage,
                sub_shop_area_id: $scope.form.area_id,
                sub_shop_name: $scope.form.sub_shop_name,
                create_time: $scope.form.create_time,
                status: $scope.form.status
            });
        };

        //搜索
        $scope.search = function() {
            initList({
                page: 1,
                limit: $scope.itemsPerPage,
                sub_shop_area_id: $scope.form.area_id,
                sub_shop_name: $scope.form.sub_shop_name,
                create_time: $scope.form.create_time,
                status: $scope.form.status
            });
        }

        // 发布商品
        $scope.goodsOnline = function(good) {
            $state.go('goods.publish', {
                id: good.id
            });
        }

        // 新增商品
        $scope.goodsAdd = function() {
            $state.go("goods.add");
        }

        //商品审核状态
        $scope.getApplyStatus = function(code) {
            var status = {
                "1": "未提交审核",
                "2": "待审核",
                "4": "审核未通过"
            };
            return status[code] || "";
        };

        //商品提交审核
        $scope.applyGoods = function(goods) {
            id = Number(goods.id);
            if (!id) {
                return false;
            };
            Goods.applyGoods({
                id: id
            }).$promise.then(function(response) {
                if (response.error === "0") {
                    goods.status = 2;
                    Alert.show({
                        title: '成功',
                        type: 'success',
                        msg: '已提交，请等待审核',
                        closeable: true
                    });
                } else {
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message || '服务器错误！',
                        closeable: true
                    });
                }
            }, function(response) {
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: response.message || '服务器连接失败！',
                    closeable: true
                });
            });
        };

    }
]);