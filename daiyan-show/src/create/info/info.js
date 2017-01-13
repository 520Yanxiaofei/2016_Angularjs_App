angular.module("App.Create.Info", []).controller("App.Create.Info.Controller", [
	"$scope", 
	"$state",
    "Loading",
    "$ionicPopup",
	function( $scope, $state ,Loading ,$ionicPopup){
        //上传logo
        $scope.uploadLogo = function uploadLogo(elm,cb) {
            var imgObjPreview;
            imgObjPreview = angular.element(elm).parent();
            function post() {
                var url = config.API_ROOT + '/show/launch/cover_upload';
                if (elm.files && elm.files[0]) {
                    var formdata = new FormData();
                    formdata.append('image', elm.files[0]);
                    var xhr = new XMLHttpRequest();
                    Loading.show("正在上传");
                    xhr.open('POST', url, true);
                    xhr.withCredentials = true;
                    xhr.onload = function() {
                        var result;
                        try {
                            result = angular.fromJson(this.responseText);
                        } catch (e) {
                            result = {};
                        }
                        if (result.error == "0") {
                            Loading.hide("上传成功");
                            cb(result.data.cover);
                        } else {
                            Loading.hide();
                            $ionicPopup.alert({
                                title: "错误",
                                template: error.data && error.data.message || "上传失败！"
                            });
                        }

                    };
                    xhr.send(formdata);
                }
            }
            post();
        }

	}
])
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "=",
            fileview: "=",
            filechange: "="
        },
        link: function (scope, element, attributes) {

            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileview = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
                scope.$apply(function () {
                    scope.filechange(element[0],function (data){
                        scope.fileread = data;
                    });
                });
            });
        }
    }
}]);