angular.module("App.Goods.Classification", ["App.Goods.ClassificationAdd", "App.Goods.ClassificationEdit"]).controller("App.Goods.Classification.Controller", [
    "$scope",
    "$state",
    "Shop",
    function(
        $scope,
        $state,
        Shop
    ) {
        //分类列表
        $scope.category_list = Shop.getCategoryList()

        //跳转增加页面
        $scope.goAddClassification = function() {
            $state.go("goods.classification-add");
        }

        //跳转修改页面
        $scope.goEditClassification = function(id) {
            $state.go("goods.classification-edit",{
                id: id
            });
        }

        // 分页
        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.pageChanged = function() {
            console.log("Page changed to: " + $scope.bigCurrentPage);
        };
        $scope.maxSize = 6;          //分页每页显示的最大页数
        $scope.itemPerPage = 8;     //每页显示的数据条数
        $scope.bigTotalItems = 175;   //总数据条数
        $scope.bigCurrentPage = 1;   //当前页
    }
]);
