angular.module("App.Home", ["App.Edit","App.Address","App.Offline"]).controller("App.Home.Controller", [
    "$scope",
    "$state",
    "Shop",
    "Financia",
    "Alert",
    "$q",
    "$cookies",
    function(
        $scope,
        $state,
        Shop,
        Financia,
        Alert,
        $q,
        $cookies
    ) {

         //店铺信息
         $scope.shop_info = Shop.getInfo(function (response){
            if (response.error=="0"){
                $cookies.put('shop_type',response.data.shop_type);

            }
         });

         //财务信息
         $scope.shop_account = Shop.getMyAccount();

         //提醒信息
         $scope.shop_notice = Shop.getNotice();

         //行业格式化
         $scope.formatIndustry=function formatIndustry(data){
            var industry=[];
            angular.forEach(data,function(item){
                industry.push(item.title);
            });
            return industry.join(' / ');
         };

         $scope.extract = function extract(){
            //发起提现
            Financia.extract().$promise
                //判断提现返回头
                .then(function(response){
                    if (response.error == 0){
                        return response;
                    } else {
                        return $q.reject(response);
                    }
                })
                //提现操作反馈
                .then(function (response){
                    Alert.show({
                        title: '成功',
                        type: 'success',
                        msg: response.message,
                        closeable: true
                    });
                    return response;
                },function (response){
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message || "提现失败！",
                        closeable: true
                    });
                })
                //重新获取财务信息
                .then(function(response){
                    return Shop.getMyAccount().$promise;
                })
                //判断财务返回头
                .then(function(response){
                    if (response.error == 0){
                        return response;
                    }else{
                        return $q.reject(response);
                    }
                    
                }, function (response){
                    return $q.reject(response);
                })
                //更新财务信息
                .then(function (response){
                    $scope.shop_account.data.money = response.data.money;
                    $scope.shop_account.data.total = response.data.total;
                },function (response){
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message || "获取财务信息失败，请刷新页面!",
                        closeable: true
                    });
                })
         };
    }
]);