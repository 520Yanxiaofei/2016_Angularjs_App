angular.module('App.Goods.Unshelves', []).controller('App.Goods.Unshelves.Controller', [
    '$scope',
    '$state',
    "Goods",
    "Category",
    "Prompt",
    "Alert",
    "Confirm",
    function(
        $scope,
        $state,
        Goods,
        Category,
        Prompt,
        Alert,
        Confirm
    ) {

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

        //全选checkbox
        $scope.select_all = false;

        //删除商品
        $scope.goodsDel = function() {
            var del_list = [];
            for (var i = 0; i < $scope.goods.data.list.length; i++) {
                if ($scope.goods.data.list[i].checked == true) {
                    del_list.push($scope.goods.data.list[i].id)
                }
            }
            if (del_list.length == 0) {
                Alert.show({
                    type: 'danger',
                    msg: "请选择要删除的数据",
                    closeable: false
                });
                return;
            }
            Goods.goodDel({
                goods_id: del_list
            }).$promise.then(function(response) {
                if (response.error == "0") {
                    Alert.show({
                        type: 'success',
                        msg: "删除成功",
                        closeable: true
                    });
                    initList({
                        page: $scope.currentPage,
                        limit: $scope.itemsPerPage
                    });
                } else {
                    Alert.show({
                        type: 'danger',
                        msg: "删除失败",
                        closeable: false
                    });
                }
            })
        }
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
            $scope.goods = Goods.getGoodsListed(search_obj);
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

        //上架商品
        $scope.goodOnline = function(good) {
            Prompt.show({
                title: "请输入库存",
                content: good.stock || 0,
                ok: function(text) {
                    Goods.goodOnline({
                        id: good.id,
                        stock: this.content
                    }).$promise.then(function(response) {
                        if (response.error == "0") {
                            Alert.show({
                                title: '成功',
                                type: 'success',
                                msg: "上架商品成功",
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
            })
        }

        //编辑商品
        $scope.editGoods = function (id){
            if (!id){
                return false;
            };
            Confirm.show({
                title: '提示',
                content: '重新编辑的商品需要审核才能上架哦',
                ok: function() {
                    $state.go('goods.publish',{id:id});
                }
            });
        };
    }
]);