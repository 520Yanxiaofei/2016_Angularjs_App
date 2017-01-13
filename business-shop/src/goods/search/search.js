angular.module("App.Goods.Search", []).controller("App.Goods.Search.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    function(
        $scope,
        $state,
        $ionicHistory
    ) {
        $scope.isFocus = true;
        // 搜索类型
        $scope.seachType = "goods";
        $scope.form = {
            cur_keyword: ''
        }

        // 返回
        $scope.back = function() {
            $ionicHistory.goBack();
        }

        $scope.records = [{
            keyword: "美业"
        }, {
            keyword: "代颜网"
        }, {
            keyword: "花子直播间"
        }];

        // 删除单条搜索记录
        $scope.delSearchRecord = function(index) {
            $scope.records.splice(index, 1);
        }

        // 删除所有搜索记录
        $scope.delAllRecord = function() {
            $scope.records = null;
        }

        // 搜索
        $scope.search = function(key) {
            if ($scope.seachType === "shop") {
                console.log("Search in 店铺, the keyword is " + key);
                $state.go("goods.search-result", {
                    key: key
                });
            }
            if ($scope.seachType === "goods") {
                console.log("Search in 商品, the keyword is " + key);
                $state.go("goods.search-goods", {
                    key: key
                });
            }
        }



        // 清除搜索关键词
        $scope.clearKeyword = function($event) {
            $event.stopPropagation();　　
            $scope.form.cur_keyword = "";
        }

        $scope.getSearchType = function(type) {
            $scope.seachType = type;
        }

        // 回车键搜索
        $scope.keyUpSearch = function($event) {
            if ($event.keyCode === 13) {
                $scope.search($scope.form.cur_keyword);
            }
        }


    }
]);
