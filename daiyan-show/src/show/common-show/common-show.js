angular.module('Show.Common', []).controller('Show.Common.Controller', [
    '$scope',
    '$state',
    'Ordinary',
    function(
        $scope,
        $state,
        Ordinary
    ) {
        // console.log($scope.show);
        $scope.categoryTitle = $scope.show.title;

        // 选秀详情
        $scope.showLink = function(isCharity, showId) {
            if (isCharity == "1") {
                return 'commonweal.detail({ id: ' + showId + '})'
            } else {
                return 'selected.detail({ id: ' + showId + '})'
            }
        }

        // 搜索
        $scope.goSearch = function() {
            $state.go('search.category', {
                id: $scope.show.id
            });
        }

        // 获取推荐项目
        Ordinary.getRecommendList({
            category_id: $scope.show.id
        }).$promise.then(function(response) {
            $scope.recommendShows = response.shows;
            // console.log(response.shows);
        }, function(response) {
            // console.log(response);
        });

        // 获取分类选秀列表
        $scope.categoryList = [];
        var param = {
            category_id: $scope.show.id,
            page: 1,
            limit: 4
        };
        $scope.moreDataCanBeLoaded = true;

        // 分页获取数据
        $scope.getCategoryList = function() {
            $scope.moreDataCanBeLoaded = true;
            Ordinary.getList(param).$promise.then(function(response) {
                $scope.categoryList = $scope.categoryList.concat(response.shows);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //console.log(response);
                param.page++;
                if (response.shows.length < param.limit) {
                    $scope.moreDataCanBeLoaded = false;
                };
            }, function(response) {
                // console.log(response);
            })
        }

        // 下拉刷新
        $scope.doRefresh = function() {
            $scope.categoryList = [];
            param.page = 1;
            $scope.getCategoryList();
            $scope.$broadcast('scroll.refreshComplete');
        }
    }
])
