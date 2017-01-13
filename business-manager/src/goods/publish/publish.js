angular.module('App.Goods.Publish', []).controller('App.Goods.Publish.Controller', [
    '$scope',
    '$state',
    '$timeout',
    'Upload',
    'Goods',
    'Alert',
    'Confirm',
    '$q',
    '$window',
    '$uibModal',
    'Shop',
    '$cookies',
    'DiscountRatioService',
    'CommissionService',
    function(
        $scope,
        $state,
        $timeout,
        Upload,
        Goods,
        Alert,
        Confirm,
        $q,
        $window,
        $uibModal,
        Shop,
        $cookies,
        DiscountRatioService,
        CommissionService
    ) {
        var form, infoForm, help;
        var loadingImg = 'static/img/loading.gif'; //loding图
        form = {
            id: $state.params.id,
            ship_type: 0
        };
        help = {
            ship_type_1: false,
            ship_type_2: false,
            ship_type_3: false,
            submiting: false,
            submiting_info: false,
            status: {
                "1": "未提交审核",
                "2": "待审核",
                "3": "审核通过",
                "4": "审核未通过"
            }
        };
        $scope.form = form;
        $scope.help = help;

        //商品介绍表单
        infoForm = {
            id: form.id,
            description: ""
        };
        $scope.infoForm = infoForm;
        //富文本内容回调
        $scope.descriptionCallBack = null;

        //商品图片上传表单
        imgForm = {
            goods_id: form.id,
            images: null
        };
        $scope.images = [];
        $scope.imgForm = imgForm;
        imgTotal = 10;

        //商品详情介绍图片上传地址
        $scope.descriptionUploadUrl = config.API_ROOT + '/seller/goods/description_photo_upload';

        //提交基本信息
        function submitBasic() {
            if ($scope.basicForm.$invalid || !+form.ship_type) {
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '信息输入错误！',
                    closeable: true
                });
                return false;
            };
            //折扣不能高于销售价格
            var zk = form.voucher + form.gold * $scope.all_data.goods.gold_val + form.integral * 100 * $scope.all_data.goods.integral_val;
            if (zk >= form.current_price) {
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '折扣总和不能超过销售价格！',
                    closeable: true
                });
                return false;
            };

            if (+form.ship_type % 2 == 0) {
                form.ship_price = 0;
            };

            help.submiting = true;

            var service_address = []
            for (var i = 0; i < $scope.server_address_list.length; i++) {
                service_address.push($scope.server_address_list[i].id)
            };
            form.service_address = service_address
            Goods.editDetial(form).$promise.then(function(response) {
                help.submiting = false;
                if (response.error == "0") {
                    Alert.show({
                        title: '成功',
                        type: 'success',
                        msg: response.message,
                        closeable: true
                    });
                    console.log(form.current_price)
                    $scope.commission_service.distribution[1].current_price = form.current_price
                    // getDetial();
                } else {
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message,
                        closeable: false
                    });
                }
            });

        }

        //提交商品介绍信息
        function submitDescription() {
            help.submiting_info = true;
            Goods.setDescription(infoForm).$promise.then(function(response) {
                help.submiting_info = false;
                if (response.error == "0") {
                    Alert.show({
                        title: '成功',
                        type: 'success',
                        msg: response.message,
                        closeable: true
                    });
                } else {
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message,
                        closeable: false
                    });
                }
            });
        }

        //栏目分类格式化
        function formatIndustry(arr) {
            arr = arr || [];
            for (var i = arr.length; i > 0; i--) {
                if (typeof arr[i] == "undefined" || arr[i] == "") {
                    arr.splice(i, 1);
                }
            };
            return arr.join(' > ');
        };

        //切换商品类型
        $scope.zige_flag_show = true;
        $scope.changeZigeType = function(){
            if(form.qualified_type == "0" || $scope.option_root.set_add_dasai == "0"){
                $scope.zige_flag_show = false; 
            }else {
                $scope.zige_flag_show = true;
            }
        }


        //获取商品基本信息
        function getDetial() {
            Goods.getDetial({
                id: form.id
            }).$promise.then(function(response) {
                var data, cats;
                if (response.error == "0") {
                    data = response.data.goods;
                    option_root = response.data.option_root;
                    $scope.option_root = option_root
                    $scope.goods_detail = response.data.goods
                    cats = data.category;
                    cats = [cats[0].brand_name, cats[1].category_pname, cats[1].category_name, cats[2].shop_category_name];
                    $scope.cats = formatIndustry(cats);
                    $scope.all_data = response.data;
                    // console.log($scope.all_data);
                    form.title_short = data.title_short;
                    form.title = data.title;
                    form.original_price = Number(data.original_price);
                    form.current_price = Number(data.current_price);
                    form.id = data.id;
                    form.ship_type = data.ship_type;
                    if(option_root.set_goods_zige.is_root == "1" && option_root.set_add_dasai == "1" && data.qualified_type != "0"){
                        $scope.zige_flag_show = true;
                    }else {
                        $scope.zige_flag_show = false;
                    }

                    if(option_root.set_goods_zige.is_root =="1" && data.qualified_type == "0"){
                        $scope.zige_type_show = true;
                    }else {
                        $scope.zige_type_show = false;
                    }

                    $scope.zige_type_text = "普通商品";
                    if(!$scope.zige_type_show){
                        if(data.qualified_type == "1"){
                            $scope.zige_type_text = "代言人资格商品";
                        }else if (data.qualified_type == "2") {
                            $scope.zige_type_text = "代言商资格商品";
                        }
                    }

                    $scope.root_list = option_root.set_goods_zige.root_list;

                    form.qualified_type = data.qualified_type;
                    form.set_dasai = Number(data.vote);
                    form.ship_price = Number(data.ship_price);
                    form.is_refund = Number(data.is_refund);
                    form.voucher = Number(data.voucher);
                    form.gold = Number(data.gold);
                    form.integral = Number(data.integral);
                    form.commission = Number(data.commission);
                    form.pv = Number(data.pv);
                    $scope.selectedGoodsType = {
                        sel_name: data.group
                    };

                    //配送方式
                    help.ship_type_1 = form.ship_type % 2 == 1 ? true : false;
                    help.ship_type_2 = form.ship_type == 2 || form.ship_type == 3 || form.ship_type == 6 || form.ship_type == 7 ? true : false;
                    help.ship_type_3 = form.ship_type >= 4 ? true : false;

                    $scope.service_address = data.service_address.split(',')

                    Shop.getServiceAddress().$promise.then(function(response) {
                        if (response.error == "0") {
                            $scope.data = response.data.list;
                            for (var i = 0; i < $scope.service_address.length; i++) {
                                for (var j = 0; j < $scope.data.length; j++) {
                                    if ($scope.service_address[i] == $scope.data[j].id) {
                                        $scope.server_address_list.push($scope.data[j])
                                    }
                                }
                            }

                        } else {
                            Alert.show({
                                title: '失败',
                                type: 'danger',
                                msg: response.message,
                                closeable: true
                            });
                        }
                    });

                    $scope.images = response.data.image;
                    angular.forEach($scope.images, function(img) {
                        img.per = 100;
                    });
                    //获取商品介绍信息
                    infoForm.description = response.data.description.description;
                    if (typeof $scope.descriptionCallBack == "function") {
                        $scope.descriptionCallBack(infoForm.description);
                    }

                    // 设置商品属性
                    setGoodsAttr();
                    console.log("setGoodsAttrDetail")
                    setGoodsAttrDetail();
                    $scope.attrs = $scope.all_data.goods.attrbute;
                } else {
                    alert(response.message);
                }
            });
        }

        //删除商品图片
        function deleteImg(id) {
            Confirm.show({
                title: '删除图片',
                content: '是否删除图片',
                ok: function() {
                    Goods.deleteImg({
                        id: id
                    }).$promise.then(function(response) {
                        if (response.error == "0") {
                            for (var i = 0; i < $scope.images.length; i++) {
                                if (id == $scope.images[i].id) {
                                    $scope.images.splice(i, 1);
                                    break;
                                }
                            }
                            Alert.show({
                                title: '成功',
                                type: 'success',
                                msg: "删除成功",
                                closeable: true
                            });
                        } else {
                            Alert.show({
                                title: '失败',
                                type: 'danger',
                                msg: response.message,
                                closeable: false
                            });
                        }
                    });
                }
            });
        }

        $scope.tab = "baseInfo";
        $scope.setTab = function(newTab) {
            $scope.tab = newTab;
        };
        $scope.isSet = function(tabNum) {
            return $scope.tab === tabNum;
        };

        //上传图片本地预览
        function readImg(file) {
            var deferred = $q.defer();
            if (file) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    deferred.resolve(evt.target.result);
                }
                reader.readAsDataURL(file);
            } else {
                deferred.reject('请选择文件');
            }
            return deferred.promise;
        };

        //通用图片上传
        function uploadFile(file, images, data) {
            var image, preview_img, promise, result;
            image = {
                url: loadingImg,
                per: 0
            };
            //本地预览
            preview_img = readImg(file);
            preview_img.then(function(result) {
                image.url = result;
            }, function(error) {
                image.url = loadingImg;
            });
            images.unshift(image);

            result = $q.defer();
            promise = Upload.upload(data);

            promise.then(function(response) {
                var data;
                if (response.data.error != 0) {
                    return $q.reject(response.data.message);
                };
                data = response.data.data;
                image.id = data.id;
                image.per = 100;
                image.url = data.url;
                result.resolve(images);
            }, function(response) {
                throw "服务器错误";
            }, function(evt) {
                image.per = Math.min(90, parseInt(100.0 * evt.loaded / evt.total));
            }).catch(function(error) {
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: error || "服务器错误！",
                    closeable: false
                });
                //清除
                image.url = "";
                image.per = 0;
                $timeout(function() {
                    var i;
                    i = images.indexOf(image);
                    if (i >= 0) {
                        $scope.images.splice(i, 1);
                    }
                }, 300);
                result.reject(error || "服务器错误！");

            });
            return result.promise;
        };

        //上传图片
        $scope.uploadPic = function(files) {
            files = angular.isArray(files) ? files : [files];
            if (files.length > imgTotal || files.length + $scope.images.length > imgTotal) {
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '只能上传 ' + imgTotal + ' 张图片！',
                    closeable: false
                });
                return;
            }
            files.forEach(function(file) {
                if (!file) {
                    return false;
                };
                uploadFile(
                    file, $scope.images, {
                        url: config.API_ROOT + '/seller/goods/set_ablum',
                        data: {
                            image: file,
                            goods_id: imgForm.goods_id
                        }
                    }
                );
            })
        };

        //选中的服务地址list
        $scope.server_address_list = [];

        //预约服务地址模态框
        $scope.address_modal = null;

        //设置快递方式
        $scope.setShipType = function(setShipType) {
            var type = 0;
            type = help.ship_type_1 * 1 + help.ship_type_2 * 2 + help.ship_type_3 * 4;
            form.ship_type = type;
            if (help.ship_type_3 && setShipType == "ship_type_3") {
                $scope.address_modal = show();
            } else if (!help.ship_type_3) {
                $scope.server_address_list = []
            }
        };

        //关闭窗口
        $scope.cancel = function cancel(items) {
            var temp = null;
            $scope.address_modal.dismiss('cancel');
            for (var i = $scope.server_address_list.length - 1; i >= 0; i--) {
                temp = null;
                angular.forEach(items, function(item) {
                    if ($scope.server_address_list[i].id == item.id) {
                        temp = item;
                    }
                });
                if (!temp) {
                    $scope.server_address_list.splice(i, 1);
                } else {
                    $scope.server_address_list[i] = angular.copy(temp);
                }

            }

        }

        //默认选择数据
        $scope.setChecked = function setChecked(item) {
            for (var i = 0; i < $scope.server_address_list.length; i++) {
                if ($scope.server_address_list[i].id == item.id) {
                    item.checked = true;
                    return true;
                }
            }
        }

        //获取选中的地址
        $scope.getSelectedAddress = function(items) {
            var address_ids = [];
            angular.forEach(items, function(item) {
                item.checked && address_ids.push(item);
            });
            $scope.server_address_list = address_ids;
            $scope.address_modal.close('saved');
        }

        //设置服务地址弹窗
        function show(action, form) {
            var modal = $uibModal.open({
                backdrop: 'static',
                animation: true,
                templateUrl: "goods/publish/address/address.html",
                windowClass: "address-modal",
                scope: $scope
            })
            return modal;
        }

        //设置服务地址
        $scope.setServiceAddress = function() {
            $scope.address_modal = show();
        }

        //返回
        $scope.goBack = function goBack() {
            $window.history.back();
        };

        getDetial();
        $scope.submitBasic = submitBasic;
        $scope.submitDescription = submitDescription;
        $scope.deleteImg = deleteImg;

        //店铺类型，控制预约显示
        $scope.shop_type = $cookies.get('shop_type');

        //折扣比例设置
        $scope.discount = DiscountRatioService;

        //佣金比例设置
        $scope.commission_service = CommissionService();
        $scope.commission_service.get({ goods_id: form.id });



        // 设置商品类型名称
        function setGoodsAttr() {
            console.log($scope.all_data);
            var category_id = $scope.all_data.goods.attribute_category_id;
            Goods.goodsGroupList({ 'attribute_category_id': category_id }).$promise.then(function(response) {
                $scope.goodsAttrGroups = {
                    list: response.data,
                    category_id: category_id
                };
                $scope.animationsEnabled = true;
                $scope.setGoodsType = function(size) {
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'myModalContent.html',
                        controller: 'ModalInstanceCtrl',
                        size: size,
                        resolve: {
                            goodsAttrGroups: function() {
                                return $scope.goodsAttrGroups;
                            }
                        }
                    });
                    modalInstance.result.then(function(selected) {
                        $scope.selectedGoodsType = {
                            sel_name: selected.name
                        };
                        // console.log(selected);
                        var set_group_data = {
                            goods_id: $scope.form.id,
                            goods_group_id: selected.id
                        };
                        console.log(selected);
                        Goods.goodsAttrsGroupSet(set_group_data).$promise.then(function(response) {
                            console.log(response);
                        }, function(response) {
                            console.log(response);
                        })

                    }, function() {

                    });
                };
            }, function(response) {
                console.log('add error!');
            })
        }

        // 设置商品属性
        function setGoodsAttrDetail() {
            $scope.animationsEnabled = true;
            $scope.setGoodsAttrDetail = function(size) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myModelSetGoodsAttrs.html',
                    controller: 'myModelSetGoodsAttrsCtrl',
                    size: size,
                    resolve: {
                        goods_detail: function() {
                            return $scope.all_data.goods;
                        }
                    }
                });
                modalInstance.result.then(function(selected) {
                    angular.forEach(selected, function(i) {
                        var set_attr = {
                            goods_id: $scope.form.id,
                            attribute_id: i.attribute_id,
                            attr_val_id: i.id
                        };
                        // console.log(set_attr);
                        console.log('goodsAttrsSet')
                        Goods.goodsAttrsSet(set_attr).$promise.then(function(response) {
                            if(response.error === "0"){

                            }else{
                                console.log(response.message)
                                Alert.show({
                                    title: '失败',
                                    type: 'danger',
                                    msg: response.message + "请重新设置",
                                    closeable: false
                                });
                            }
                        }, function(response) {

                        })
                    })

                    angular.forEach($scope.attrs, function(i) {
                        angular.forEach(selected, function(j) {
                            if (i.id == j.attribute_id) {
                                i.value = j.value;
                            }
                        })
                    });
                }, function() {

                });
            }
        }
    }
])

