angular.module("App.User.BuySuccess", []).controller("App.User.BuySuccess.Controller", [
    "$scope",
    "$state",
    "Member",
    function(
        $scope,
        $state,
        Member
    ) {
        
        //购买资格类商品数据字典
        $scope.buy_success = {
            1 : {
                btn_text: "完善资料",
                text: "支付成功，恭喜您，您已经获取该品牌商代言商资格，请完善你的推荐和节点关系!",
                care_text: "注：只有完善代言商资料后，才能获取经销商特权！"
            },
            2 : {
                btn_text: "查看资料",
                text: "支付成功，恭喜您，您已经获取该品牌商代言商资格!"
            },
            3 : {
                btn_text: "查看资料",
                text: "支付成功，恭喜您，您已经获取该品牌商此商品代言人资格！"
            },
            4 : {
                btn_text: "完善资料",
                text: "您已支付成功，如果未完善代言人资料，请尽快完善代言资料，完善后才能获取该品牌商此商品代言人资格！",
                care_text: "注：只有完善代言人资料，获取此品牌商家此商品资格特权！"
            }
        }

        $scope.status = 0;

        //资格商品类型
        var goods_type = $state.params.goods_type;


        Member.checkAptitude().$promise.then(function(checkAptitude){
            //code 1:代言人未完善,2:代言商未完善,3:代言人已完善,4:代言商已完善
            if(checkAptitude.code == "1"){
                $scope.status = 4;
            }else if (checkAptitude.code == "2") {
                $scope.status = 1;
            }else if (checkAptitude.code == "3") {
                $scope.status = 3;
            }else{
                $scope.status = 2;
            }
        },function(error){
            console.log(error)
        });

        // Member.getMemberInfo().$promise.then(function(member_info){
        //     $scope.member_info = member_info;
        //     //role 1:代言粉,2:代言人,3:代言商,4:代言店
        //     if((member_info.role == "1" || member_info.role == "2") && goods_type == "2"){//代言人、代言粉购买代言商资格商品
        //         $scope.status = 1;
        //     }else if (member_info.role == "3" && goods_type == "2") {//代言商购买代言商资格商品
        //         $scope.status = 2;
        //     }else if ((member_info.role == "2" || member_info.role == "3") && goods_type == "1") {//代言人、代言商购买代言人资格商品
        //         $scope.status = 3;
        //     }else if (member_info.role == "1" && goods_type == "1") {
        //         $scope.status = 4;
        //     }
        // },function(error){
        //     console.log(error)
        // });
        
    }
]);
