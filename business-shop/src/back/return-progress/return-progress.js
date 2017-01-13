angular.module("App.Back.ReturnProgress", []).controller("App.Back.ReturnProgress.Controller", [
    "$scope",
    "$state",
    "$ionicActionSheet",
    "$timeout",
    "$ionicModal",
    "$ionicHistory",
    function(
        $scope,
        $state,
        $ionicActionSheet,
        $timeout,
        $ionicModal,
        $ionicHistory
    ) {
        // 返回
        $scope.back = function(){
            $ionicHistory.goBack();
        }

        $scope.express = {
            name : "",
            number : ""
        }

        // Model
        $ionicModal.fromTemplateUrl('back/return-progress/model-back.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
                $scope.express = {
                name : "",
                number : ""
            }
        };

        // 退货确认
        $scope.showActionSheet = function() {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: '<span class="assertive">确定退货</span>' }
                ],
                cancelText: '取消',
                cancel: function() {
                    console.log("取消退货");
                },
                buttonClicked: function(index) {
                    if (index === 0) {
                        console.log("退货成功！");
                    }
                    return true;
                }
            });
        };

        // 确认提交快递信息
        $scope.ConfirmExpressInfo = function(){
            console.log($scope.express.name + "," + $scope.express.number);
        }        
        
    }
]);