.service('ModalService', ['$uibModal', '$q', 'Alert', function($uibModal, $q, Alert) {

    function show(opts) {
        var modal = $uibModal.open(opts)
        return modal;
    };

    //crud代理
    function action(action, params, resolve, reject) {
        var deffer, promise;
        if (typeof action !== "function") return false;
        deffer = action(params);

        promise = deffer.$promise || deffer;
        promise
            .then(function(response) {
                //接口返回头判断
                if (response.error != 0) {
                    return $q.reject(response.message);
                }
                return $q.resolve(response);
            }, function(response) {
                return $q.reject("服务器错误！");
            })
            .then(function(data) {
                if (!data || !data.data) {
                    success(data.message);
                }
                typeof resolve === "function" && resolve(data);
            }, function(data) {
                error(data);
            });
    };

    function close(modal, msg) {
        modal && modal.dismiss && modal.dismiss(msg || 'cancel');
    };

    function success(msg) {
        Alert.show({
            title: '成功',
            type: 'success',
            msg: msg || "操作成功！",
            closeable: true
        });
    };

    function error(msg) {
        Alert.show({
            title: '失败',
            type: 'danger',
            msg: msg || "服务器错误！",
            closeable: true
        });
    };

    return {
        action: action,
        show: show,
        close: close,
        error: error,
        success: success
    }

}])

