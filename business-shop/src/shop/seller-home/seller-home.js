angular.module("App.Shop.SellerHome", []).controller("App.Shop.SellerHome.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Loading",
    "Shop",
    "Goods",
    "$ionicPopup",
    "dyLocation",
    "$http",
    function(
        $scope,
        $state,
        $ionicHistory,
        Loading,
        Shop,
        Goods,
        $ionicPopup,
        dyLocation,
        $http
    ) {
        //loading页面加载
        Loading.show();
        var id = $state.params.id;
        $scope.page = 1;
        $scope.limit = 10;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;

        $scope.goAlbum = function() {
            $state.go("shop.album", {
                id: id
            });
        }

        //上拉加载
        $scope.dataset = [];
        $scope.loadMore = function(type) {

            Goods.getGoodslist({
                page: $scope.page,
                limit: $scope.limit,
                shop_id: id
            }).$promise.then(function(order) {
                $scope.AllPage = Math.ceil(order.total / $scope.limit);

                if ($scope.page === 1) {
                    Loading.hide();
                }
                angular.forEach(order.list, function(order) {
                    $scope.dataset.push(order);
                })

                if (type == "doRefresh") {
                    $scope.moreDataCanBeLoaded = true;
                    $scope.$broadcast('scroll.refreshComplete');
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }

                if ($scope.page === $scope.AllPage) {
                    $scope.isShow = true;
                    $scope.moreDataCanBeLoaded = false;
                }
                //如果没有数据
                if (order.list.length === 0) {
                    $scope.noData = true;
                    $scope.moreDataCanBeLoaded = false;
                }

                $scope.page = $scope.page + 1;

            }, function(error) {

            });
        }


        //下拉刷新
        $scope.doRefresh = function() {
            $scope.dataset = [];
            $scope.page = 1;
            $scope.loadMore("doRefresh");
        }

        // $scope.doRefresh();
        //如果数据为空刷新页面
        /*if($scope.dataset.length === 0)
        {
            $scope.doRefresh();
        }*/

        //返回按钮
        $scope.back = function() {
            $ionicHistory.goBack();
        }

        //加入店铺收藏
        $scope.fav = function(id, is_fav) {
                if (is_fav == 1) {
                    Shop.collectDelete({
                        shop_id: id
                    }).$promise.then(function(response) {
                        // $ionicPopup.alert({
                        //     title: "取消收藏成功！",
                        //     okText: "确定"
                        // }).then(function() {
                        //     $scope.is_fav = false;
                        // });
                        $scope.is_fav = false;
                    }, function(response) {
                        $ionicPopup.alert({
                            title: "<span class='assertive'>取消收藏失败</span>",
                            okText: "确定",
                            template: response.data.message
                        })
                    });
                } else {
                    Shop.collectAdd({
                        shop_id: id
                    }).$promise.then(function(info) {
                        Loading.hide();
                        // $ionicPopup.alert({
                        //     title: '店铺收藏成功',
                        //     okText: "确定"
                        // }).then(function() {
                        //     $scope.is_fav = true;
                        // });
                        $scope.is_fav = true;
                    }, function(error) {
                        $ionicPopup.alert({
                            title: '收藏失败',
                            okText: "确定",
                            template: error.data.message
                        });
                        Loading.hide();
                    });
                }
            }
            //获取店铺信息
        Shop.getShopinfo({
            shop_id: id
        }).$promise.then(function(info) {
            $scope.info = info;
            $scope.is_fav = info.is_fav == 1 ? true : false;
            $http.get('http://wap.cellmyth.cn/city.data-3.json').success(function(data) {
                var addreText = getAddress(data, info.area_id);
                $scope.info.arealocal = addreText.join('') + info.address;
            }).error(function(data) {});
            Loading.hide();
        }, function(error) {
            Loading.hide();
        });
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

        //获取经纬度
        var getLocation = function() {
            $scope.distance = true;
            $scope.distance_error = "距离获取中...";
            dyLocation.get().then(function(data) {
                showPosition(data);
            }, function(error) {
                $scope.distance_error = "无法获取距离信息";
                console.log(error);
            });

        }
        var showPosition = function(position) {
            Shop.infoLocal({
                shop_id: id,
                lng: position[0],
                lat: position[1]
            }).$promise.then(function(data) {
                $scope.address = data;
                $scope.distance = false;
                Loading.hide();
            }, function(error) {
                Loading.hide();
            });
            //console.log('纬度:' + position.coords.latitude + ',' + '经度:' + position.coords.longitude);
        }

        getLocation();
    }
]);
