angular.module("App.User.AnotherBalancePay", []).controller("App.User.AnotherBalancePay.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Loading",
    "Order",
    "$ionicPopup",
    "Loading",
    "Member",
    "Helpbuy",
    function(
        $scope,
        $state,
        $ionicHistory,
        Loading,
        Order,
        $ionicPopup,
        Loading,
        Member,
        Helpbuy
    ) {
        $scope.num1 = '';
        $scope.nums = {
            num1: '',
            num2: '',
            num3: '',
            num4: '',
            num5: '',
            num6: ''
        }

        var index = 0;
        // 返回
        $scope.back = function() {
            $ionicHistory.goBack();
        }

        //商品类型
        var goods_type = "0"

        //检查订单是否支付
        //Loading.show();
        var id = $state.params.order_id;
        if( $state.params.order_id ){
            Helpbuy.getHelpInfo({ id: id }).$promise.then(function(response) {
                Loading.hide();
                
            }, function(response) {
                $ionicPopup.alert({
                    title: '订单已支付',
                    okText: "确定"
                }).then(function(){
                    $state.go("user.info");
                })
                Loading.hide();
            });
        }else {
            $scope.store_id = $state.params.store_id;
            Loading.hide();
            console.log($state.params.type);
        }

        $scope.keydown = function(number){
            
            if(index<6 && number != 'back')
            {
                index++;
            }

            if(index==1)    
            {
                $scope.nums.num1 =  number;
            }
            if(index==2)
            {
                $scope.nums.num2 =  number;
            }
            if(index==3)
            {
                $scope.nums.num3 =  number;
            }
            if(index==4)
            {
                $scope.nums.num4 =  number;
            }
            if(index==5)
            {
                $scope.nums.num5 =  number;
            }
            if(index==6)
            {
                Loading.show();
                $scope.nums.num6 =  number;
                var pwd=$scope.nums.num1 +'' + $scope.nums.num2 + $scope.nums.num3 + $scope.nums.num4 + $scope.nums.num5 + $scope.nums.num6;
                //余额支付
                if( $state.params.order_id ){
                    Helpbuy.payAmount({ order_id: $state.params.order_id,password:pwd }).$promise.then(function(data) {
                        Loading.hide();
                        $ionicPopup.alert({
                            title: '支付成功',
                            okText: "确定"
                        }).then(function(){
                            $state.go("user.info");
                            
                        });
                    }, function(error) {
                        clearPwd(error);
                    })
                }else {
                    // 商家入驻余额支付
                    Member.storeBalancePay({

                        id: $scope.store_id,
                        password: pwd

                    }).$promise.then(function(response){

                        console.log(response);
                        $state.go("user.information-check");

                    }, function(error){

                        clearPwd(error);
                        $scope.back();

                    });

                    Loading.hide();
                }

            }

            //
            if(number=='back')
            {
                var string='num' + index;
                $scope.nums[string] =  '';
                index--;

            }
        }

        // 支付失败清除密码
        function clearPwd(error){

            Loading.hide();

            $ionicPopup.alert({
                title: '支付失败',
                okText: "确定",
                template: error.data.message
            });
            
            var string='';
            for(var i=1;i<7;i++)
            {
               string='num' + i;
               $scope.nums[string] = '';
            }
            index=0;
            return false;
        }

    }
]);
