angular.module('Show.Welfare', []).controller('Show.Welfare.Controller', [
    '$scope',
    '$ionicSlideBoxDelegate',
    '$state',
    'Welfare',
    function(
        $scope,
        $ionicSlideBoxDelegate,
        $state,
        Welfare
    ) {
        // 搜索
        $scope.goSearch = function() {
            $state.go("search.category", {
                id: 0
            });
        }

        function initAmount(num) {
            var num_str = num.toString(),
                rs = [];
            for (var i = 0; i < num_str.length; i++) {
                rs.push(num_str[i]);
            }
            return rs;
        }

        // 爱心统计
        Welfare.getLoveCount().$promise.then(function(response) {
            $scope.love_count = initAmount(response.vote_total);
        }, function(response) {
            // console.log(response);
        });

        // 获取推荐项目
        Welfare.getRecommendList().$promise.then(function(response) {
            $scope.recommend_list = response;
        }, function(response) {
            // console.log(response);
        });


        $scope.hotShow = [];
        $scope.pageCut = {
            page: 1,
            limit: 4
        };
        $scope.moreDataCanBeLoaded = true;

        // 分页获取数据
        $scope.getWelfareList = function() {
            $scope.moreDataCanBeLoaded = true;
            Welfare.getWelfareList($scope.pageCut).$promise.then(function(response) {
                $scope.hotShowTitle = response.title;
                $scope.hotShow = $scope.hotShow.concat(response.shows);
                $scope.$broadcast('scroll.infiniteScrollComplete');

                $scope.pageCut.page++;
                if (response.shows.length < $scope.pageCut.limit) {
                    $scope.moreDataCanBeLoaded = false;
                };
            }, function(response) {
                // console.log(response);
            })
        }

        // 下拉刷新
        $scope.doRefresh = function() {
            $scope.hotShow = [];
            $scope.pageCut.page = 1;
            $scope.getWelfareList();
            $scope.$broadcast('scroll.refreshComplete');
        }
    }
])
