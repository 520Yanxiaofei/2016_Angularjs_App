angular.module("App.User.Info", []).controller("App.User.Info.Controller", [
    "$scope",
    "$state",
    "Member",
    "$http",
    function(
        $scope,
        $state,
        Member,
        $http
    ) {

        //入驻状态
        $scope.status='-1';
        //入驻状态字典
        $scope.applyEmum={
            '-1': {
                title: '未入驻',
                state: 'user.merchant-notes'
            },
            '0': {
                title: '未支付',
                state: 'user.join-infor'
            },
            '1': {
                title: '已通过',
                state: 'user.information-check'
            },
            '2': {
                title: '未通过',
                state: 'user.information-check'
            },
            '3': {
                title: '已拒绝',
                state: 'user.information-check'
            },
            '4': {
                title: '入驻失败',
                state: 'user.information-check'
            },
            '5': {
                title: '待审核',
                state: 'user.information-check'
            },
            '6': {
                title: '退款成功',
                state: 'user.merchant-notes'
            }
        };

        //根据入驻状态跳转到入驻信息页
        $scope.gotoApplyPage=function gotoApplyPage(status){
            if ($scope.applyEmum[status]!==undefined){
                $state.go($scope.applyEmum[status].state);
            }
        };

        Member.getMemberInfo().$promise.then(function(member_info){
            $scope.member_info = member_info;
            //$scope.member_info.level=47;
        },function(error){
            console.log(error)
        });

        Member.getMemberAmountInfo().$promise.then(function(member_amount_info){
            $scope.member_amount_info = member_amount_info
        },function(error){
            console.log(error)
        });

        $scope.check_aptitude= {}
        Member.checkAptitude().$promise.then(function(check_aptitude) {
            $scope.check_aptitude = check_aptitude
        },function(error){
            $scope.check_aptitude.code = 0
        });
        $scope.sub = {}
        Member.checkSub().$promise.then(function (data) {
            $scope.sub = data
        }, function (error) {
            $scope.sub.sub = 0
        });
        Member.getMemberApplyStatus().$promise.then(function(member_apply_status){
            //$scope.status = member_apply_status.apply.status ? member_apply_status.apply.status : -1;
            switch(Number(member_apply_status.apply.status)){
                case 0:
                    if( member_apply_status.apply.pay_status == 0 ){
                        $scope.status = 0;
                    }else {
                        $scope.status = 5;
                    }
                    console.log(0);
                    break;
                case 1:
                    $scope.status = 1;
                    console.log(1);
                    break;
                case 2:
                    $scope.status = 2;
                    console.log(2);
                    break;
                case 3:
                    $scope.status = 3;
                    console.log(3);
                    break;
                case 4:
                    $scope.status = 4;
                    console.log(44);
                    break;
                case 5:
                    // if( member_apply_status.apply.pay_status == 0 ){
                    //     $scope.status = 5;
                    // }else {
                    //     $scope.status = 1;
                    // }
                    $scope.status = 5;
                    console.log(5);
                    break;
                case 6:
                    $scope.status = 6;
                    console.log(6);
                    break;
                default:
                    $scope.status = -1;
                    console.log(-1);
            };
            console.log(member_apply_status);
        },function(error){
            $scope.status='-1';
        });


        $scope.loginOut=function(){
            window.location.href = 'dyw://logout';
        };

        //获取等级判断
        $scope.showLevel=function(level){
            var star = 0,
                moon = 0,
                sun = 0;
            sun = Math.floor(level / 16);
            moon = Math.floor(level % 16 / 4);
            star = Math.floor(level % 4);

            var sunArr = sun > 0 ? new Array(sun) : null,
            moonArr = moon > 0 ? new Array(moon) : null,
            starArr = star > 0 ? new Array(star) : null;

            return [sunArr, moonArr, starArr];
        }

        //判断是否在微信环境
        /*function isWechat(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else{
                return false;
            }
        };
        $scope.isWechat=isWechat();*/




        //var str = '{"app_name":"daiyanjie"}';
        //document.cookie  = 'app_common=' +str;

        //判断是否在daiyanjie环境
        function getCookie(app_common) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split("; ");
            for(var i = 0; i < arrCookie.length; i++){
                var arr = arrCookie[i].split("=");
                if(app_common == arr[0]){
                    return arr[1];
                }
            }
            return "";
        }

        var ios_appcommon = window.DYW_AUTHENTICATION;
        var android_appcommon = getCookie("app_common");
        if(ios_appcommon == "" && android_appcommon == "")
        {
            return false;
        }

        var obj = '';
        if(ios_appcommon){
            obj = {app_name : 'daiyanjie'};
        }else if(android_appcommon){
            obj = JSON.parse(android_appcommon);
        }else{
            return
        }

        function daiyanjie(){
            if(obj.app_name=='daiyanjie')
            {
                return true;
            }else{
                return false;
            }
        }
        $scope.daiyanjie=daiyanjie();
    }
]);