.service('DiscountRatioService', ['ModalService', 'Goods', '$rootScope', function(ModalService, Goods, $rootScope) {

    //写的稀烂
    var scope = $rootScope.$new(false);

    var that = Object.create(ModalService);
    var service = {};
    var modal = null;

    scope.goods_id = "";
    scope.form = {
        integral: "",
        gold: "",
        goods_id: ""
    };

    var feedback = null;
    service.show = function(params) {
        if (!params || !params.id) return false;
        scope.form.goods_id = params.id;
        scope.form.integral = params.integral;
        scope.form.gold = params.gold;
        feedback = params.data;
        modal = that.show({
            backdrop: 'static',
            animation: true,
            templateUrl: "goods/publish/discount/discount.html",
            windowClass: "address-modal",
            scope: scope
        });
    }

    scope.close = function() {
        that.close(modal);
    }

    function validate(value) {
        value = +value;
        if (value !== value || value <= 0 || typeof value !== "number") {
            return false;
        }
        return true;
    };

    scope.save = function() {

        if (!validate(scope.form.integral) || !validate(scope.form.gold)) {
            that.error('输入金额错误！');
            return false;
        }

        var integral = (+scope.form.integral).toFixed(2);
        var gold = (+scope.form.gold).toFixed(2);

        var params = {
            integral: integral,
            gold: gold,
            goods_id: scope.form.goods_id
        }
        that.action(Goods.ruleEdit, params, function() {
            feedback.integral_val = integral;
            feedback.gold_val = gold;
            scope.close();
        })
    }

    return service;
}])

