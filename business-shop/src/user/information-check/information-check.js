angular.module("App.User.InfomationCheck", []).controller("App.User.InfomationCheck.Controller", [
    "$scope",
    "$state",
    "Member",
    function(
        $scope,
        $state,
        Member
    ) {
        // 入驻申请审核状态
        // 入驻状态字典
        $scope.applyEmum={
            '-1': {
                title: '未找到申请记录',
                description:'您未提交商家信息',
                imgurl:''
            },
            '0': {
                title: '未审核',
                description:'等待审核...',
                imgurl:'image/user-examine.png'
            },
            '1': {
                title: '已通过',
                description:'您的店铺成功通过审核',
                imgurl:'image/user-man.png'
            },
            '2': {
                title: '未通过',
                description:'资料审核不通过',
                imgurl:'image/no-pay.png'
            }, 
            '3': {
                title: '已拒绝',
                description:'您的入驻请求被拒绝',
                imgurl:'image/face-cry.png'
            },
            '4': {
                title: '入驻失败',
                description:'未缴纳入驻费用',
                imgurl:''
            } ,
            '5': {
                title: '审核通过',
                description:'您的入驻请求已通过',
                imgurl:''
            } ,
            '6': {
                title: '退款成功',
                description:'您的退款已成功',
                imgurl:''
            } 
        };

        $scope.status=0;
        $scope.isWait = false;          // 是否是等待审核状态
        $scope.isPay = false;            // 是否未支付
        $scope.isNotPass = false;       // 是否通过客服审核
        $scope.isSuccess = false;       // 是否成功通过审核（客服审核、财务审核）
        $scope.isEdit = false;          // 正在审核入驻成功之后的店铺修改
        $scope.havePay = false;          // 是否入驻失败
        $scope.isFaild = false;          // 我已支付入驻费用
        $scope.isRefund = false;        // 退款成功
        $scope.inforWrong = false;        // 入驻成功后资料审核是否未通过
        $scope.goback=function goback(){
            $state.go('user.info');
        }
        // 重新编辑入驻信息
        function toEdit(){
            $state.go("user.merchant-information", {
                type: 2
            });
        }
        // 跳转支付页面
        function toPay(){
            $state.go("user.join-pay");
        }
        // 退款成功之后重新申请入驻
        $scope.toJoin = function(){
            $state.go("user.merchant-notes");
        }

        Member.getMemberApplyStatus().$promise.then(function(response){
            console.log(response);
            $scope.status = response.apply.status;
            $scope.pay_status = response.apply.pay_status;
            $scope.isRefund = $scope.status == 6 ? true : false;

            switch(Number($scope.pay_status)){
                case 0:
                    console.log("未付款");
                    switch(Number($scope.status)){
                        case 0:
                            console.log("未通过...");
                            $scope.isPay = true;
                            $scope.isWait = false;
                            $scope.toEdit = toEdit;
                            $scope.toPay = toPay;
                            break;
                        case 1:
                            console.log("已通过");
                            $scope.isWait = false;
                            $scope.isPay = false;
                            $scope.isSuccess = true;
                            $scope.isNotPass = false;
                            Member.getMemberEditStatus().$promise.then(function(data){
                                // if( data.apply.title == "" || !data.apply.title ){
                                //     $scope.deny_remark = "入驻成功";
                                // }
                                if(data.apply.status == 0){
                                    $scope.isEdit = false;
                                    $scope.isWait = false;
                                    $scope.isPay = false;
                                    $scope.isSuccess = true;
                                    $scope.inforWrong = false;
                                    $scope.deny_remark = "您的店铺信息修改正在审核中...";
                                }else if(data.apply.status == 2){
                                    $scope.isEdit = true;
                                    $scope.isWait = false;
                                    $scope.isPay = false;
                                    $scope.isSuccess = true;
                                    $scope.isNotPass = false;
                                    $scope.inforWrong = true;
                                    $scope.deny_remark = data.deny.remark;
                                }else {
                                    $scope.isEdit = true;
                                    $scope.isWait = false;
                                    $scope.isPay = false;
                                    $scope.isSuccess = true;
                                    $scope.isNotPass = false;
                                    $scope.inforWrong = false;
                                    if( data.apply.title == "" || !data.apply.title ){
                                        $scope.deny_remark = "入驻成功";
                                    }else{
                                        $scope.deny_remark = "店铺资料修改成功";
                                    }
                                }
                            }, function(error){
                                console.log(error);
                            });
                            $scope.toEdit = toEdit;
                            break;
                        case 2:
                            console.log("审核未通过");
                            $scope.isWait = false;
                            $scope.isPay = false;
                            $scope.isSuccess = false;
                            $scope.isNotPass = true;
                            $scope.deny_remark = "资料审核失败";
                            break;
                        case 3:
                            console.log("已拒绝");
                            $scope.isWait = false;
                            $scope.isPay = false;
                            $scope.isSuccess = false;
                            $scope.isNotPass = false;
                            $scope.deny_remark = "已拒绝";
                            break;
                    }
                    break;
                case 1:
                    switch(Number($scope.status)){
                        case 0:
                            console.log("未审核...");
                            $scope.isWait = true;
                            $scope.isPay = false;
                            $scope.isSuccess = false;
                            $scope.deny_remark = "等待审核";
                            break;
                        case 1:
                            console.log("已通过");
                            $scope.isWait = false;
                            $scope.isPay = false;
                            $scope.isSuccess = true;
                            $scope.isNotPass = false;
                            Member.getMemberEditStatus().$promise.then(function(data){
                                if(data.apply.status == 0){
                                    $scope.isEdit = false;
                                    $scope.isWait = false;
                                    $scope.isPay = false;
                                    $scope.isSuccess = true;
                                    $scope.inforWrong = false;
                                    $scope.deny_remark = "您的店铺信息修改正在审核中...";
                                }else if(data.apply.status == 2){
                                    $scope.isEdit = true;
                                    $scope.isWait = false;
                                    $scope.isPay = false;
                                    $scope.isSuccess = true;
                                    $scope.isNotPass = false;
                                    $scope.inforWrong = true;
                                    $scope.deny_remark = data.deny.remark;
                                }else {
                                    $scope.isEdit = true;
                                    $scope.isWait = false;
                                    $scope.isPay = false;
                                    $scope.isSuccess = true;
                                    $scope.isNotPass = false;
                                    $scope.inforWrong = false;
                                    if( data.apply.title == "" || !data.apply.title ){
                                        $scope.deny_remark = "入驻成功";
                                    }else{
                                        $scope.deny_remark = "店铺资料修改成功";
                                    }
                                }
                            }, function(error){
                                console.log(error);
                            });
                            $scope.toEdit = toEdit;
                            break;
                        case 2:
                            console.log("客服驳回");
                            $scope.isWait = false;
                            $scope.isPay = false;
                            $scope.isSuccess = false;
                            $scope.isNotPass = true;
                            $scope.deny_remark = response.deny.remark;
                            break;
                        case 4:
                            console.log("财务驳回");
                            $scope.isFaild = true;
                            $scope.isWait = false;
                            $scope.isPay = false;
                            $scope.isSuccess = false;
                            $scope.isNotPass = false;
                            $scope.havePay = true;
                            $scope.deny_remark = "入驻失败";
                            $scope.deny = response.deny.remark;
                            $scope.toWait = function(){
                                Member.havePay({
                                    id: response.apply.id
                                }).$promise.then(function(data){
                                    $state.go("user.information-check");
                                }, function(error){

                                });
                                $scope.isFaild = false;
                                $scope.isWait = true;
                                $scope.isPay = false;
                                $scope.isSuccess = false;
                                $scope.isNotPass = false;
                                $scope.havePay = true;
                            }
                            break;
                        case 5:
                            $scope.isWait = true;
                            $scope.isPay = false;
                            $scope.isSuccess = false;
                            $scope.deny_remark = "等待审核";
                            console.log("555");
                            break;
                        case 6:
                            $scope.isWait = false;
                            $scope.isPay = false;
                            $scope.isSuccess = false;
                            $scope.isNotPass = false;
                            $scope.isRefund = true;
                            $scope.deny_remark = "退款成功";
                            break;
                    }
                    break;
            }

        },function(error){
            $scope.status='0';
        });
    }
]);
