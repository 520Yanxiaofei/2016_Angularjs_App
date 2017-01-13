angular.module("App.User.JoinInfor", []).controller("App.User.JoinInfor.Controller", [
    "$scope",
    "$state",
    "Member",
    function(
        $scope,
        $state,
        Member
    ) {

        var infor = {
            logo: "",
            title: "",
            address: "",
            mobile: "",
            contact: "",
            industry: ""
        }
        $scope.infor = infor;

        Member.getMemberApplyStatus().$promise.then(function(data){

            infor.logo = data.apply.logo;
            infor.title = data.apply.title;
            infor.address = data.apply.address;
            infor.mobile = data.apply.mobile;
            infor.contact = data.apply.contact;
            infor.industry = data.apply.industry;
            console.log($scope.infor);

        }, function(error){

            console.log(error);

        });

        // 编辑店铺信息
        $scope.toEdit = function(){
            $state.go("user.merchant-information",{
                type: 1
            });
        }
        // 跳转支付
        $scope.toPay = function(){
            $state.go("user.join-pay");
        }

    }
]);
