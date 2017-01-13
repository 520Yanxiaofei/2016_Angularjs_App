angular.module('App.Goods.Shelves', []).controller('App.Goods.Shelves.Controller', [
    '$scope',
    '$state',
    "Goods",
    "Alert",
    "Confirm",
    "Category",
    function(
        $scope,
        $state,
        Goods,
        Alert,
        Confirm,
        Category
    ) {

        $scope.select_all = false;
        $scope.goodsDel = function() {

        }
        //品牌列表
        $scope.brand_list = Category.getBrand();
        //分类列表
        $scope.category_sys_list = Category.getSysCategoryTree();

        // 分页         
        $scope.totalItems = 0; //总共数据条数
        $scope.currentPage = 1; //当前在第几页
        $scope.itemsPerPage = 10; //每页显示的数据条数
        $scope.maxSize = 4; //分页显示的最大页数

        //点击全选checkbox
        $scope.selectAll = function() {
            $scope.select_all = !$scope.select_all;
            for (var i = 0; i < $scope.goods.data.list.length; i++) {
                $scope.goods.data.list[i].checked = $scope.select_all;
            }
        }

        //点击单个checkbox
        $scope.change = function(good) {
            var flag = true;
            good.checked = !good.checked;
            if (good.checked) {
                for (var i = 0; i < $scope.goods.data.list.length; i++) {
                    if ($scope.goods.data.list[i].checked == false) {
                        flag = false
                        break;
                    }
                }
                $scope.select_all = flag ? true : false;
            } else {
                $scope.select_all = false;
            }
        }

        //初始化list
        var initList = function(search_obj) {
            $scope.goods = Goods.getSellList(search_obj);
            $scope.goods.$promise.then(function(response) {
                if (response.error === "0") {
                    $scope.totalItems = parseInt(response.data.total);
                    // 全选       
                    $scope.select_all = false;
                    for (var i = 0; i < response.data.list.length; i++) {
                        response.data.list[i].checked = $scope.select_all;
                    }
                } else {
                    //error
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
                limit: $scope.itemsPerPage
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

        //下架商品
        $scope.goodOffline = function(good) {
            Confirm.show({
                title:"商品下架提示",
                content: "确定要下架此商品？",
                ok: function() {
                    Goods.goodOffline({
                        id: good.id
                    }).$promise.then(function(response) {
                        if (response.error == "0") {
                            Alert.show({
                                title: '成功',
                                type: 'success',
                                msg: "下架成功",
                                closeable: true
                            });
                            initList({
                                page: $scope.currentPage,
                                limit: $scope.itemsPerPage,
                                brand_id: $scope.brand_id,
                                category_id: $scope.category_sys_id,
                                title: $scope.title
                            });
                        } else {
                            Alert.show({
                                title: '失败',
                                type: 'danger',
                                msg: response.message,
                                closeable: false
                            });
                        }
                    })
                }
            });

        }

        //批量下架商品
        $scope.delGoods = function(){
            var ids=getSelectOfflineGoodIdList();
            var post={};
            if (ids.length>0){
                post.id=ids.join(',');
                $scope.goodOffline(post);
            }else{
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '请选择要下架的商品！',
                    closeable: true
                });
            }
            
        }

        // 获取下架商品 id 列表
        function getSelectOfflineGoodIdList() {
            var id_list = [];
            for (var i = 0; i < $scope.goods.data.list.length; i++) {
                if ($scope.goods.data.list[i].checked === true) {
                    id_list.push($scope.goods.data.list[i].id);
                }
            }
            return id_list;
        }
    }
]);
