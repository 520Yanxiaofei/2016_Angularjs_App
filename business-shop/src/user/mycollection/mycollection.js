angular.module("App.User.Mycollection", []).controller("App.User.Mycollection.Controller", [
    "$scope",
    "$state",
    "$ionicTabsDelegate",
    "$ionicHistory",
    "Member",
    "Shop",
    "Goods",
    "$ionicLoading",
    "$ionicPopup",
    "$timeout",
    "Loading",
    "$ionicPopup",
    "$ionicListDelegate",
    function(
        $scope,
        $state,
        $ionicTabsDelegate,
        $ionicHistory,
        Member,
        Shop,
        Goods,
        $ionicLoading,
        $ionicPopup,
        $timeout,
        Loading,
        $ionicPopup,
        $ionicListDelegate
    ) {
        $scope.back = function() {
            $ionicHistory.goBack();
        };
        //加载
        Loading.show();
        //初始化数据6条
        $scope.page = 1;
        $scope.limit = 6;
        $scope.AllPage = 0;
        $scope.moreData = true; //启用刷新
        $scope.moreDataed = true; //更多数据
        $scope.shopList_length = true; //无数据时
        $scope.Nulldata = false; //空数据选择判断

        $scope.shopList = [];
        //下拉刷新
        $scope.doRefreshse = function() {
            Member.getMemberUsercollection({
                page: $scope.page,
                limit: $scope.limit
            }).$promise.then(function(response) {
                pagelist(response)
            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        //上拉加载
        $scope.loadMorese = function() {
            Member.getMemberUsercollection({
                page: $scope.page,
                limit: $scope.limit
            }).$promise.then(function(response) {
                pagelist(response)
            }, function(error) {})
        };
        function pagelist(response) {
            if (response.total == 0) {
                Loading.hide();
                $scope.moreData = false;
                $scope.shopList_length = false;
                $scope.Nulldata = true;
            } else {
                $scope.AllPage = Math.ceil(response.total / $scope.limit);
                if ($scope.page === 1) {
                    Loading.hide();
                };
                angular.forEach(response.list, function(response) {
                    $scope.shopList.push(response);

                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if ($scope.page === $scope.AllPage) {
                    $scope.moreData = false;
                    $scope.moreDataed = false;
                }
                $scope.page = $scope.page + 1;
                if ($scope.select_all == true) {
                    $scope.shouldShowDeleted = true;
                    for (var i = 0; i < $scope.shopList.length; i++) {
                        $scope.shopList[i].checked = $scope.select_all;
                    }
                }
            }
        };

        //滑动删除
        $scope.listremove_id = function(id) {
            // $event.stopPropagation();
            // $event.preventDefault();
            $ionicPopup.confirm({
                title: '温馨提示',
                template: '确认删除？',
                cancelText: "取消",
                okText: "确定"
            }).then(function(response) {
                if (response) {
                    getDel(id);
                } else {
                    $ionicListDelegate.closeOptionButtons(false);
                }

            });
        };

        $scope.select_all = false;
        //全选批量删除 
        $scope.listId = function() {
            var alld = false;
            var good_id = getDelIdList();
            if ($scope.Nulldata == true) {
                $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '您还没有添加任何店铺！',
                    cancelText: "取消",
                    okText: "去看看店铺"
                }).then(function(response) {
                    if (response) {
                        $state.go("goods.search-result");
                    } else {

                    }
                });
            } else {
                for (var i = 0; i < $scope.shopList.length; i++) {
                    if ($scope.shopList[i].checked == true) {
                        alld = true;
                        break;
                    }
                }
                if (alld) {
                    $ionicPopup.confirm({
                        title: '温馨提示',
                        template: '确认删除店铺收藏？',
                        cancelText: "取消",
                        okText: "确认"
                    }).then(function(response) {
                        if (response) {
                            getDel(good_id);
                        } else {
                            $scope.shouldShowDeleted = false;
                            $scope.select_all = false;
                            for (var i = 0; i < $scope.shopList.length; i++) {
                                $scope.shopList[i].checked = false;
                                alld = false;
                            }
                        }
                    });
                } else {
                    $ionicPopup.alert({
                        title: '温馨提示',
                        content: '请选择需要删除的店铺!'
                    });
                }

            }
        };


        //获取需要删除的id list
        function getDelIdList(list) {
            var del_id = [];
            for (var i = 0; i < $scope.shopList.length; i++) {
                if ($scope.shopList[i].checked === true) {
                    del_id.push($scope.shopList[i].shop_id);
                }
            }
            return del_id;
        };

        //批量删除
        function getDel(id) {
            Loading.show('正在删除中');
            Shop.getgoodsremove({
                    shop_id: id,
                    page: $scope.page,
                    limit: $scope.limit
                })
                .$promise.then(function(response) {
                    if (response.error == 0) {
                        Loading.hide();
                        //滑动单个删除
                        for (var i = 0; i < $scope.shopList.length; i++) {
                            if ($scope.shopList[i].shop_id == id) {
                                $scope.shopList.splice(i, 1);
                                break;
                            }
                            $scope.select_all = false;
                        };
                        //全选不规则删除
                        for (var i = $scope.shopList.length - 1; i >= 0; i--) {
                            if ($scope.shopList[i].checked === true) {
                                $scope.shopList.splice(i, 1);
                            };
                        };
                        pagelist(response);
                        $ionicPopup.alert({
                            title: '删除成功！',
                            okText: "确定"
                        });
                        $scope.select_all = false;
                        $scope.shouldShowDeleted = false;
                        if ($scope.shopList.length == 0) {
                            $scope.shopList_length = false;
                            $scope.moreDataed = true;
                        }
                    } else {
                        Loading.hide();
                        $ionicPopup.alert({
                            title: '删除失败！',
                            okText: "确定"
                        });
                    }

                });
        }
        //点击全选checkbox
        $scope.selectAll = function() {
            $scope.select_all = !$scope.select_all;
            if ($scope.select_all == true) {
                $scope.shouldShowDeleted = true;
                for (var i = 0; i < $scope.shopList.length; i++) {
                    $scope.shopList[i].checked = $scope.select_all;
                }
            } else {
                for (var i = 0; i < $scope.shopList.length; i++) {
                    $scope.shopList[i].checked = false;
                }
                $scope.shouldShowDeleted = false;
            }

        };

        //点击单个checkbox
        $scope.changeds = function(item) {
            var flag = true;
            item.checked = !item.checked;
            if (item.checked) {
                for (var i = 0; i < $scope.shopList.length; i++) {
                    if ($scope.shopList[i].checked == false) {
                        flag = false;
                        break;
                    }
                }
                $scope.select_all = flag ? true : false;
            } else {
                $scope.select_all = false;
            }

            var aaa = false;
            for (var i = 0; i < $scope.shopList.length; i++) {
                if ($scope.shopList[i].checked == true) {
                    aaa = true;
                    break;
                }
            }
            if (aaa) {
                $scope.shouldShowDeleted = true;
            } else {
                $scope.shouldShowDeleted = false;
            }
        };



        //---------------------------------------------------------------------
        //商品收藏
        //初始化数据6条
        $scope.pages = 1;
        $scope.limits = 6;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;
        $scope.moreDatared = true;
        $scope.proList_length = true;
        $scope.localmore = true;
        $scope.Nulldatase = false;
        $scope.proList = [];
        //下拉刷新
        $scope.doRefresh = function() {
            Member.getMemberUserProct({
                page: $scope.pages,
                limit: $scope.limits
            }).$promise.then(function(response) {
                pageData(response)
            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        //上拉加载
        $scope.loadMore = function() {
            Member.getMemberUserProct({
                page: $scope.pages,
                limit: $scope.limits
            }).$promise.then(function(response) {
                pageData(response);
            }, function(error) {})
        };

        function pageData(response) {
            if (response.total == 0) {
                $scope.moreDataCanBeLoaded = false;
                $scope.proList_length = false;
                $scope.moreDatared = true;
                $scope.localmore = true;
                $scope.Nulldatase = true;
                Loading.hide();
            } else {
                $scope.AllPage = Math.ceil(response.total / $scope.limits);
                if ($scope.pages === 1) {
                    Loading.hide();
                    $scope.moreDataCanBeLoaded = true;
                    $scope.localmore = false;
                };
                angular.forEach(response.list, function(response) {
                    $scope.proList.push(response);
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if ($scope.pages === $scope.AllPage) {
                    $scope.moreDataCanBeLoaded = false;
                    $scope.moreDatared = false;
                    $scope.localmore = true;
                }
                $scope.pages = $scope.pages + 1;
                if ($scope.select_alled == true) {
                    $scope.shouldShowDelete = true;
                    for (var i = 0; i < $scope.proList.length; i++) {
                        $scope.proList[i].checked = $scope.select_alled;
                    }
                }
            }
        }

        //点击全选checkbox(商品)
        $scope.selectAlled = function() {
                $scope.select_alled = !$scope.select_alled;
                if ($scope.select_alled == true) {
                    $scope.shouldShowDelete = true;
                    for (var i = 0; i < $scope.proList.length; i++) {
                        $scope.proList[i].checked = $scope.select_alled;
                    }
                } else {
                    for (var i = 0; i < $scope.proList.length; i++) {
                        $scope.proList[i].checked = false;
                    }
                    $scope.shouldShowDelete = false;
                }
            }
            //点击单个checkbox
        $scope.changeed = function(itemro) {
                var flag = true;
                itemro.checked = !itemro.checked;
                if (itemro.checked) {
                    for (var i = 0; i < $scope.proList.length; i++) {
                        if ($scope.proList[i].checked == false) {
                            flag = false
                            break;
                        }
                    }
                    $scope.select_alled = flag ? true : false;
                } else {
                    $scope.select_alled = false;
                }
                var ddd = false;
                for (var i = 0; i < $scope.proList.length; i++) {
                    if ($scope.proList[i].checked == true) {
                        ddd = true;
                        break;
                    }
                }
                if (ddd) {
                    $scope.shouldShowDelete = true;
                } else {
                    $scope.shouldShowDelete = false;
                }
            }
            //滑动删除
        $scope.listProremove_id = function(id) {
            $ionicPopup.confirm({
                title: '温馨提示',
                template: '确认删除？',
                cancelText: "取消",
                okText: "确定"
            }).then(function(response) {
                if (response) {
                    getproDel(id);
                } else {
                    $ionicListDelegate.closeOptionButtons(false);
                }
            });

        };
        //获取需要删除的id list
        function getDelproList(list) {
            var del_id = [];
            for (var i = 0; i < $scope.proList.length; i++) {
                if ($scope.proList[i].checked === true) {
                    del_id.push($scope.proList[i].goods_id);
                }
            }
            return del_id;
        };
        $scope.select_alled = false;
        //全选批量删除 
        $scope.listProId = function(list) {
            if ($scope.Nulldatase == true) {
                $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '您还没有添加任何商品！',
                    cancelText: "取消",
                    okText: "去看看商品"
                }).then(function(response) {
                    if (response) {
                        $state.go("goods.search-goods");
                    } else {

                    }
                });
            } else {
                var allds = false;
                var goods_id = getDelproList();
                for (var i = 0; i < $scope.proList.length; i++) {
                    if ($scope.proList[i].checked == true) {
                        allds = true;
                        break;
                    }
                }
                if (allds) {
                    $ionicPopup.confirm({
                        title: '温馨提示',
                        template: '确认删除商品收藏？',
                        buttons: [{
                            text: '取消',
                            onTap: function(e) {
                                $scope.select_alled = false;
                                $scope.shouldShowDelete = false;
                                for (var i = 0; i < $scope.proList.length; i++) {
                                    $scope.proList[i].checked = false;
                                    allds = false;
                                }
                            }
                        }, {
                            text: '<b>确认</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                getproDel(goods_id);
                            }
                        }]
                    });
                } else {
                    $ionicPopup.alert({
                        title: '温馨提示',
                        content: '请选择需要删除的商品!'
                    });
                }

            }

        };

        //批量删除
        function getproDel(id) {
            Loading.show('正在删除中');
            Goods.getproremove({
                good_id: id,
                page: $scope.pages,
                limit: $scope.limits
            }).$promise.then(function(response) {
                if (response.error == 0) {
                    Loading.hide();
                    //滑动单个删除
                    for (var i = 0; i < $scope.proList.length; i++) {
                        if ($scope.proList[i].goods_id == id) {
                            $scope.proList.splice(i, 1);
                            break;
                        }
                    }
                    //全选不规则删除
                    for (var i = $scope.proList.length - 1; i >= 0; i--) {

                        if ($scope.proList[i].checked === true) {
                            $scope.proList.splice(i, 1);
                        };
                    };
                    pageData(response);
                    $ionicPopup.alert({
                        title: '删除成功！',
                        okText: "确定"
                    });
                    $scope.select_alled = false;
                    $scope.shouldShowDelete = false;
                    if ($scope.proList.length == 0) {
                        $scope.proList_length = false;
                        $scope.moreDatared = true;
                    }

                } else {
                    Loading.hide();
                    $ionicPopup.alert({
                        title: '删除失败！',
                        okText: "确定"
                    });
                }
            })
        };

    }
])
