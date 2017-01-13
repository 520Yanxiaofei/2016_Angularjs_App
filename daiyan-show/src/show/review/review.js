angular.module('Show.Review', []).controller('Show.Review.Controller', [
    '$scope',
    'Ordinary',
    function(
        $scope,
        Ordinary
    ) {

        // console.log($scope.show);
        // 选秀详情
        $scope.showLink = function(isCharity, showId) {
            if (isCharity == "0") {
                return 'commonweal.detail({ id: ' + showId + '})'
            } else {
                return 'selected.detail({ id: ' + showId + '})'
            }
        }

        // 获取分类选秀列表
        $scope.historyList = [];
        var param = {
            page: 1,
            limit: 4
        };
        $scope.moreDataCanBeLoaded = true;

        // 分页获取数据
        $scope.getHistoryList = function() {
            $scope.moreDataCanBeLoaded = true;
            Ordinary.getHistory(param).$promise.then(function(response) {
                $scope.historyList = $scope.historyList.concat(response.shows);
                $scope.$broadcast('scroll.infiniteScrollComplete');

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
            $scope.historyList = [];
            param.page = 1;
            $scope.getHistoryList();
            $scope.$broadcast('scroll.refreshComplete');
        }
    }
])