.directive('dyDescription', function() {
    return {
        restrict: 'EA',
        scope: {
            description: '='
        },
        link: function(scope, element, attr) {
            scope.$watch('description', function(v1, v2) {
                if (v1 !== v2) {
                    element.html(scope.description)
                }
            });
        }
    };
})

.filter('dyShipType', function() {
    return function(input) {
        var result,
            dic;
        dic = {
            0: "",
            1: "快递",
            2: "自提",
            3: "快递/自提",
            4: "预约",
            5: "快递/预约",
            6: "自提/预约",
            7: "快递/自提/预约"
        };

        result = dic[input];
        return result || "";
    }

})

.filter('dyReturn', function() {
    return function(input) {
        var result,
            dic;
        dic = {
            0: "否",
            1: "是"

        };

        result = dic[input];
        return result || "";
    }

})

//商品佣金设置
.service('CommissionService', ['ModalService', 'Goods', function(ModalService, Goods) {
    //数据模型
    var model = {
        distribution: {
            "1": {
                "commission": 0,
                "pv": 0,
                "current_price": 0
            },
            "2": 0,
            "3": {
                "pv": 0,
                "c1": 0,
                "c2": 0,
                "c3": 0,
                "price": 0
            },
            "4": {
                "pv": 0,
                "c1": 0,
                "c2": 0,
                "c3": 0,
                "price": 0

            },
            "5": {
                "pv": 0,
                "c1": 0,
                "c2": 0,
                "c3": 0,
                "price": 0

            },
            "6": {
                "pv": 0,
                "c1": 0,
                "c2": 0,
                "c3": 0,
                "price": 0
            }
        }
    };

    //数据格式
    var scheme = {

    }

    function service() {
        angular.extend(this, model);
    }

    function toNumber(obj) {
        if (typeof obj === "object") {
            for (var i in obj) {
                obj[i] = toNumber(obj[i]);
            }
        } else {
            obj = +obj || 0;
        }
        return obj;
    }

    service.prototype = {
        save: function(params) {
            if (!params) {
                return false;
            }
            var data = this.distribution;
            angular.forEach(data, function(item, key) {
                if (item === "" || item === null || item !== item || item === undefined) {
                    delete data[key];
                }
            });
            params = 'goods_id=' + params.goods_id + '&distribution=' + angular.toJson(data);

            ModalService.action(Goods.goodsDistribution, params);
        },
        get: function(params) {
            var that = this;
            ModalService.action(Goods.distributionInfo, params, function(response) {
                that = angular.extend(that, toNumber(response.data));
            });
        }
    };
    return function() {
        return new service();
    }

}])

