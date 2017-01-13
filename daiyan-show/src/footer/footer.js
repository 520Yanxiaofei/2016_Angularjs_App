angular.module("App.Footer", []).controller("App.Footer.Controller", [
    "$scope",
    "$state",
    "Setting",
    function(
        $scope,
        $state,
        Setting
    ) {
        // 设置微信title
        // var update_wx_title = function(title) {
        //     // var body = document.getElementsByTagName('body')[0];
        //     document.title = title;
        //     // var iframe = document.createElement("iframe");
        //     // iframe.setAttribute("src", "/favicon.ico");
        //     // var handle = function() {
        //     //     setTimeout(function() {
        //     //         iframe.removeEventListener('load', handle, false);
        //     //         document.body.removeChild(iframe);
        //     //     }, 0);
        //     // }
        //     // iframe.addEventListener('load', handle, false);
        //     // document.body.appendChild(iframe);
        // }        
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            // debugger;
            console.log(toState.name);
            event.preventDefault();
            switch (toState.name) {
                case "show":
                    $scope.tab = 'home';
                    break;
                default:
                    $scope.tab = 'none';
                    break;
            }


            if (toState.name != "selected.detail" && toState.name != "commonweal.detail" && toState.name != "selected.competition" && toState.name != "commonweal.competition") {
                Setting.wxconfigParam().$promise.then(function(response) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: response.appId, // 必填，公众号的唯一标识
                        timestamp: response.timestamp, // 必填，生成签名的时间戳
                        nonceStr: response.nonceStr, // 必填，生成签名的随机串
                        signature: response.signature, // 必填，签名，见附录1
                        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });

                    wx.ready(function() {

                        //分享到微信朋友圈
                        wx.onMenuShareTimeline({
                            title: "代言秀", // 分享标题
                            desc: "代言秀，我为自己代言", // 分享描述
                            imgUrl: "http://static.520dyw.cn/wechat/style/img/wx_logo.png", // 分享图标
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
                            title: "代言秀", // 分享标题
                            desc: "代言秀，我为自己代言", // 分享描述
                            imgUrl: "http://static.520dyw.cn/wechat/style/img/wx_logo.png", // 分享图标
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
            }

        })
    }
]);