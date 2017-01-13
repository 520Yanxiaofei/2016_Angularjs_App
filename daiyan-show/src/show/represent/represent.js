angular.module('Show.Represent', []).controller('Show.Represent.Controller', [
    '$scope',
    '$ionicSlideBoxDelegate',
    '$state',
    'Choice',
    function(
        $scope,
        $ionicSlideBoxDelegate,
        $state,
        Choice
    ) {
        // 搜索
        $scope.goSearch = function() {
            $state.go("search.main");
        }

        // 获取banner数据
        Choice.getBannerInfo().$promise.then(function(response) {
            $scope.banner_info = response;
            $ionicSlideBoxDelegate.update();
            // console.log(response);
        }, function(response) {
            console.log(response);
        })

        // 获取推荐选秀
        Choice.getShowReconmmend().$promise.then(function(response) {
            $scope.recommendShow = response;
            // console.log(response);
        }, function(response) {
            // console.log(response);
        })

        // 选秀详情
        $scope.showLink = function(isCharity, showId) {
            if (isCharity == "1") {
                return 'commonweal.detail({ id: ' + showId + '})';
            } else {
                return 'selected.detail({ id: ' + showId + '})';
            }
        }

        $scope.hotShow = [];
        $scope.pageCut = {
            page: 1,
            limit: 4
        };
        $scope.moreDataCanBeLoaded = true;

        // 分页获取数据
        $scope.getHotShowData = function() {
            $scope.moreDataCanBeLoaded = true;
            Choice.getShowHot($scope.pageCut).$promise.then(function(response) {
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
            $scope.getHotShowData();
            $scope.$broadcast('scroll.refreshComplete');
        }
    }
])
