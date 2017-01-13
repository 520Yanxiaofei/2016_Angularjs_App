angular.module("App.Goods.ClassificationEdit", []).controller("App.Goods.ClassificationEdit.Controller", [
    "$scope",
    "$state",
    "Shop",
    function(
        $scope,
        $state,
        Shop
    ) {

        //分类的id
        var id = $state.params.id;

        //分类详情
        $scope.category_info = Shop.getCategoryInfo({
            id: id
        });
        
        //修改分类
        $scope.editCategory = function() {
            Shop.editCategory({
                id: id,
                title: $scope.category_info.data.title,
                remark: $scope.category_info.data.remark
            }).$promise.then(function(response) {
                if (response.error == "0") {
                    alert("修改分类成功");
                    $state.go("goods.classification");
                }else{
                    alert(response.message);
                }
            })
        }
    }
]);
