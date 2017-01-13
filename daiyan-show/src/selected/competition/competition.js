angular.module("App.Selected.Competition", []).controller("App.Selected.Competition.Controller", [
    "$scope",
    "$state",
    "$ionicScrollDelegate",
    "Overview",
    "Ordinary",
    "User",
    "Mine",
    "Vote",
    "$ionicModal",
    "$ionicPopup",
    "Loading",
    "$window",
    "Setting",
    function(
        $scope,
        $state,
        $ionicScrollDelegate,
        Overview,
        Ordinary,
        User,
        Mine,
        Vote,
        $ionicModal,
        $ionicPopup,
        Loading,
        $window,
        Setting
    ) {

        //微信分享标题
        var share_name = ''
        //微信分享描述
        var summary = ''
        //微信分享图片
        var share_img = ''

        $scope.has_header = ($state.params.type == "app");

        $scope.close = function(){
            $scope.has_header = false
        }

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            event.preventDefault();

            if (toState.name == "selected.detail" || toState.name == "commonweal.detail" || toState.name == "selected.competition" || toState.name == "commonweal.competition") {

                Setting.wxconfigParam().$promise.then(function(response) {

                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: response.appId, // 必填，公众号的唯一标识
                        timestamp: response.timestamp, // 必填，生成签名的时间戳
                        nonceStr: response.nonceStr, // 必填，生成签名的随机串
                        signature: response.signature, // 必填，签名，见附录1
                        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });

                    // 获取选秀信息
                    Overview.getrankUser({
                        sid: $state.params.id, //用户ID
                        id: $state.params.ids //活动ID
                    }).$promise.then(function(response) {
                        share_name = response.name
                        summary = response.slogan
                        share_img = response.avatar

                        wx.ready(function() {

                            //分享到微信朋友圈
                            wx.onMenuShareTimeline({
                                title: "我是" + share_name + "，我为自己代言", // 分享标题
                                desc: "我是" + share_name + "，我为自己代言", // 分享描述
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
                                title: "我是" + share_name + "，我为自己代言", // 分享标题
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



        Loading.show();
        // 回到顶部
        $scope.goTop = function() {
            $ionicScrollDelegate.scrollTop(true);
        }

        console.log($state.params);

        //初始化
        function rankloading() {
            $scope.ids = $state.params.ids;
            Overview.getrankUser({
                sid: $state.params.id, //用户ID
                id: $state.params.ids //活动ID
            }).$promise.then(function(data) {
                $scope.is_vote = true
                if(data.role == '1'){
                    $scope.is_vote = false
                }
                Loading.hide();
                //个人参赛信息
                $scope.rankUser = data;
                //是否已投票
                if (data.is_free_vote == 0) {
                    $scope.rankUserok = false;
                    $scope.rankUserIs = true;
                } else {
                    $scope.rankUserok = true;
                    $scope.rankUserIs = false;
                }
                //获取代言身份限制判断
                function userroles(status) {
                    User.getUser().$promise.then(function(user) {
                        Loading.hide();
                        if (status == 1) {
                            $scope.Addsele = function() {
                                $ionicPopup.alert({
                                    title: '温馨提示',
                                    template: '<div style="text-align:center">活动选秀未开始，暂时不能投票！</div>',
                                });
                            }
                        } else if (status == 2) {
                            userstaus(user);
                        } else {
                            $scope.Addsele = function() {
                                $ionicPopup.alert({
                                    title: '温馨提示',
                                    template: '<div style="text-align:center">活动选秀已结束！</div>',
                                });
                            }
                        }

                    }, function(error) {
                        console.log(error)
                    })

                }

                //身份判断限制
                function userstaus(user) {
                    // if (user.role == 2 || user.role == 3 || user.role == 4) {
                        //是否加入,1:代言粉,2:代言人,3:代言商,4:代言店
                        Mine.getrankLimit({
                            showId: $state.params.ids //活动ID
                        }).$promise.then(function(adds) {
                            Loading.hide();
                            if (data.isParticipated == 0) {
                                $scope.Addsele = function() {

                                    selectedadd()
                                }

                                function selectedadd() {
                                    $state.go("selected.add", {
                                        id: $state.params.ids
                                    })
                                }
                            } else {
                                $scope.Addsele = function() {
                                    $ionicPopup.alert({
                                        title: '温馨提示',
                                        template: '<div style="text-align:center">你已经加入了，无需申请！</div>',
                                    });
                                }
                            }
                        }, function(error) {
                            console.log(error)
                        })
                    // } else {
                    //     $scope.Addsele = function() {
                    //         $ionicPopup.confirm({
                    //             title: '温馨提示',
                    //             template: '<div style="text-align:center">代言人才能参加选秀活动，立即成为代言人？</div>',
                    //             cancelText: "取消",
                    //             okText: "确定"
                    //         }).then(function(response) {
                    //             if (response) {
                    //                 $window.open("http://m.cellmyth.cn/wechat/spokes/explain", "_blank", "location=no,status=no")
                    //             } else {

                    //             }

                    //         });
                    //     }
                    // }
                }

                //活动详情
                Ordinary.getShowInfo({
                    id: $state.params.ids //活动ID
                }).$promise.then(function(data) {
                    Loading.hide();
                    $scope.rankInfo = data;
                    userroles(data.status);
                    if (data.status == 1) {
                        $scope.Slectshow = function() {
                            $ionicPopup.alert({
                                title: '温馨提示',
                                template: '<div style="text-align:center">活动选秀未开始，暂时不能投票！</div>',
                            });
                        }
                    } else if (data.status == 2) {
                        $scope.Slectshow = function() {
                            $scope.modal.show();
                        }
                    } else {
                        $scope.Slectshow = function() {
                            $ionicPopup.alert({
                                title: '温馨提示',
                                template: '<div style="text-align:center">活动选秀已结束！</div>',
                            });
                        }
                    }
                }, function(error) {
                    console.log(error)
                });
                //支持人数
                Overview.getrankSupporter({
                    sid: $state.params.id, //用户ID
                    id: $state.params.ids //活动ID
                }).$promise.then(function(data) {
                    Loading.hide();
                    $scope.rankSup = data.avatarList;
                }, function(error) {
                    console.log(error)
                });
            }, function(error) {
                console.log(error)
            });


            //助力
            $scope.rankUserIs = true, $scope.rankUserok = true;
            $ionicModal.fromTemplateUrl('my-modal.html', {
                scope: $scope,
                animation: 'slide-in-up ion-nifty-modal'
            }).then(function(modal) {
                $scope.modal = modal;
            });
            $scope.touBtns = function() {
                if ($scope.rankUser.is_free_vote == 0) {
                    Vote.getrankFree({
                        nid: $state.params.id, //被投票人标识
                        show_id: $state.params.ids //活动标识
                    }).$promise.then(function(data) {
                        Loading.hide();
                        if (data.vote == 1) {
                            $ionicPopup.alert({
                                title: '温馨提示',
                                template: '<div style="text-align:center">投票成功！</div>',
                                okText: '确定',
                                okType: 'button-positive'
                            });
                            rankloading();
                            listdatas();
                            $scope.rankUserok = true;
                            $scope.rankUserIs = false;
                            $scope.modal.hide();
                        }
                    }, function(error) {
                        console.log(error)
                    })
                }
            }

            //微信支付
            $scope.weixinPay = function() {
                var params = null;
                if (typeof WeixinJSBridge === "undefined") {
                    $ionicPopup.alert({
                        title: "错误",
                        template: "请在微信中访问该页面"
                    });
                    return false;
                };
                Loading.show('请求支付');
                Vote.getcharpay({
                    nid: $state.params.id, //被投票人标识
                    show_id: $state.params.ids, //活动标识
                    money: 1, //金额
                    vote: 9, //票数
                    pay_type: 3 //支付方式(1:余额,2:转账,3:微信,4:支付宝)
                }).$promise.then(function(data) {
                    params = data.parameters;

                    if (!angular.isObject(params)) {
                        params = angular.fromJson(params);
                    }
                    Loading.hide();
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        params,
                        function(res) {
                            WeixinJSBridge.log(res.err_msg);
                            console.log(res.err_code, res.err_msg)
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                $scope.modal.hide();
                                $ionicPopup.confirm({
                                    title: '投票成功！',
                                    cancelText:'继续投票',
                                    cancelType: 'button-positive',
                                    okText: '前往摇奖',
                                    okType: 'button-positive'
                                }).then(function(e){
                                    if (e) {
                                        window.location.href = 'http://m.cellmyth.cn/wechat/ernie/shake/';
                                    }
                                });
                            } else {
                                $ionicPopup.alert({
                                    title: "错误",
                                    template: "支付失败！"
                                });
                                $scope.modal.hide();
                            }
                        }
                    );
                }, function(response) {
                    Loading.hide();
                    $ionicPopup.alert({
                        title: "错误",
                        template: response.message || "服务器错误！"
                    });
                });

            };
        }
        rankloading();


        //投票记录
        //初始化数据6条
        $scope.page = 1;
        $scope.limit = 20;
        $scope.AllPage = 0;
        $scope.moreData = true; //启用刷新
        $scope.moreDataed = true; //更多数据
        $scope.recordData = false;
        $scope.recordList = [];

        //重新调用
        function listdatas() {
            Loading.show();
            Overview.getrankRecord({
                sid: $state.params.id, //用户ID
                id: $state.params.ids, //活动ID
                page: 1,
                limit: 20
            }).$promise.then(function(response) {
                Loading.hide();
                $scope.recordList = response.voteList;
                $scope.recordData = false;
                $scope.moreDataed = false;
            }, function(error) {
                console.log(error)
            });

        }

        //上拉加载
        $scope.loadMorese = function() {
            Overview.getrankRecord({
                sid: $state.params.id, //用户ID
                id: $state.params.ids, //活动ID
                page: $scope.page,
                limit: $scope.limit
            }).$promise.then(function(response) {

                pagelist(response);
            }, function(error) {
                console.log(error)
            });
        };


        // //下拉刷新
        $scope.doRefreshse = function() {
            Overview.getrankRecord({
                sid: $state.params.id, //用户ID
                id: $state.params.ids, //活动ID
                page: $scope.page,
                limit: $scope.limit
            }).$promise.then(function(response) {
                pagelist(response);
            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        function pagelist(response) {
            $scope.Allpage = response.voteList.length;
            if ($scope.page === 1) {
                //Loading.hide();
                $scope.moreData = true;
            };
            angular.forEach(response.voteList, function(response) {
                $scope.recordList.push(response);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if ($scope.limit > $scope.Allpage) {
                $scope.moreData = false;
                $scope.moreDataed = false;
            }
            if ($scope.Allpage == 0) {
                $scope.recordData = false;
                $scope.moreDataed = false;
            }
            $scope.page = $scope.page + 1;
        };
    }
])