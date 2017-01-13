angular.module("App.Goods.Detail", []).controller("App.Goods.Detail.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Goods",
    "$ionicPopup",
    "Shop",
    "Member",
    "$ionicSlideBoxDelegate",
    "Loading",
    "dyLocation",
    "PickService",
    "$ionicModal",
    "Setting",
    "$http",
    function ($scope,
              $state,
              $ionicHistory,
              Goods,
              $ionicPopup,
              Shop,
              Member,
              $ionicSlideBoxDelegate,
              Loading,
              dyLocation,
              PickService,
              $ionicModal,
              Setting,
              $http) {

        var zige_text_list = {
            1: ["1、购买商品获取此商品代言人资格；", "2、拥有资格分享此商品，获取代言奖励；"],
            2: ["1、购买商品获取此商品代言人资格；", "2、拥有资格分享此商品，获取代言奖励；", "3、购买商品享受参与代颜网代言大赛拿大奖；"],
            3: ["1、购买商品获取此品牌商家代言商资格；", "2、拥有资格分享此品牌商家所有商品，获取代言奖励；"],
            4: ["1、购买商品获取此品牌商家代言商资格；", "2、拥有资格分享此品牌商家所有商品，获取代言奖励；", "3、购买商品享受参与代言网代言大赛拿大奖；"],
        }

        $scope.back = function () {
            $ionicHistory.goBack();
        }
        Loading.show();

        $scope.flag_showCard = ($state.params.is_show == "1") ? true : false;
        ; //是否显示购买卡片
        $scope.flag_selectCard = false;//是否显示属性弹出层
        // 根据id获取产品详情
        Goods.getDetailById({
            goods_id: $state.params.id
        }).$promise.then(function (goods_detail) {
            Loading.hide();
            $scope.goods_detail = goods_detail;
            var selectedTypeList = []
            $scope.selectedAttrs = {}
            $scope.attr_list = {}
            angular.forEach(goods_detail.goods.attrbute, function (detailItem) {
                selectedTypeList.push(detailItem.value)
                $scope.selectedAttrs[detailItem.id] = detailItem.value_id;
                $scope.attr_list[detailItem.id] = {
                    'description': detailItem.description,
                    'id': detailItem.id,
                    'name': detailItem.name,
                    'values': {}
                };
            });
            console.log($scope.attr_list);
            $scope.selectedType = selectedTypeList.join("、")
            $scope.godds_list = goods_detail.goods.att_value

            angular.forEach($scope.godds_list, function (goods) {
                angular.forEach(goods.values, function (attr) {
                    $scope.attr_list[attr.attribute_id].values[attr.id] = attr;
                });
            });

            angular.forEach($scope.attr_list, function (attr) {
                angular.forEach(attr.values, function (value) {
                    value.show = true
                })
            })

            $scope.is_fav = goods_detail.is_fav == 1 ? true : false;

            //资格类商品
            if (goods_detail.goods.goods_type == "1") {//代言人商品
                $scope.zige_text = "代言人资格商品"
                if (goods_detail.goods.vote == '0') {//不能参加代言大赛
                    $scope.zige_text_list = zige_text_list[1]
                } else {
                    $scope.zige_text_list = zige_text_list[2]
                }
            } else if (goods_detail.goods.goods_type == "2") {//代言商商品
                $scope.zige_text = "代言商资格商品"
                if (goods_detail.goods.vote == '0') {//不能参加代言大赛
                    $scope.zige_text_list = zige_text_list[3]
                } else {
                    $scope.zige_text_list = zige_text_list[4]
                }
            }

            $ionicSlideBoxDelegate.update();
            $ionicSlideBoxDelegate.loop(true);
            $http.get('http://wap.cellmyth.cn/city.data-3.json').success(function (data) {
                var addreText = getAddress(data, goods_detail.shop.area_id);
                $scope.goods_detail.shop.arealocal = addreText.join('') + goods_detail.shop.address;
            }).error(function (data) {
            });
            getLocation();
            // $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //     event.preventDefault();
            //     if (toState.name == "selected.detail" || toState.name == "commonweal.detail" || toState.name == "selected.competition" || toState.name == "commonweal.competition") {
            Setting.wxconfigParam().$promise.then(function (response) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: response.appId, // 必填，公众号的唯一标识
                    timestamp: response.timestamp, // 必填，生成签名的时间戳
                    nonceStr: response.nonceStr, // 必填，生成签名的随机串
                    signature: response.signature, // 必填，签名，见附录1
                    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {

                    //分享到微信朋友圈
                    wx.onMenuShareTimeline({
                        title: $scope.goods_detail.goods.title, // 分享标题
                        desc: $scope.goods_detail.goods.title_short, // 分享描述
                        imgUrl: $scope.goods_detail.image[0].url, // 分享图标
                        link: 'http://mall.cellmyth.cn/#/goods/detail/' + goods_detail.goods.id + '?share_id=' +response.uid,
                        success: function (response) {
                            // 用户确认分享后执行的回调函数
                            // console.log(response);
                        },
                        cancel: function (response) {
                            // 用户取消分享后执行的回调函数
                            //console.log(response);
                        }
                    });
                    //分享到微信朋友
                    wx.onMenuShareAppMessage({
                        title: $scope.goods_detail.goods.title, // 分享标题
                        desc: $scope.goods_detail.goods.title_short, // 分享描述
                        imgUrl: $scope.goods_detail.image[0].url, // 分享图标
                        link: 'http://mall.cellmyth.cn/#/goods/detail/' + goods_detail.goods.id + '?share_id=' +response.uid,
                        success: function (response) {
                            // 用户确认分享后执行的回调函数
                            // console.log(response);
                        },
                        cancel: function (response) {
                            // 用户取消分享后执行的回调函数
                            //console.log(response);
                        }
                    });
                });
                wx.error(function (res) {
                    //alert(res.errMsg)
                });
            }, function (response) {
                //console.log(response);
            })
            // }
            // });
        }, function (error) {
            console.log(error);
        });

        function refurbishGoodDetail(goods) {
            console.log(goods)
            if (!goods) {
                return
            }
            $state.params.id = goods.goods_id
            // $state.go("goods.detail", {
            //     id: goods.goods_id
            // });
            Loading.show();
            Goods.getDetailById({
                goods_id: goods.goods_id
            }).$promise.then(function (goods_detail) {
                Loading.hide();
                $scope.goods_detail = goods_detail;
                var selectedTypeList = []
                //$scope.selectedAttrs = {}
                angular.forEach(goods_detail.goods.attrbute, function (detailItem) {
                    selectedTypeList.push(detailItem.value)
                    // $scope.selectedAttrs[detailItem.id] = detailItem.value_id;
                });
                $scope.selectedType = selectedTypeList.join("、")

                $scope.is_fav = goods_detail.is_fav == 1 ? true : false;
                $ionicSlideBoxDelegate.update();
                $ionicSlideBoxDelegate.loop(true);
                $http.get('http://wap.cellmyth.cn/city.data-3.json').success(function (data) {
                    var addreText = getAddress(data, goods_detail.shop.area_id);
                    $scope.goods_detail.shop.arealocal = addreText.join('') + goods_detail.shop.address;
                }).error(function (data) {
                });
                getLocation();
            }, function (error) {
                console.log(error);
            });
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

        // 收藏
        $scope.collect = function (id, is_fav) {
            console.log(id);
            if (is_fav == 1) {
                Goods.getproremove({
                    good_id: id
                }).$promise.then(function (response) {
                    // $ionicPopup.alert({
                    //     title: "取消收藏成功！",
                    //     okText: "确定"
                    // }).then(function() {
                    //     $scope.is_fav = false;
                    // });
                    $scope.is_fav = false;
                }, function (response) {
                    $ionicPopup.alert({
                        title: "<span class='assertive'>取消收藏失败</span>",
                        okText: "确定",
                        template: response.data.message
                    })
                });
            } else {
                Goods.addCollect({
                    good_id: id
                }).$promise.then(function (response) {
                    // $ionicPopup.alert({
                    //     title: "收藏成功！",
                    //     okText: "确定"
                    // }).then(function() {
                    //     $scope.is_fav = true;
                    // });
                    $scope.is_fav = true;
                }, function (response) {
                    $ionicPopup.alert({
                        title: "<span class='assertive'>收藏失败</span>",
                        okText: "确定",
                        template: response.data.message
                    })
                })
            }

        }

        // 快递方式
        $scope.distribution = {
            "0": {
                title: "--"
            },
            "1": {
                title: "快递",
            },
            "2": {
                title: "自提"
            },
            "3": {
                title: "快递和自提"
            },
            "4": {
                title: "预约服务"
            },
            "5": {
                title: "快递和预约"
            },
            "6": {
                title: "自提和预约"
            },
            "7": {
                title: "快递和自提和预约"
            }
        };

        $scope.goods_number = 1; //商品数量

        $scope.selectType = {
            showSelectType: function () {
                $scope.flag_selectCard = true;
            },
            hideSelectType: function () {
                $scope.flag_selectCard = false;
            },
            confirmSelect: function () {
                // var goods = get_goods_by_attr_ids($scope.selectedAttrs)
                // this.hideSelectType()
                // $state.go("goods.detail", {
                //     id: goods.goods_id
                // });
                this.hideSelectType()
            },
            disabledButton: function () {
                return !get_goods_by_attr_ids($scope.selectedAttrs);
            }
        }


        // 商品购买操作
        $scope.buy = {
            subtract: function () {
                if ($scope.goods_number != 1) {
                    $scope.goods_number--;
                }
            },
            plus: function ($event) {
                $scope.goods_number++;
                if ($scope.goods_number >= 999) {
                    $scope.goods_number = 999;
                    $ionicPopup.alert({
                        title: "最大购买999件商品！",
                        okText: "确定"
                    })
                }
            },
            showBuyCard: function () {
                $scope.flag_showCard = true;
            },
            hideBuyCard: function () {
                $scope.flag_showCard = false;
            },
            confirmBuy: function (quantity) {
                //清除上一个订单的状态
                PickService.clear();
                // console.log($state.params.id + "," + quantity + "," + $scope.goods_detail.goods.stock)
                if (parseInt(quantity) > parseInt($scope.goods_detail.goods.stock)) {
                    $ionicPopup.alert({
                        title: "商品库存不足，已调整最大数量！",
                        okText: "确定"
                    })
                    $scope.goods_number = $scope.goods_detail.goods.stock
                } else {
                    $state.go("order.order-fill", {
                        id: $state.params.id,
                        quantity: quantity
                    });
                }
            }

        }

        // 通过属性id列表查找商品
        function get_goods_by_attr_ids(ids) {
            var goods_info;
            angular.forEach($scope.godds_list, function (goods) {
                var flag = true;
                for (var i in ids) {
                    if (!goods.values[ids[i]]) {
                        flag = false;
                    }
                }
                if (flag) {
                    goods_info = goods;
                }
            });
            return goods_info;
        }

        //切换商品属性
        $scope.changeType = function (attribute_id, type) {
            if ($scope.selectedAttrs[type] == attribute_id) {
                return;
            }

            angular.forEach($scope.attr_list, function (attrs) {
                attrs.values = {};
            });

            angular.forEach($scope.godds_list, function (goods) {
                var show = !!goods.values[attribute_id];
                angular.forEach(goods.values, function (attr) {
                    attr.show = show || (attr.attribute_id == type);
                    if (!$scope.attr_list[attr.attribute_id].values[attr.id]) {
                        $scope.attr_list[attr.attribute_id].values[attr.id] = attr;
                    } else if (show) {
                        $scope.attr_list[attr.attribute_id].values[attr.id].show = show;
                    }

                    if (attribute_id == attr.id) {
                        $scope.selectedAttrs[attr.attribute_id] = attr.id;
                    }
                });
            });

            angular.forEach($scope.selectedAttrs, function (id, type) {
                if (id && !$scope.attr_list[type].values[id].show) {
                    $scope.selectedAttrs[type] = 0;
                }
            });

            refurbishGoodDetail(get_goods_by_attr_ids($scope.selectedAttrs))

        }

        //获取经纬度
        var getLocation = function () {
            $scope.distance = true;
            $scope.distance_error = "距离获取中...";
            dyLocation.get().then(function (data) {
                showPosition(data);
            }, function (error) {
                $scope.distance_error = "无法获取距离信息";
                console.log(error);
            });
        }
        var showPosition = function (position) {
            Shop.infoLocal({
                shop_id: $scope.goods_detail.shop.id,
                lat: position[1],
                lng: position[0]
            }).$promise.then(function (data) {
                $scope.shop_address = data.distance;
                $scope.distance = false;
            }, function (error) {

            });

        }

        // Model
        $ionicModal.fromTemplateUrl('goods/detail/model-detail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        // 快递方式
        var rolename = {
            "1": {
                title: "代言粉",
            },
            "2": {
                title: "代言人"
            },
            "3": {
                title: "代言商"
            },
            "4": {
                title: "代言店"
            }
        };
        $scope.openModal = function (id) {
            $scope.id = id;
            Goods.getReward({
                goods_id: id,
                shop_id: $scope.goods_detail.shop.id
            }).$promise.then(function (response) {
                $scope.rewardList = response;

                $scope.rolename = rolename[response.rid];
                $scope.modal.show();
            }, function (response) {


            })
        };

        //关闭奖金展示
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        var share_id = $state.params.share_id;
        if (share_id) {
            Member.setShare({
                share_id: share_id
            }).$promise.then(function (goods_detail) {
            });
        }
    }
]);
