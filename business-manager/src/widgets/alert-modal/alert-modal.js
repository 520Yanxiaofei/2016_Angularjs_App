angular.module("App.Widgets").factory("Alert", [
    "$uibModal",
    "$rootScope",
    function(
        $uibModal,
        $rootScope
    ) {
        //alert控制器
        var alertModalController = [
            "$scope",
            "$uibModalInstance",
            "$timeout",
            "alert",
            function(
                $scope,
                $uibModalInstance,
                $timeout,
                alert
            ) {
                $scope.alert = alert;
                if (alert.closeable) { //是否自动关闭
                    $timeout(function() {
                        $uibModalInstance.close()
                    }, 3000);
                } else {
                    $scope.close = function() {
                        $uibModalInstance.close();
                    }
                }
            }
        ];

        //显示modal
        function show(alert){
            var bk=true;
            bk=alert.type=="success"?false:true;
            var confirmModal = $uibModal.open({
                backdrop: bk,
                animation: true,
                templateUrl: "widgets/alert-modal/alert-modal.html",
                windowClass: "alert-modal",
                controller: alertModalController,
                resolve: {
                    alert: function() {
                        return alert;
                    }
                }
            })
        };

        return {
            show: show
        }

    }
])
