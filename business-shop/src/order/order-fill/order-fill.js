angular.module("App.Order.Orderfill", []).controller("App.Order.Orderfill.Controller", [
    "$scope",
    "$state",
    "$ionicModal",
    "Order",
    "Member",
    "Goods",
    "Shop",
    "$ionicHistory",
    "$ionicPopup",
    "PickService",
    "Loading",
    "$location",
    "$http",
    "dyLocation",
    function(
        $scope,
        $state,
        $ionicModal,
        Order,
        Member,
        Goods,
        Shop,
        $ionicHistory,
        $ionicPopup,
        PickService,
        Loading,
        $location,
        $http,
        dyLocation
    ) {

        // selectModel
        $ionicModal.fromTemplateUrl('order/order-fill/model-select-shop.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        //选择店铺
        $scope.openModal = function() {
            if ($scope.shop_list.length != 0) {
                $scope.modal.show();
            }
        };
        //确认modal
        $scope.ok = function() {
            $scope.modal.hide();
        };

        //取消modal
        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        //改变路由时销毁modal
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        //是否选中
        $scope.isActive = function(num) {
            return num == $scope.index;
        }

        $scope.index = 0;
        //选择区域
        $scope.chooseShop = function(index, shop) {
            $scope.index = index;
            if (shop.is_my_shop) { //本店
                $scope.orderData.sub_dealer_shop_id = 0;
            } else { //分店
                $scope.orderData.sub_dealer_shop_id = shop.id;
            }
            $scope.shop.title = shop.sub_shop_name;
            $scope.shop.mobile = shop.tel_phone;
            $scope.shop.address_name = shop.address_name;
            $scope.modal.hide();
        }

        $scope.back = function() {
            $ionicPopup.confirm({
                title: '温馨提示',
                template: '商品不满意？想再仔细了解下~',
                cancelText: "我再想想",
                okText: "确认离开"
            }).then(function(response) {
                if (response) {
                    $ionicHistory.goBack();
                } else {}
            });
        };

        //加载
        Loading.show('生成订单中');
        $scope.loadingText = false;
        //订单数据
        $scope.orderData = {
            goods_id: 0, //商品ID
            quantity: '', //商品数
            ship_type: 0, //配送方式（1快递，2自提）
            address_id: '', //收货地址标识
            dealer_shop_id: 0, //自提点标识
            sub_dealer_shop_id: "", //分店ID
            service_address_id: 0, //预约服务点标识
            integral_quantity: 0, //颜值分抵扣商品数
            gold_quantity: 0, //颜值币抵扣商品数
            voucher_quantity: 0, //使用红包金额数
        };

        $scope.orderData.quantity = $state.params.quantity >= 999 ? $state.params.quantity = 999 : Number($state.params.quantity) || 0;
        $scope.orderData.goods_id = Number($state.params.id) || 0;
        $scope.get_goods_id = Number(PickService.get("goodId")) || 0; //店铺标识读写

        /*******
         *
         *  选项卡模块
         *
         */

        //获取预约地址
        function getServiceAddress() {
            return PickService.get("server_id") || 0;
        }

        //获取自提点地址
        function getPickAddress() {
            return PickService.get("shopId") || 0;
        }

        //获取选项卡状态
        function getTabStatus() {
            return PickService.get('tab') || "kuaidi";
        }

        //设置选项卡状态
        function setTabStatus(val) {
            $scope.tab = val;
            return PickService.set('tab', val);
        }
        $scope.setTabStatus = setTabStatus;
        //计算配送方式
        function getShipType() {
            var dic = {
                "kuaidi": 1,
                "yuyue": 4,
                "ziti": 2
            }
            return dic[getTabStatus()] || 0;
        }

        //运费设置

        $scope.$watch(function() {
            return getTabStatus();
        }, function(newVal) {
            if (newVal == "kuaidi") {
                $scope.shipRiceture = false;
            } else {

                $scope.shipRiceture = true;
            }
        });


        /*******
         *
         *  选项卡模块 end
         *
         */

        $scope.tab = PickService.get('tab');

        //初始化
        var amount = {};
        var amountChel = false;
        if (PickService.get('stateId') == $scope.orderData.goods_id && PickService.get('quantityId') == $scope.orderData.quantity) {
            amountChel = true;
            amount = PickService.get('select');
        } else {
            amount = {
                integral: {
                    checked: false,
                    amount: 1,
                    overflow: false
                },
                gold: {
                    checked: false,
                    amount: 1,
                    overflow: false
                },
                voucher: {
                    checked: false,
                    amount: 1,
                    overflow: false
                }
            };
        }
        PickService.set('stateId', $scope.orderData.goods_id);
        PickService.set('quantityId', $scope.orderData.quantity);
        $scope.amount = amount;

        //选择自提点
        $scope.gotoPickList = function gotoPickList() {
            $state.go('order.order-address', {
                shop_id: $scope.shop.id
            });
        };
        //选择预约服务
        $scope.DetPickList = function DetPickList() {
            $state.go('order.order-appointment', {
                shop_id: $scope.shop.id, //店铺id
                goods_id: $scope.orderData.goods_id //商品id
            });
        };

        //获取个人资金信息
        var userMoney = '';
        Member.getMemberAmountInfo().$promise.then(function(data) {
            userMoney = $scope.user_money = data;
            userMoney.integral = data.integral || 0;
            userMoney.gold = data.gold / 100 || 0;
            userMoney.voucher = data.voucher / 100 || 0;
            goodsLoading();
            Loading.hide();
        }, function(error) {
            $ionicPopup.alert({
                title: "错误",
                template: (error && error.data && error.data.message) || "服务器错误！"
            });
        });
        //获取商品信息
        var inter, goldr, vouchers;
        $scope.Dataids = false; //选择
        $scope.Daseelt = true; //是代言店
        $scope.Dataslect = true; //不是代言店
        $scope.Makeids = false; //选择预约服务
        $scope.Makeslect = true;
        // $scope.Dataslect = true;//选择自提之后
        $scope.Zhekouhide = true;
        $scope.interhide = true;
        $scope.goldhide = true;
        $scope.voucherhide = true;

        function goodsLoading() {
            dyLocation.get().then(function(position) {
                console.log(position)


                Goods.getDetailById({
                    goods_id: $state.params.id,
                    lng: position[0],
                    lat: position[1]
                }).$promise.then(function(data) {
                    $scope.goods_detail = data.goods; //商品信息
                    $scope.goodsImage = data.image;
                    if (!PickService.get('tab')) {
                        $scope.tab = +$scope.goods_detail.ship_type >= 4 ? 'yuyue' : $scope.tab;
                        $scope.tab = +$scope.goods_detail.ship_type in {
                            2: true,
                            3: true,
                            6: true,
                            7: true
                        } ? 'ziti' : $scope.tab;
                        $scope.tab = +$scope.goods_detail.ship_type % 2 == 1 ? 'kuaidi' : $scope.tab;

                        setTabStatus($scope.tab);
                    }
                    $scope.current_price = Number(data.goods.current_price) / 100 || 0;
                    $scope.ship_price = Number(data.goods.ship_price) / 100 || 0;
                    $scope.goods_detail.integral = inter = $scope.goods_detail.integral || 0; //颜值分
                    $scope.goods_detail.gold = goldr = $scope.goods_detail.gold / 100 || 0; //代言币  
                    $scope.goods_detail.voucher = vouchers = $scope.goods_detail.voucher / 100 || 0; //红包
                    $scope.shop = data.shop;
                    //获取list店铺
                    Shop.getShopList({
                        shop_id: $scope.shop.id,
                        lng: position[0],
                        lat: position[1]
                    }).$promise.then(function(shop_list) {
                        $http.get('http://wap.cellmyth.cn/city.data-3.json').success(function(data) {
                            var addreText = getAddress(data, $scope.shop.area_id);
                            $scope.addresdMr = addreText.join('')
                            $scope.shop.address_name = $scope.addresdMr + $scope.shop.address
                            $scope.shop_list = shop_list
                            angular.forEach($scope.shop_list, function(shop) {
                                shop.address_name = shop.sub_shop_area_name_str + shop.sub_street_address
                            });
                            console.log($scope.shop.address_name)
                            var my_shop = {
                                address_name: $scope.shop.address_name,
                                sub_shop_name: $scope.shop.title,
                                tel_phone: $scope.shop.mobile,
                                distance: $scope.shop.distance,
                                is_my_shop: true
                            }
                            $scope.shop_list.unshift(my_shop)
                        }).error(function(data) {});

                        
                    }, function(error) {
                        console.log(error);
                    });



                    var selectedTypeList = []
                    angular.forEach($scope.goods_detail.attrbute, function(detailItem) {
                        selectedTypeList.push(detailItem.value)
                    });
                    $scope.selectedType = selectedTypeList.join("、")

                    if ($scope.shop.is_own == 0) {
                        $scope.Dataids = true;
                        $scope.Dataifalse = false;
                        $scope.Dataslect = true;
                    } else {
                        $scope.Dataifalse = true;
                    }
                    //自动匹配
                    orderAuto();
                    //判断是否支持折扣
                    if (inter == 0 && goldr == 0 && vouchers == 0) {
                        $scope.Zhekouhide = false;
                        $scope.loadingText = true;
                    } else {
                        if (inter > 0) {
                            $scope.interhide = false;
                        }
                        if (goldr > 0) {
                            $scope.goldhide = false;
                        }
                        if (vouchers > 0) {
                            $scope.voucherhide = false;
                        }
                        $scope.loadingText = true;
                    }
                    PickService.set("goodId", data.shop.id);
                    //$scope.get_goods_id == $scope.shop.id && $scope.orderData.dealer_shop_id ? shopAuto() : '';
                    //$scope.get_goods_id == $scope.shop.id && $scope.orderData.service_address_id ? detaiAuto() : '';
                    shopAuto();
                    detaiAuto();
                }, function(error) {
                    console.log(error);
                });

            }, function(error) {
                $scope.distance_error = "无法获取距离信息";
                console.log(error);
            })

        }



        //自动匹配
        function orderAuto() {
            if (amountChel) {
                amount.integral.amount == 0 ? $scope.isInteDisabled = true : '';
                amount.gold.amount == 0 ? $scope.isGoldDisabled = true : '';
                amount.voucher.amount == 0 ? $scope.isVocherDisabled = true : '';
            } else {
                var Autointer = Math.abs($scope.orderData.quantity * inter);
                var Autogold = Math.abs($scope.orderData.quantity * goldr);
                var Autovoucher = Math.abs($scope.orderData.quantity * vouchers);
                // 颜值分匹配自动选择
                if (Autointer < userMoney.integral || 0) {
                    $scope.isInteDisabled = false;
                    amount.integral.amount = $scope.orderData.quantity;
                    amount.integral.checked = true;
                } else {
                    amount.integral.amount = Math.floor(userMoney.integral / inter) || 0;
                    amount.integral.checked = true;
                    if (amount.integral.amount == 0) {
                        $scope.isInteDisabled = true;
                        amount.integral.checked = false;
                    }
                };
                // 颜值币匹配自动选择
                if (Autogold < userMoney.gold || 0) {
                    $scope.isGoldDisabled = false;
                    amount.gold.amount = $scope.orderData.quantity;
                    amount.gold.checked = true;
                } else {
                    amount.gold.amount = Math.floor(userMoney.gold / goldr) || 0;
                    amount.gold.checked = true;
                    if (amount.gold.amount == 0) {
                        $scope.isGoldDisabled = true;
                        amount.gold.checked = false;
                    }
                };
                // 红包折扣匹配自动选择
                if (Autovoucher < userMoney.voucher || 0) {
                    $scope.isVocherDisabled = false;
                    amount.voucher.amount = $scope.orderData.quantity;
                    amount.voucher.checked = true;
                } else {
                    amount.voucher.amount = Math.floor(userMoney.voucher / vouchers) || 0;
                    amount.voucher.checked = true;
                    if (amount.voucher.amount == 0) {
                        $scope.isVocherDisabled = true;
                        amount.voucher.checked = false;
                    }
                };
            }
        }
        //获取收货地址
        Member.getOrdermoreId().$promise.then(function(data) {
            $scope.user_local = data;
            $scope.orderData.address_id = data.id;
            $http.get('http://wap.cellmyth.cn/city.data-3.json').success(function(data) {
                var addreText = getAddress(data, $scope.user_local.area_id);
                $scope.addresdSh = addreText.join('') + $scope.user_local.address;
            }).error(function(data) {});
            Loading.hide();
        }, function(error) {
            console.log(error);
        });
        //获取自提点地址
        function shopAuto() {
            var pick_address = getPickAddress();
            if (getTabStatus() == 'ziti' && pick_address) {
                Shop.getUserzilocal({
                    id: pick_address
                }).$promise.then(function(data) {
                    $scope.select = data;
                    $scope.Dataids = true;
                    $scope.Dataifalse = true;
                    $scope.Dataslect = false;
                    $http.get('http://wap.cellmyth.cn/city.data-3.json').success(function(data) {
                        var addreText = getAddress(data, $scope.select.area_id);
                        $scope.addresdZt = addreText.join('')
                    }).error(function(data) {});
                    Loading.hide();
                }, function(error) {
                    console.log(error);
                });
            }
        }

        //获取预约服务地址
        function detaiAuto() {
            var service_address = getServiceAddress();
            if (getTabStatus() == 'yuyue' && service_address) {
                //服务区域城市获取
                Shop.getDetaiShop({
                    id: service_address
                }).$promise.then(function(data) {
                    $scope.seletDetai = data;
                    $http.get('http://wap.cellmyth.cn/city.data-3.json').success(function(data) {
                        var addreText = getAddress(data, $scope.seletDetai.area_id);
                        $scope.addresd = addreText.join('')
                    }).error(function(data) {});
                    $scope.Makeids = true;
                    $scope.Makeslect = false;
                    Loading.hide();
                }, function(error) {
                    console.log(error);
                });
            }

        }

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
        }

        //判断输入是否先选中
        $scope.integralfocus = function(amount) {
            if (amount.integral.checked == false) {
                amoutAlert();
            }
        }
        $scope.goldfocus = function(amount) {
            if (amount.gold.checked == false) {
                amoutAlert()
            }
        }
        $scope.voucherfocus = function(amount) {
            if (amount.voucher.checked == false) {
                amoutAlert()
            }
        }

        function amoutAlert() {
            $ionicPopup.alert({
                title: "温馨提示",
                template: "请勾选商品折扣类型"
            });
        }

        //商品数量超出判断
        //颜值分加减
        $scope.buy = {
                subtract: function() {
                    if (amount.integral.checked == false) {
                        amoutAlert();
                        return
                    }
                    if (amount.integral.amount != 1) {
                        amount.integral.amount -= 1;
                    }
                },
                plus: function($event) {
                    if (amount.integral.checked == false) {
                        amoutAlert();
                        return
                    }
                    amount.integral.amount += 1;
                    if ($scope.orderData.quantity >= 999) {
                        alertEds();
                        amount.integral.amount = 999;
                        return
                    } else {
                        if (amount.integral.amount > $scope.orderData.quantity) {
                            alertTd();
                            amount.integral.amount = $scope.orderData.quantity;
                        } else {
                            var inteDe = Math.floor(userMoney.integral / inter) || 0;
                            if ($scope.orderData.quantity >= inteDe) {
                                $ionicPopup.alert({
                                    title: "温馨提示",
                                    template: "您的颜值分不足"
                                });
                                amount.integral.amount = inteDe;
                                return
                            }
                        }
                    }
                },
            }
            //颜值币加减
        $scope.bis = {
                subtract: function() {
                    if (amount.gold.checked == false) {
                        amoutAlert();
                        return
                    }
                    if (amount.gold.amount != 1) {
                        amount.gold.amount -= 1;
                    }
                },
                plus: function($event) {
                    if (amount.gold.checked == false) {
                        amoutAlert();
                        return
                    }
                    amount.gold.amount += 1;
                    if ($scope.orderData.quantity >= 999) {
                        alertEds();
                        amount.gold.amount = 999;
                        return
                    } else {
                        if (amount.gold.amount > $scope.orderData.quantity) {
                            alertTd();
                            amount.gold.amount = $scope.orderData.quantity;
                        } else {
                            var goldDe = Math.floor(userMoney.gold / goldr) || 0;
                            if (amount.gold.amount >= goldDe) {
                                $ionicPopup.alert({
                                    title: "温馨提示",
                                    template: "您的代言币不足"
                                });
                                amount.gold.amount = goldDe;
                                return
                            }
                        }
                    }

                },
            }
            //折扣红包加减
        $scope.kous = {
            subtract: function() {
                if (amount.voucher.checked == false) {
                    amoutAlert();
                    return
                }
                if (amount.voucher.amount != 1) {
                    amount.voucher.amount -= 1;
                }
            },
            plus: function($event) {
                if (amount.voucher.checked == false) {
                    amoutAlert();
                    return
                }
                amount.voucher.amount += 1;
                if ($scope.orderData.quantity >= 999) {
                    alertEds();
                    amount.voucher.amount = 999;
                    return
                } else {
                    if (amount.voucher.amount > $scope.orderData.quantity) {
                        alertTd();
                        amount.voucher.amount = $scope.orderData.quantity;
                    } else {
                        var vouDe = Math.floor(userMoney.voucher / vouchers) || 0;
                        if ($scope.orderData.quantity > vouDe) {
                            $ionicPopup.alert({
                                title: "温馨提示",
                                template: "您的折扣红包不足"
                            });
                            amount.voucher.amount = vouDe;
                            return
                        }
                    }
                }
            },
        }

        function alertEds() {
            $ionicPopup.alert({
                title: "温馨提示",
                template: "<div style='text-align:center'>商品数量超过999个<br/>请打电话向商家订购</div>"
            });
        };

        function alertTd() {
            $ionicPopup.alert({
                title: "温馨提示",
                template: "单个商品只能抵扣" + $scope.orderData.quantity + "件商品数量哦！"
            });
        }

        //初始化提交订单按钮
        $scope.isSubmit = false;
        $scope.submitTxt = "提交订单";

        $scope.mackeOrder = function() {
            var params;
            if (isOverflow()) {
                $ionicPopup.alert({
                    title: "错误",
                    template: "您的商品折扣不足,已自动调整！"
                });

                //调整折扣数量
                adjustDiscount();
                return false;
            };


            $scope.orderData.ship_type = getShipType(); //配送方式
            //$scope.orderData.address_id = //快递收获地址
            $scope.orderData.service_address_id = getServiceAddress(); //预约服务地址
            $scope.orderData.dealer_shop_id = getPickAddress(); //自提点标识

            if (!$scope.orderData.ship_type) {
                $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '请选择收配送方式',
                    cancelText: "取消",
                    okText: "OK"
                });
                return false;
            }
            //快递验证

            if ($scope.orderData.ship_type == 1 && $scope.orderData.address_id == "") {
                $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '请选择收货地址',
                    cancelText: "取消",
                    okText: "OK"
                }).then(function(response) {
                    if (response) {
                        $state.go("user.address");
                    } else {}
                });
                return false;
            }


            //自提验证
            if ($scope.orderData.ship_type == 2 && Number($scope.shop.is_own) && !$scope.orderData.dealer_shop_id) {
                $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '请选择自提点',
                    cancelText: "取消",
                    okText: "OK"
                }).then(function(response) {
                    if (response) {
                        $scope.gotoPickList()
                    } else {}
                });
                return false;
            }

            //服务验证
            if ($scope.orderData.ship_type == 4 && $scope.orderData.service_address_id == "") {
                $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '请选择预约服务',
                    cancelText: "取消",
                    okText: "OK"
                }).then(function(response) {
                    if (response) {
                        $scope.DetPickList();
                    } else {}
                });
                return false;
            }


            params = angular.copy($scope.orderData);
            angular.forEach(params, function(value, key) {
                if (Number(value) == "" || value == null || value == undefined) {
                    delete params[key];
                }
            });

            Loading.show('正在提交订单');

            //如果点击提交订单按钮
            if ($scope.isSubmit == false) {
                Order.createOrder(params).$promise.then(function(data) {
                    Loading.hide();
                    var order_id = data.order_id;
                    $state.go('order.pay', {
                        order_id: order_id
                    });

                    $scope.isSubmit = false;
                    $scope.submitTxt = "提交成功";
                }, function(error) {
                    $ionicPopup.alert({
                        title: "错误",
                        template: (error && error.data && error.data.message) || "服务器错误！"
                    });
                });

            }

            $scope.isSubmit = true;
            $scope.submitTxt = "提交中...";

        }
        $scope.totalMoney = function() {
            var integral = 0,
                gold = 0,
                voucher = 0;
            var total = ($scope.orderData.quantity * $scope.current_price) + ($scope.shipRiceture ? 0 : $scope.ship_price);
            //计算折扣值
            if ($scope.goods_detail) {
                integral = Math.abs(amount.integral.checked * amount.integral.amount * inter) || 0;
                gold = Math.abs(amount.gold.checked * amount.gold.amount * goldr) || 0;
                voucher = Math.abs(amount.voucher.checked * amount.voucher.amount * vouchers) || 0;
                PickService.set('select', amount);
                //验证是否超出可用折扣值，调整数据
                if (userMoney) {
                    if (integral > userMoney.integral) {
                        integral = Math.floor(userMoney.integral / inter) * inter;
                        amount.integral.overflow = true;
                        $scope.isInteDisabled = true;
                        amount.integral.checked = false;
                    }
                    if (gold > userMoney.gold) {
                        gold = Math.floor(userMoney.gold / goldr) * goldr;
                        amount.gold.overflow = true;
                        $scope.isGoldDisabled = true;
                        amount.gold.checked = false;
                    }
                    if (voucher > userMoney.voucher) {
                        voucher = Math.floor(userMoney.voucher / vouchers) * vouchers;
                        amount.voucher.overflow = true;
                        $scope.isVocherDisabled = true;
                        amount.voucher.checked = false;
                    }
                }



                /*
                 *验证使用折扣后实付金额是否为负数，调整折扣数量
                 *优先使用颜值分再次颜值币最后红包
                 */
                if (total - integral < 0) {
                    integral = Math.floor(total / inter) * inter;
                    gold = 0;
                    voucher = 0;
                } else if (total - integral - gold < 0) {
                    gold = Math.floor((total - integral) / goldr) * goldr;
                    voucher = 0;
                } else if (total - integral - gold - voucher < 0) {
                    voucher = Math.floor((total - integral - gold) / vouchers) * vouchers;
                }
                //折扣数量
                $scope.orderData.integral_quantity = integral / inter || 0;
                $scope.orderData.gold_quantity = gold / goldr || 0;
                $scope.orderData.voucher_quantity = voucher / vouchers || 0;
                total = total - (integral * $scope.goods_detail.integral_val) - (gold * $scope.goods_detail.gold_val) - voucher;
                total = total >= 0 ? total : 0;

            }
            return total;
        };
        $scope.totalMoney();
        //折扣数量是否溢出
        function isOverflow() {
            return amount.integral.overflow || amount.gold.overflow || amount.voucher.overflow;
        };
        //折扣数量溢出时调整折扣数量
        function adjustDiscount() {
            amount.integral.amount = $scope.orderData.integral_quantity;
            amount.gold.amount = $scope.orderData.gold_quantity;
            amount.voucher.amount = $scope.orderData.voucher_quantity;
            amount.integral.overflow = false;
            amount.gold.overflow = false;
            amount.voucher.overflow = false;
        };

    }
]);