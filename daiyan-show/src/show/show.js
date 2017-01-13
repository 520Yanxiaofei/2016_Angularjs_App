angular.module('App.Show', ['Show.Represent', 'Show.Welfare', 'Show.Common', 'Show.Review', 'Show.All']).controller('Show.Controller', [
    '$rootScope',
    '$scope',
    '$stateParams',
    '$q',
    '$location',
    '$window',
    '$timeout',
    '$state',
    '$ionicSlideBoxDelegate',
    'Ordinary',
    'MemberInfo',
    'Loading',
    function(
        $rootScope,
        $scope,
        $stateParams,
        $q,
        $location,
        $window,
        $timeout,
        $state,
        $ionicSlideBoxDelegate,
        Ordinary,
        MemberInfo,
        Loading
    ) {
        // Loading.show('数据加载中...');

        // 滑动切换事件
        $scope.onSlideMove = function(data) {
            // console.log('index: ' + data.index);
        };

        $scope.showEnter = false;
        $scope.hideLayer = function() {
            $scope.showEnter = false;
        }

        // 获取用户身份
        MemberInfo.getUserInfo().$promise.then(function(response) {
            $scope.allowCreate = response.role;
            // console.log(response);
        }, function(response) {
            console.log(response);
        })

        // 发起选秀活动（只有代言人才能发起选秀活动）
        $scope.goCreate = function() {
            $state.go('create');
            // if ($scope.allowCreate == 2 || $scope.allowCreate == 3 || $scope.allowCreate == 4) {
            //     $state.go('create');
            // } else {
            //     $scope.showEnter = true;
            // }
        }

        // 申请成为代言人
        $scope.goBecomeSpoker = function() {
            window.location.href = "http://m.cellmyth.cn/wechat/spree/explain";
            //alert('跳转至代言人申请页');
        }

        // tab 导航
        function createTabs(type) {
            var init_show_types = [{
                title: '代言秀',
                template: 'show/represent/represent.html'
            }, {
                title: '公益秀',
                template: 'show/welfare/welfare.html'
            }];

            var tempShowType = [];
            tempShowType = tempShowType.concat(init_show_types, type);
            for (var i = 0; i < tempShowType.length; i++) {
                if (tempShowType[i].id) {
                    tempShowType[i].template = 'show/common-show/common-show.html';
                }
            };
            tempShowType = tempShowType.concat({
                title: '选秀回顾',
                template: 'show/review/review.html'
            });
            return tempShowType;
        }

        // 获取选秀类型列表
        Ordinary.getCategoryList().$promise.then(function(response) {
            $scope.showTypes = createTabs(response.list);
            $ionicSlideBoxDelegate.update();
        }, function(response) {
            console.log(response);
        })
    }
])
