angular.module("App.User.MyData", []).controller("App.User.MyData.Controller", [
    "$scope",
    "$state",
    "$ionicPopup",
    "Member",
    "Spokes",
    "Dealer",
    function(
        $scope,
        $state,
        $ionicPopup,
        Member,
        Spokes,
        Dealer
    ) {

        //表单显示状态
        $scope.status = {
            is_bus: false, //是否是代言商以上身份
            is_info: false, //资料是否完整
            vertify_txt: "获取验证码",
            is_edit: true,
            vertify_flag: true
        }

        //表单提交字段
        $scope.form = {
            username: "",
            mobile: "",
            area_id: "000000",
            share_uid: "",
            vertify_code: ""
        }


        //分享人信息
        $scope.share = {
            img_url: "http://img.520dyw.cn/default/avatar.jpg",
            share_mum: "",
            share_name: ""
        }

        //推荐人信息
        $scope.referee = {
            img_url: "http://img.520dyw.cn/default/avatar.jpg",
            share_mum: "",
            share_name: ""
        }

        //节点人信息
        $scope.node = {
            img_url: "http://img.520dyw.cn/default/avatar.jpg",
            share_mum: "",
            share_name: ""
        }


        //获取完善资料的类型（代言人资料，代言商资料）
        Member.checkAptitude().$promise.then(function(check_aptitude) {
            $scope.check_aptitude = check_aptitude
            if(check_aptitude.code == "1"){//完善代言人资料
                $scope.form = {
                    username: check_aptitude.ext_data.realname,
                    mobile: check_aptitude.ext_data.mobile,
                    area_id: check_aptitude.ext_data.refund_area || "000000",
                    share_uid: check_aptitude.ext_data.share_uid
                }
                $scope.share = {
                    img_url: check_aptitude.ext_data.share_avatar,
                    share_mum: check_aptitude.ext_data.share_number,
                    share_name: check_aptitude.ext_data.share_name
                }
            }else if(check_aptitude.code == "2"){//完善代言人资料
                $scope.form = {
                    username: check_aptitude.ext_data.realname,
                    mobile: check_aptitude.ext_data.mobile,
                    area_id: check_aptitude.ext_data.refund_area || "000000",
                    share_uid: check_aptitude.ext_data.share_uid
                }
                $scope.share = {
                    img_url: check_aptitude.ext_data.share_avatar,
                    share_mum: check_aptitude.ext_data.share_number,
                    share_name: check_aptitude.ext_data.share_name
                }
                $scope.status.is_bus = true;
                $scope.form.recommend_uid = '';
                $scope.form.node_uid = '';
            }else if(check_aptitude.code == "3"){//代言人资料已经完善
                $scope.status.is_edit = false;
                $scope.status.is_info = true;
                Spokes.getSpokesinfo().$promise.then(function(res) {
                    $scope.form = {
                        username: res.realname,
                        mobile: res.mobile,
                        area_id: res.area_id,
                        share_uid: res.share_uid
                    }
                    //分享人   
                    $scope.share = {
                        img_url: res.share_avatar,
                        share_mum: res.share_number,
                        share_name: res.share_name
                    }

                }, function(error) {
                    console.log('代言人失败')
                });
            }else{//代言商资料已经完善
                $scope.status.is_edit = false;
                $scope.status.is_info = true;
                $scope.status.is_bus = true;
                $scope.form.recommend_uid = '';
                $scope.form.node_uid = '';
                Dealer.getDealerinfo().$promise.then(function(res) {
                    $scope.form = {
                        username: res.realname,
                        mobile: res.mobile,
                        area_id: res.area_id,
                        share_uid: res.share_uid,
                        recommend_uid: res.recommend_uid,
                        node_uid: res.node_uid
                    }
                    //分享人   
                    $scope.share = {
                        img_url: res.share_avatar,
                        share_mum: res.share_number,
                        share_name: res.share_name
                    }
                    //推荐人信息
                    $scope.referee = {
                        img_url: res.recommend_avatar,
                        share_mum: res.recommend_number,
                        share_name: res.recommend_name
                    }

                    //节点人信息
                    $scope.node = {
                        img_url: res.node_avatar,
                        share_mum: res.node_number,
                        share_name: res.node_name,
                    }
                }, function(error) {
                    console.log('代言商失败')
                });
            }
        }, function(error) {
            $ionicPopup.alert({
                title: error.data.message,
                okText: "确定"
            });
            $state.go("user.info")
        });          


        //获取手机验证码
        $scope.getVertifyCode = function() {
            if ($scope.form.mobile == "") {
                $ionicPopup.alert({
                    title: '请输入手机号码',
                    okText: "确定"
                });

                return false;
            }else{
                Spokes.sendSms({
                    mobile: $scope.form.mobile
                }).$promise.then(function(check_status) {
                    $scope.status.is_info = (check_status.status == "1") ? true : false;
                    console.log($scope.form.mobile)
                }, function(error) {
                    console.log(error)
                });

                return true;
            }

        }

        //更改分享人
        $scope.changePeople = function(people_type) {
            $scope.myform = {
                people_num: ""
            };

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="myform.people_num">',
                title: '请输入代言号',
                scope: $scope,
                buttons: [{
                    text: '取消'
                }, {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.myform.people_num) {
                            //don't allow the user to close unless he enters wifi password
                            $ionicPopup.alert({
                                title: '代言号不能为空',
                                okText: "确定"
                            });
                            e.preventDefault();
                        } else {
                            return $scope.myform.people_num;
                        }
                    }
                }]
            });

            myPopup.then(function(share_mum) {
                if(!share_mum){
                    return
                }
                Spokes.getSpokesinfo({
                    number: share_mum,
                    number_type: 2
                }).$promise.then(function(res) {
                    if (people_type == 1) { //分享人
                        $scope.share.share_mum = share_mum
                        $scope.share.share_name = res.realname
                        $scope.share.img_url = res.avatar
                        $scope.form.share_uid = res.uid
                        console.log($scope.form.share_uid)
                    } else if (people_type == 2) { //推荐人
                        $scope.referee.share_mum = share_mum
                        $scope.referee.share_name = res.realname
                        $scope.referee.img_url = res.avatar
                        $scope.form.recommend_uid = res.uid
                    } else { //节点人
                        $scope.node.share_mum = share_mum
                        $scope.node.share_name = res.realname
                        $scope.node.img_url = res.avatar
                        $scope.form.node_uid = res.uid
                    }

                }, function(error) {
                    $ionicPopup.alert({
                        title: error.data.message,
                        okText: "确定"
                    });
                });
            });
        }

        //提交表单
        $scope.submit = function() {
            if ($scope.check_aptitude.code == "1") { //代言人
                Spokes.submit($scope.form).$promise.then(function(res) {
                    $ionicPopup.alert({
                        title: "代言人资料提交成功",
                        okText: "确定"
                    });
                    $state.go("user.info");
                }, function(error) {
                    $ionicPopup.alert({
                        title: error.data.message,
                        okText: "确定"
                    });
                });
            } else { //代言商以上
                Dealer.submit($scope.form).$promise.then(function(res) {
                    $ionicPopup.alert({
                        title: "代言商资料提交成功",
                        okText: "确定"
                    });
                    $state.go("user.info");
                }, function(error) {
                    $ionicPopup.alert({
                        title: error.data.message,
                        okText: "确定"
                    });
                });
            }
        }

    }
]).directive('timerbutton', [
    "$timeout",
    "$interval",
    function($timeout, $interval){
    return {
        restrict: 'AE',
        scope: {
            showTimer: '=',
            timeout: '=',
            event: '='
        },
        link: function(scope, element, attrs){
            scope.timer = false;
            scope.timeout = 60000;
            scope.timerCount = scope.timeout / 1000;
            scope.text = "获取验证码";

            scope.onClick = function(){
                if(!scope.event()){
                    return
                }
                scope.showTimer = true;
                scope.timer = true;
                scope.text = "秒后重新获取";
                var counter = $interval(function(){
                    scope.timerCount = scope.timerCount - 1;
                }, 1000);

                $timeout(function(){
                    scope.text = "获取验证码";
                    scope.timer = false;
                    $interval.cancel(counter);
                    scope.showTimer = false;
                    scope.timerCount = scope.timeout / 1000;
                }, scope.timeout);
            }
        },
        template: '<button on-tap="onClick()" class="button button-small button-assertive btn-bottom" ng-disabled="timer"><span ng-if="showTimer">{{ timerCount }}</span>{{text}}</button>'
    };
}]);