// 商品属性分组设置
.controller('ModalInstanceCtrl', [
    '$scope',
    '$uibModalInstance',
    '$uibModal',
    'goodsAttrGroups',
    'Goods',
    'Alert',
    function($scope, $uibModalInstance, $uibModal, goodsAttrGroups, Goods, Alert) {
        $scope.groups = goodsAttrGroups.list;
        $scope.category_id = goodsAttrGroups.category_id;
        $scope.selected = {
            id: '',
            name: ''
        };
        // 选择当前分类
        $scope.goodTypeSelected = function(i) {
            $scope.selected = i;
            $uibModalInstance.close($scope.selected);
        }

        // 获取分组列表
        $scope.search_groups = function(callback) {
            var groups_search = {
                attribute_category_id: $scope.category_id
            };
            Goods.goodsGroupList(groups_search).$promise.then(function(response) {
                $scope.groups = response.data;
                if (typeof callback == 'function') {
                    callback();
                }
            }, function(response) {
                console.log('获取失败!');
            });
        }

        // 搜索分组列表
        $scope.search_groups_bykeyword = function() {
            var temp_search_result = [];
            if ($scope.group_name !== '' && $scope.group_name !== undefined) {
                $scope.search_groups(function() {
                    angular.forEach($scope.groups, function(item, index) {
                        if (item.name.indexOf($scope.group_name) != -1) {
                            temp_search_result.push(item);
                        }
                    })
                    $scope.groups = temp_search_result;
                })
            } else {
                $scope.search_groups();
            }
        }

        // 属性分组添加
        $scope.addGroupName = function() {
            //管理属性
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModelAddGroup.html',
                controller: 'myModelAddGroup',
                size: 'sm',
                resolve: {
                    groups: function() {
                        return $scope.groups;
                    },
                    category_id: function(){
                        return $scope.category_id;
                    }
                }
            });
            modalInstance.result.then(function(selected) {
                // Goods.goodsAttrsList({
                //     attribute_category_id: goods_detail.attribute_category_id
                // }).$promise.then(function(response) {
                //     $scope.attr_list = response.data;
                // }, function(response) {
                //     console.log(response);
                // });
            }, function() {

            });


            // if ($scope.group_name !== '' && $scope.group_name !== undefined) {
            //     var add_flag = true;
            //     $scope.search_groups(function() {
            //         angular.forEach($scope.groups, function(item, index) {
            //             if (item.name == $scope.group_name) {
            //                 add_flag = false;
            //             }
            //         })
            //         if (add_flag) {
            //             var groups_add = {
            //                 group_name: $scope.group_name,
            //                 attribute_category_id: $scope.category_id
            //             }
            //             Alert.show({
            //                 title: '添加成功！',
            //                 type: 'success',
            //                 msg: '产品类型名称添加成功！',
            //                 closeable: false
            //             });
            //             Goods.goodsGroupAdd(groups_add).$promise.then(function(response) {
            //                 console.log(response);
            //                 console.log('Add success!');
            //                 $scope.search_groups();
            //             }, function(response) {
            //                 console.log('add error!');
            //             });
            //         } else {
            //             Alert.show({
            //                 title: '添加失败',
            //                 type: 'danger',
            //                 msg: '该产品类型名称已存在，请勿重复添加！',
            //                 closeable: false
            //             });
            //         }
            //     });

            // } else {
            //     Alert.show({
            //         title: '添加失败',
            //         type: 'danger',
            //         msg: '产品类型名称不能为空！',
            //         closeable: false
            //     });
            // }
        }

        $scope.ok = function() {
            $uibModalInstance.close($scope.selected);
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
])

