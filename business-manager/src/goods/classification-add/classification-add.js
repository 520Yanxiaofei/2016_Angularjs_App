angular.module("App.Goods.ClassificationAdd", []).controller("App.Goods.ClassificationAdd.Controller", [
    "$scope",
    "$state",
    "Shop",
    function(
        $scope,
        $state,
        Shop
    ) {
        //名称
        $scope.title = "";
        //备注
        $scope.remark = "";

        //增加分类
        $scope.addCategory = function() {
            Shop.addCategory({
                title: $scope.title,
                remark: $scope.remark
            }).$promise.then(function(response) {
                if (response.error == "0") {
                    alert("增加分类成功");
                    $state.go("goods.classification");
                }else{
                    alert(response.message);
                }
            })
        }
    }
]);
