angular.module('App.Goods.Unreleased', []).controller('App.Goods.Unreleased.Controller', [
    '$scope',
    '$state',
    "Category",
    "Goods",
    "Alert",
    function(
        $scope,
        $state,
        Category,
        Goods,
        Alert
    ) {
        //$scope.originScope=$scope;
        //搜索品牌brand_id
        $scope.brand_id = "0";
        //搜索分类category_sys_id
        $scope.category_sys_id = "0";
        // 分页         
        $scope.totalItems = 0; //总共数据条数
        $scope.currentPage = 1; //当前在第几页
        $scope.itemsPerPage = 10; //每页显示的数据条数
        $scope.maxSize = 4; //分页显示的最大页数
        //品牌列表
        $scope.brand_list = Category.getBrand();
        //分类列表
        $scope.category_sys_list = Category.getSysCategoryTree();

        //初始化list
        var initList = function(search_obj) {
            $scope.goods = Goods.getGoodsList(search_obj);
            $scope.goods.$promise.then(function(response) {
                if (response.error === "0") {
                    $scope.totalItems = parseInt(response.data.total);
                } else {

                }
            })
        }

        //调用初始化数据
        initList({
            page: $scope.currentPage,
            limit: $scope.itemsPerPage
        });

        //翻页
        $scope.pageChanged = function() {
            initList({
                page: $scope.currentPage,
                limit: $scope.itemsPerPage,
                brand_id: $scope.brand_id,
                category_id: $scope.category_sys_id,
                title: $scope.title
            });
        };

        //搜索
        $scope.search = function() {
            initList({
                page: 1,
                limit: $scope.itemsPerPage,
                brand_id: $scope.brand_id,
                category_id: $scope.category_sys_id,
                title: $scope.title
            });
        }

        // 发布商品
        $scope.goodsOnline = function(good){
            $state.go('goods.publish', {id: good.id});
        }

        // 新增商品
        $scope.goodsAdd = function(){
            $state.go("goods.add");
        }

        //商品审核状态
        $scope.getApplyStatus = function (code){
            var status={
                "1" : "未提交审核",
                "2" : "待审核",
                "4" : "审核未通过"
            };
            return status[code] || "";
        };

        //商品提交审核
        $scope.applyGoods = function (goods){
            id = Number(goods.id);
            if (!id){
                return false;
            };
            Goods.applyGoods({id: id}).$promise.then(function (response){
                if (response.error === "0") {
                    goods.status=2;
                    Alert.show({
                        title: '成功',
                        type: 'success',
                        msg: '已提交，请等待审核',
                        closeable: true
                    });
                }else{
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message || '服务器错误！',
                        closeable: true
                    });
                }
            },function (response){
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: response.message || '服务器连接失败！',
                    closeable: true
                });
            });
        };
        
    }
]);


angular.module("ui.bootstrap.tpls").run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tooltip/tooltip-template-special.html",
    '<div class="popover" orig-scope="good.deny">\
        <div class="popover-inner">\
            <table class="table table-bordered table-vcenter text-center">\
                <tr class="block-title">\
                    <th class="text-center">驳回时间</th>\
                    <th class="text-center">驳回理由</th>\
                </tr>\
                <tr ng-repeat="de in $parent.origScope.good.deny track by $index">\
                    <td class="text-left">{{de.create_time*1000 | date : "yyyy-MM-dd H:mm"}}</td>\
                    <td class="text-left">{{de.remark}}</td>\
                </tr>\
            </table>\
        <div>\
    </div>'
    );
}]);

angular.module('ui.bootstrap.tpls')
.directive( 'tooltipSpecialPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { content: '@', placement: '@', animation: '&', isOpen: '&' , origScope: '&'},
    templateUrl: "uib/template/tooltip/tooltip-template-special.html"
  };
})
.directive('tooltipSpecial', [ '$uibTooltip', function ( $uibTooltip ) {
    var res=$uibTooltip( 'tooltipSpecial', 'popover', 'click' ,{
       
    } );
    return res;
}]);