// 设置商品属性
.controller('myModelSetGoodsAttrsCtrl', [
    '$scope',
    '$uibModalInstance',
    'goods_detail',
    'Goods',
    'Alert',
    '$uibModal',
    function($scope, $uibModalInstance, goods_detail, Goods, Alert, $uibModal) {
        $scope.selected = [];
        // 获取属性数据列表
        Goods.goodsAttrsList({
            attribute_category_id: goods_detail.attribute_category_id
        }).$promise.then(function(response) {
            var temp_data = response.data;
            angular.forEach(temp_data, function(i) {
                angular.forEach(i.values, function(val) {
                    angular.forEach(goods_detail.attrbute, function(detailVal) {
                        if(detailVal.id == val.attribute_id && detailVal.value_id == val.id){
                            val.isSelected = true;
                        }
                    })
                })
            });
            $scope.attr_list = temp_data;
        }, function(response) {
            console.log(response);
        })

        // 选择商品属性
        var selectvalList = []
        $scope.selAttr = function(val) {
            var ishas = false
            angular.forEach(selectvalList, function(selectval) {
                if(selectval.attribute_id == val.attribute_id){
                    selectval.id = val.id
                    ishas = true
                }
            })
            if(!ishas){
                selectvalList.push(val)
            }
            angular.forEach($scope.attr_list, function(i) {
                if (i.id == val.attribute_id) {
                    angular.forEach(i.values, function(val) {
                        val.isSelected = false;
                    })

                    // angular.forEach(goods_detail.attrbute, function(detailVal) {
                    //     if(detailVal.id == val.attribute_id){
                    //         detailVal.value_id = val.id   
                    //     }   
                    // })

                    val.isSelected = true;
                }
            });
            // console.log($scope.attr_list);
        }

        //管理属性
        $scope.manageAttr = function(attr) {
            var attr_value_list = {
                attrbute: $scope.attr_list,
                attr_current: attr,
                goods_detail: goods_detail
            };
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModelAttrList.html',
                controller: 'manageGoodsAttrDetail',
                size: 'sm',
                resolve: {
                    attr_list: function() {
                        return attr_value_list;
                    }
                }
            });
            modalInstance.result.then(function(selected) {
                // Goods.goodsAttrsList({
                //     attribute_category_id: goods_detail.attribute_category_id
                // }).$promise.then(function(response) {
                //     $scope.attr_list = response.data;
                // }, function(response) {
                //     console.log(response);
                // });
            }, function() {

            });
        }

        $scope.out_select_val = [];

        function checkSelect() {
            var sel_length = 0,
                attr_type = 0;;
            angular.forEach($scope.attr_list, function(i) {
                attr_type++;
                angular.forEach(i.values, function(val) {
                    if (val.isSelected == true) {
                        sel_length++;
                        $scope.out_select_val.push(val);
                    }
                })
            });
            if (attr_type !== sel_length) {
                $scope.out_select_val = [];
                return false;
            } else {
                return true;
            }
        }

        $scope.ok = function() {
            console.log("ok")
            if (checkSelect()) {
                $uibModalInstance.close($scope.out_select_val);

                angular.forEach($scope.attr_list, function(i) {
                    angular.forEach(selectvalList, function(selectval) {
                        if (i.id == selectval.attribute_id) {
                            angular.forEach(i.values, function(val) {
                                val.isSelected = false;
                            })

                            angular.forEach(goods_detail.attrbute, function(detailVal) {
                                if(detailVal.id == selectval.attribute_id){
                                    detailVal.value_id = selectval.id   
                                }   
                            })

                        }
                    })
                    
                });

            } else {
                Alert.show({
                    type: 'danger',
                    msg: '未选择属性或属性不完整！',
                    closeable: false
                })
            }

        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
])

