angular.module('App.Commonweal.Detail', []).controller('Commonweal.Detail.Controller', [
    "$scope",
    "$state",
    "$ionicScrollDelegate",
    "$ionicPopup",
    "Ordinary",
    "$timeout",
    "Setting",
    "Loading",
    function(
        $scope,
        $state,
        $ionicScrollDelegate,
        $ionicPopup,
        Ordinary,
        $timeout,
        Setting,
        Loading
    ) {
        Loading.show();
        //微信分享标题
        var share_name = ''
        //微信分享描述
        var summary = ''
        //微信分享图片
        var share_img = ''

        $scope.show_id = $state.params.id;

        $scope.has_header = ($state.params.type == "app");

        $scope.close = function(){
            $scope.has_header = false
        }

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            event.preventDefault();
            if (toState.name == "selected.detail" || toState.name == "commonweal.detail" || toState.name == "selected.competition" || toState.name == "commonweal.competition") {
                Setting.wxconfigParam().$promise.then(function(response) {
                    console.log(response.appId)
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: response.appId, // 必填，公众号的唯一标识
                        timestamp: response.timestamp, // 必填，生成签名的时间戳
                        nonceStr: response.nonceStr, // 必填，生成签名的随机串
                        signature: response.signature, // 必填，签名，见附录1
                        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });

                    // 获取选秀信息
                    Ordinary.getShowInfo({
                        id: $scope.show_id
                    }).$promise.then(function(response) {
                        Loading.hide();
                        $scope.showInfo = response;
                        share_name = response.name
                        summary = response.summary
                        share_img = response.img
                        
                        wx.ready(function() {

                            //分享到微信朋友圈
                            wx.onMenuShareTimeline({
                                title: share_name, // 分享标题
                                desc: share_name, // 分享描述
                                imgUrl: share_img, // 分享图标
                                success: function(response) {
                                    // 用户确认分享后执行的回调函数
                                    console.log(response);
                                },
                                cancel: function(response) {
                                    // 用户取消分享后执行的回调函数
                                    console.log(response);
                                }
                            });

                            //分享到微信朋友
                            wx.onMenuShareAppMessage({
                                title: share_name, // 分享标题
                                desc: summary, // 分享描述
                                imgUrl: share_img, // 分享图标
                                success: function(response) {
                                    // 用户确认分享后执行的回调函数
                                    console.log(response);
                                },
                                cancel: function(response) {
                                    // 用户取消分享后执行的回调函数
                                    console.log(response);
                                }
                            });

                        });

                        wx.error(function(res) {
                            //alert(res.errMsg)

                        });

                    }, function(response) {
                        console.log(response);
                    })
                }, function(response) {
                    console.log(response);
                })



            }
        })



        $scope.is_show_layer = false;
        // 回到顶部
        $scope.goTop = function() {
            $ionicScrollDelegate.scrollTop(true);
        }

        // 助力
        $scope.showLayer = function() {
            $scope.is_show_layer = true;
        }
        $scope.hideLayer = function() {
            $scope.is_show_layer = false;
        }

        $scope.showQrcode = function() {
            $scope.is_show_qrcode = true;
        }
        $scope.hideQrcode = function() {
            $scope.is_show_qrcode = false;
        }

        // 跳转加入选秀
        $scope.goAddShow = function() {
            $state.go("selected.add", {
                id: $state.params.id
            });
        }

        //跳转管理界面
        $scope.goManage = function() {
            $state.go("manage.home", {
                id: $state.params.id
            });
        }

        //退出选秀
        $scope.quitShow = function() {
            $scope.data = {};

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.verify">',
                title: '确定退出选秀',
                subTitle: '请填写退出理由',
                scope: $scope,
                buttons: [{
                    text: '取消'
                }, {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.verify) {
                            $ionicPopup.alert({
                                title: '错误',
                                okText: '确定',
                                template: '请填写退出理由'
                            });
                            e.preventDefault();
                        } else {
                            return $scope.data.verify;
                        }
                    }
                }]
            });

            myPopup.then(function(res) {
                if (res) {
                    Member.quitApply({
                        showId: $scope.show_id,
                        verify: res
                    }).$promise.then(function(response) {
                        $ionicPopup.alert({
                            title: '确定',
                            okText: '确定',
                            template: '发起退出选秀申请成功，请等待审核！'
                        });
                    }, function(response) {
                        $ionicPopup.alert({
                            title: '确定',
                            okText: '确定',
                            template: response.data.message || "服务器端错误"
                        });
                    })
                }

            });
        }

        // 获取活动二维码
        Ordinary.getShowCode({
            id: $scope.show_id
        }).$promise.then(function(response) {
            $scope.show_code = response.url;
            // console.log(response);
        }, function(response) {
            console.log(response);
        })

        // 获取选秀成员
        Ordinary.getShowUserList({
            id: $scope.show_id,
            page: 1,
            limit: 6
        }).$promise.then(function(response) {
            $scope.person_list = response.peopleList;
            // console.log(response.peopleList);
        }, function(response) {
            console.log(response);
        });
    }
]);