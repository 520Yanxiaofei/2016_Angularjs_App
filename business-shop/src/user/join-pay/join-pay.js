angular.module("App.User.JoinPay", []).controller("App.User.JoinPay.Controller", [
    "$scope",
    "$state",
    "Member",
    "Loading",
    "$http",
    "$ionicPopup",
    function(
        $scope,
        $state,
        Member,
        Loading,
        $http,
        $ionicPopup
    ) {
       
        $scope.isActive = 1;
        $scope.store = null;
        $scope.balance = 0;
        $scope.isChoose = function(index){
            $scope.isActive = index;
        }

        // 支付宝支付
        function aliPay(){
            Loading.show('请求支付');
            $http.post(config.API_ROOT+'/mall/member/alipay',{
                show_url: "http://mall.cellmyth.cn/user/join-pay",//临时地址
                return_url: "http://mall.cellmyth.cn/user/join-pay"
            }).success(function(data){
                var form;
                if (data.error){
                    Loading.hide();
                    $ionicPopup.alert({
                        title: "错误",
                        template: data.message || "服务器错误！"
                    });
                    return false;
                };
                form=angular.element(data)[0];
                if (form.submit){
                    form.submit();
                }else{
                    Loading.hide();
                    $ionicPopup.alert({
                        title: "错误",
                        template: data.message || "服务器错误！"
                    });
                }
            }).error(function(data){
                Loading.hide();
                $ionicPopup.alert({
                    title: "错误",
                    template: data.message || "服务器错误！"
                });
            });
        }

        // 获取余额
        Member.getMemberAmountInfo().$promise.then(function(response){
            // console.log(response);
            $scope.balance = response.money;
        },function(error){
            console.log(error);
        });

        // 获取
        Member.getMemberApplyStatus().$promise.then(function(response){
            console.log(response);
            $scope.store = response.apply.title;
            // 确认支付
            $scope.pay = function(type){
                if( type == 1 ){
                    $state.go('user.balance-pay', {
                        store_id: response.apply.id
                    });
                }else {
                    aliPay();
                }
            }
        });

    }
]);