// 属性管理
.controller('manageGoodsAttrDetail', [
    '$scope',
    'Goods',
    '$uibModalInstance',
    'attr_list',
    'Alert',
    function($scope, Goods, $uibModalInstance, attr_list, Alert) {
        console.log(attr_list)
        $scope.attr_name = attr_list.attr_current.name;
        // 查询属性项
        function getNewData(item) {
            Goods.goodsAttrsList({
                attribute_category_id: attr_list.goods_detail.attribute_category_id
            }).$promise.then(function(response) {
                response.data[attr_list.attr_current.id].values;
                angular.forEach(attr_list.attr_current.values, function(item) {
                    item.newAttr = '';
                    item.isEditing = false;
                })
                $scope.attr_list_detail = response.data[attr_list.attr_current.id].values;
                if(item){
                    angular.forEach(attr_list.attr_current.values, function(attr_current) {
                        if(attr_current.id == item.id){
                            attr_current.value = item.newAttr;
                        }
                    })
                }
                // console.log($scope.attr_list_detail);
            }, function(response) {
                console.log(response);
            })
        }
        getNewData();

        // 修改属性项的值
        $scope.modifyAttrVal = function(item) {
            item.isEditing = true;
        }
        $scope.modifyDone = function(item) {
            if(item.newAttr == undefined || item.newAttr == ''){
                Alert.show({
                    type: 'danger',
                    msg: '属性项不能为空！',
                    closeable: false
                })
                return;
            }
            var modify_data = {
                attr_val_id: item.id,
                attr_val: item.newAttr
            }
            Goods.goodsAttrsValUpdate(modify_data).$promise.then(function(response) {
                item.value = item.newAttr;
                item.isEditing = false;
                getNewData(item);
                
                console.log($scope.attr_list_detail)
                Alert.show({
                    type: 'success',
                    msg: '修改成功',
                    closeable: true
                })
            }, function(response) {

            })
        }

        // 添加属性项
        $scope.addAttrDetail = function() {
            if ($scope.add_new_attr && $scope.add_new_attr != '') {
                var add_value_data = {
                    attribute_id: attr_list.attr_current.id,
                    attr_val: $scope.add_new_attr
                };
                Goods.goodsAttrsAdd(add_value_data).$promise.then(function(response) {
                    if(response.error == "0"){
                        Alert.show({
                            type: 'success',
                            msg: '添加成功！',
                            closeable: true
                        })
                        var obj = {
                            id: response.data.id,
                            attribute_id: attr_list.attr_current.id,
                            value: $scope.add_new_attr
                        }
                        $scope.attr_list_detail.push(obj)
                        attr_list.attr_current.values.push(obj)
                    }else{
                        Alert.show({
                            type: 'danger',
                            msg: response.message,
                            closeable: false
                        })
                    }
                    
                }, function(response) {

                })
            } else {
                Alert.show({
                    type: 'danger',
                    msg: '属性项不能为空！',
                    closeable: false
                })
            }
        }

        $scope.ok = function() {
            $uibModalInstance.close();
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
])

// 属性管理
.controller('myModelAddGroup', [
    '$scope',
    '$uibModalInstance',
    'groups',
    'category_id',
    'Alert',
    'Goods',
    function($scope, $uibModalInstance, groups, category_id, Alert, Goods) {
        console.log(groups)
        $scope.ok = function() {
            console.log($scope.add_text)
            var groups_add = {
                group_name: $scope.add_text,
                name: $scope.add_text,
                attribute_category_id: category_id,
                create_time: Date.parse(new Date())
            }
            Goods.goodsGroupAdd(groups_add).$promise.then(function(response) {
                if(response.error == "0"){
                    groups_add.id = response.data.id
                    groups.push(groups_add)
                }else{
                    Alert.show({
                        title: '添加失败！',
                        type: 'success',
                        msg: '产品类型名称添加失败！',
                        closeable: false
                    });
                }
            }, function(response) {
                console.log('add error!');
            });

            $uibModalInstance.close();
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
])

