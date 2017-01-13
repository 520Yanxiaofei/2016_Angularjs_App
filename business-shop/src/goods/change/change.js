angular.module("App.Goods.Change", []).controller("App.Goods.Change.Controller", [
    "$scope",
    "$state",
    "Loading",
    "Goods",
    "$ionicPopup",
    "PickService",
    "$ionicHistory",
    function(
        $scope,
        $state,
        Loading,
        Goods,
        $ionicPopup,
        PickService,
        $ionicHistory
    ) {


        $scope.form = {
            key: '',
            search_type: '',
            shop_type: "0",
            order: "0",
            price_range_type: "0"
        };
        $scope.isFocus = true;
        // 搜索类型
        $scope.seachType = "goods";
        $scope.form.key = '';


        $scope.records = [{
            keyword: "美业"
        }, {
            keyword: "代颜网"
        }, {
            keyword: "花子直播间"
        }];

        // 删除单条搜索记录
        $scope.delSearchRecord = function(index) {
            $scope.records.splice(index, 1);
        }

        // 删除所有搜索记录
        $scope.delAllRecord = function() {
            $scope.records = null;
        }




        // 清除搜索关键词
        $scope.clearKeyword = function($event) {
            $event.stopPropagation();　　
            $scope.form.key = "";
        }
        $scope.getSearchType = function(type) {
            $scope.seachType = type;
        }

        // 回车键搜索
        $scope.keyUpSearch = function($event) {
            if ($event.keyCode === 13) {
                $scope.searchValue($scope.form.key);
            }
        }
        $scope.statusTitle = $state.params.type_status;
        //初始化
        $scope.shop_list = [{
            'value': 1,
            'text': '代颜街自营店'
        }, {
            'value': 2,
            'text': '品牌店'
        }, {
            'value': 3,
            'text': 'O2O线下服务店'
        }];
        var selectText = '';
        if ($scope.statusTitle == 3) {
            selectText = '红包金额';
            $scope.vocher_list = [{
                'value': 1,
                'text': '1~100元红包'
            }, {
                'value': 2,
                'text': '101~200元红包'
            }, {
                'value': 3,
                'text': '201~300元红包'
            }, {
                'value': 4,
                'text': '301~400元红包'
            }, {
                'value': 5,
                'text': '400元以上红包'
            }];
        } else if ($scope.statusTitle == 2) {
            selectText = '代言币数量';
            $scope.vocher_list = [{
                'value': 1,
                'text': '1~100代言币'
            }, {
                'value': 2,
                'text': '101~200代言币'
            }, {
                'value': 3,
                'text': '201~300代言币'
            }, {
                'value': 4,
                'text': '301~400代言币'
            }, {
                'value': 5,
                'text': '400以上代言币'
            }];
        } else if ($scope.statusTitle == 1) {
            selectText = '颜值分数量';
            $scope.vocher_list = [{
                'value': 1,
                'text': '1~100颜值分'
            }, {
                'value': 2,
                'text': '101~200颜值分'
            }, {
                'value': 3,
                'text': '201~300颜值分'
            }, {
                'value': 4,
                'text': '301~400颜值分'
            }, {
                'value': 5,
                'text': '400颜值分以上'
            }];
        }
        $scope.order_list = [{
            'value': 1,
            'text': selectText + '由高到低'
        }, {
            'value': 2,
            'text': selectText + '由低到高'
        }, {
            'value': 3,
            'text': '支付现金由高到低'
        }, {
            'value': 4,
            'text': '支付现金由低到高'
        }, {
            'value': 5,
            'text': '售价由高到低'
        }, {
            'value': 6,
            'text': '售价由低到高'
        }];

        //监听店铺类型
        $scope.brand_title = "全部类型";
        $scope.$watch('form.shop_type', function(newValue, oldValue) {
            if (newValue == 0) {
                $scope.brand_title = "全部类型";
            } else {
                for (var i = 0; i < $scope.shop_list.length; i++) {
                    if ($scope.shop_list[i].value == newValue) {
                        $scope.brand_title = $scope.shop_list[i].text;
                    }
                }
            }

        }, true);

        $scope.order_title = "默认排序";
        $scope.$watch('form.order', function(newValue, oldValue) {
            if (newValue == 0) {
                $scope.order_title = "默认排序";
            } else {
                for (var i = 0; i < $scope.order_list.length; i++) {
                    if ($scope.order_list[i].value == newValue) {
                        $scope.order_title = $scope.order_list[i].text;
                    }
                }
            }

        }, true);

        $scope.vocher_title = "所有红包范围";
        $scope.$watch('form.price_range_type', function(newValue, oldValue) {
            if (newValue == 0) {
                if ($scope.statusTitle == 3) {
                    $scope.vocher_title = "所有红包范围";
                } else if ($scope.statusTitle == 2) {
                    $scope.vocher_title = "所有代言币范围";
                } else if ($scope.statusTitle == 1) {
                    $scope.vocher_title = "所有颜值分范围";
                }
            } else {
                for (var i = 0; i < $scope.vocher_list.length; i++) {
                    if ($scope.vocher_list[i].value == newValue) {
                        $scope.vocher_title = $scope.vocher_list[i].text;
                    }
                }
            }

        }, true);
        // 搜索
        $scope.searchValue = function(key) {
            $scope.moreDataCanBeLoaded = false;
            Loading.show('正在搜索中');
            $scope.form.key = key;
            $scope.form.search_type = $scope.seachType == 'goods' ? 1 : '' || $scope.seachType == 'shop' ? 2 : '';
            $scope.page = 1;
            $scope.noData = false;
            $scope.moreData = false;
            $scope.Voucherlist = [];
            if ($scope.form.search_type == 2) {
                $scope.loadMore();
            } 
            if ($scope.form.search_type == 1) {
                $scope.loadMore();
            }
        }
        //类型筛选
        $scope.search = function(shop_type) {
            Loading.show();
            $scope.form.shop_type = shop_type;
            $scope.page = 1;
            $scope.Voucherlist = [];
            $scope.noData = false;
            $scope.moreData = false;
            $scope.loadMore();
        }
        //排序筛选
        $scope.orderSd = function(order) {
            Loading.show();
            $scope.form.order = order;
            $scope.page = 1;
            $scope.Voucherlist = [];
            $scope.noData = false;
            $scope.moreData = false;
            $scope.loadMore();
        }
        //红包筛选
        $scope.vocherSd = function(price_range_type) {
            Loading.show();
            $scope.form.price_range_type = price_range_type;
            $scope.page = 1;
            $scope.Voucherlist = [];
            $scope.noData = false;
            $scope.moreData = false;
            $scope.loadMore();
        }
        //上拉加载数据
        $scope.page = 1;
        $scope.limit = 10;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;
        $scope.noData = false;
        $scope.moreData = false;
        $scope.Voucherlist = [];
        // $scope.search_type = $state.params.search_type == 'goods' ? 1 : '' || $state.params.search_type == 'shop' ? 2 : '';
        $scope.loadMore = function() {
            $scope.arsg = {
                title: $scope.form.key || '', //关键词
                search_type: $scope.form.search_type || 1, //搜索类型
                shop_type: $scope.form.shop_type,
                order: $scope.form.order,
                price_range_type: $scope.form.price_range_type,
                page: $scope.page,
                limit: $scope.limit
            };

            //红包兑换
            if ($state.params.type_status == 3) {
                Goods.getVoucherlist($scope.arsg).$promise.then(function(res) {
                    Listdata(res);
                    Loading.hide();
                }, function(error) {

                });
            }
            //代言币兑换
            if ($state.params.type_status == 2) {
                Goods.getGlodlist($scope.arsg).$promise.then(function(res) {
                    Listdata(res);
                    Loading.hide()
                }, function(error) {

                });
            }
            //颜值分兑换
            if ($state.params.type_status == 1) {
                Goods.getIntegrallist($scope.arsg).$promise.then(function(res) {
                    Listdata(res);
                    Loading.hide()
                }, function(error) {

                });
            }
        }
        function Listdata(res) {
            if (res.total == "0") {
                $scope.noData = true;
                $scope.moreDataCanBeLoaded = false;
                Loading.hide();
            } else {
                $scope.AllPage = Math.ceil(res.total / $scope.limit)
                if ($scope.page == 1) {
                    Loading.hide();
                }
                angular.forEach(res.list, function(list) {
                    $scope.Voucherlist.push(list);
                })
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if ($scope.page == $scope.AllPage) {
                    $scope.moreDataCanBeLoaded = false;
                    $scope.moreData = true;
                } else {
                    $scope.page = $scope.page + 1;
                    $scope.moreDataCanBeLoaded = true;
                }

            }
        }



        //确认数量
        $scope.changeOrder = function(ids, stock, titleTx) {
            $scope.goods_number = 1; //商品数量
            $ionicPopup.show({
                template: '<div class="text-left"><div class="textH2">' + titleTx + '</div><div>' + '<span class="itemBtnnum itemRiht" on-touch="buy.subtract()">' + '     <i class="icon ion-ios-minus-empty" ></i>' + ' </span>' + ' <input type="text" ng-model="goods_number" onkeyup="value=value.replace(/[^\d]/g,"")" readonly="readonly" />' + ' <span class="itemBtnnum itemBtnnum-add" on-touch="buy.plus($event,' + stock + ')" style="margin-left:-2px">' + '     <i class="icon ion-ios-plus-empty"></i>' + ' </span>' + '</div></div>',
                title: '确认兑换数量',
                cssClass: 'change_iteckem',
                scope: $scope,
                buttons: [{
                    text: '取消'
                }, {
                    text: '<b>确认兑换</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (e) {
                            //清除上一个订单的状态
                            PickService.clear();
                            $state.go("order.order-fill", {
                                id: ids,
                                quantity: $scope.goods_number
                            });
                        } else {}
                    }
                }]
            });

            // 商品购买操作
            $scope.buy = {
                subtract: function() {
                    if ($scope.goods_number != 1) {
                        $scope.goods_number--;
                    }
                },
                plus: function($event, stock) {
                    $scope.goods_number++;
                    if (parseInt($scope.goods_number) > parseInt(stock)) {
                        $ionicPopup.alert({
                            title: "商品库存不足，已调整最大数量！",
                            okText: "确定"
                        })
                        $scope.goods_number = stock;
                    }
                    if ($scope.goods_number >= 999) {
                        $scope.goods_number = 999;
                        $ionicPopup.alert({
                            title: "最大购买999件商品！",
                            okText: "确定"
                        })
                    }
                }
            }
        }


    }

]);
