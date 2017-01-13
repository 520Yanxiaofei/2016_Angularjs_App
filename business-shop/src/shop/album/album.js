angular.module("App.Shop.Album", []).controller("App.Shop.Album.Controller", [
    "$scope",
    "$state",
    "$ionicSlideBoxDelegate",
    "Shop",
    function(
        $scope,
        $state,
        $ionicSlideBoxDelegate,
        Shop
    ) {

        $scope.currentPic = 0;
        $scope.slideChanged = function(index) {
            console.log(index);
            $scope.currentPic = index;
        }

        $scope.isShowSlide = false;
        $scope.showSliderImgs = function($index) {
            $scope.isShowSlide = true;
            $scope.currentPic = $index;
        }

        $scope.hideSlider = function() {
            $scope.isShowSlide = false;
        }

        $scope.handlEvent = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }

        //获取店铺相册
        Shop.getAlbum({ shop_id: $state.params.id }).$promise.then(function(response) {
            console.log(response.list);
            $scope.images = response.list;
            $ionicSlideBoxDelegate.update();
            $scope.images_length = $scope.images.length;
        }, function(response) {

        });

    }
]);
