angular.module('App.Edit', []).controller('App.Edit.Controller', [
    '$scope',
    '$state',
    'Upload',
    'Shop',
    'Alert',
    'Confirm',
    '$timeout',
    'Album',
    '$q',
    '$cookies',
    'applyHistroy',
    function(
        $scope,
        $state,
        Upload,
        Shop,
        Alert,
        Confirm,
        $timeout,
        Album,
        $q,
        $cookies,
        applyHistroy
    ) {
        var ctrl = this;
        var uploadTempUrl = config.API_ROOT + '/seller/goods/description_photo_upload'; //临时上传文件地址
        var uploadPhotoUrl = config.API_ROOT + '/seller/album/uplod'; //相册图片上传地址
        var loadingImg = 'static/img/loading.gif'; //loding图
        var imgTotal = 10; //相册图片限制
        $scope.form = {};
        $scope.help = {
            position: [], //省市县
            logo: "",
            cover: "",
            image: "",
            mutiImages: "",
            imgPage: 0,
            imgTotal: 0,
            imgLimit: 10,
            maxPage: 10,
            submiting: false, //提交表单中
            applyStatus: 0
        };
        $scope.images = []; //相册图片
        //提交基本信息
        function submit() {

            if (ctrl.infoForm.$invalid) {
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '信息不完整！',
                    closeable: true
                });
                return false;
            };
            $scope.help.submiting = true;
            Shop.editInfo($scope.form).$promise.then(function(response) {
                $scope.help.submiting = false;
                if (response.error == "0") {
                    Alert.show({
                        title: '成功',
                        type: 'success',
                        msg: response.message,
                        closeable: true
                    });
                    angular.extend($scope.history.apply,$scope.form);
                    $scope.history.apply.status = 0;
                    $scope.history.apply.update_time = + (new Date)/1000;
                } else {
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message,
                        closeable: true
                    });
                }
            });

        };

        //初始化基本信息
        function initForm() {

            Shop.getInfo({}).$promise.then(function(response) {
                if (response.error == "0") {
                    angular.extend($scope.form, response.data);
                } else {
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message,
                        closeable: true
                    });
                }
            });
        };

        //行业格式化
        function formatIndustry(data) {
            var industry = [];
            angular.forEach(data, function(item) {
                industry.push(item.title);
            });
            return industry.join(' / ');
        };

        //上传图片本地预览
        function readImg(file) {
            var deferred = $q.defer();
            if (file) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    deferred.resolve(evt.target.result);
                }
                reader.readAsDataURL(file);
            } else {
                deferred.reject('请选择文件');
            }
            return deferred.promise;
        };

        //通用图片上传
        function uploadFile(file, images, data) {
            var image, preview_img, promise, result;
            image = {
                url: loadingImg,
                per: 0
            };
            //本地预览
            preview_img = readImg(file);
            preview_img.then(function(result) {
                image.url = result;
            }, function(error) {
                image.url = loadingImg;
            });
            images.unshift(image);

            result = $q.defer();
            promise = Upload.upload(data);

            promise.then(function(response) {
                var data;
                if (response.data.error != 0) {
                    return $q.reject(response.data.message);
                };
                data = response.data.data;
                image.id = data.id;
                image.per = 100;
                image.url = data.url;
                result.resolve(images);
            }, function(response) {
                throw "服务器错误";
            }, function(evt) {
                image.per = Math.min(90, parseInt(100.0 * evt.loaded / evt.total));
            }).catch(function(error) {
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: error || "服务器错误！",
                    closeable: false
                });
                //清除
                image.url = "";
                image.per = 0;
                $timeout(function() {
                    var i;
                    i = images.indexOf(image);
                    if (i >= 0) {
                        $scope.images.splice(i, 1);
                    }
                }, 300);
                result.reject(error || "服务器错误！");

            });
            return result.promise;
        };

        //上传logo
        function uploadLogo(file) {
            var img_temp;
            if (!file) {
                return false;
            };
            img_temp = $scope.form.logo;
            $scope.form.logo = loadingImg;
            uploadFile(file, [], {
                url: uploadTempUrl,
                data: { image: file }
            }).then(function(data) {
                $scope.form.logo = data[0].url;
            }, function(error) {
                $scope.form.logo = img_temp;
            });
        };

        //上传店铺封面
        function uploadCover(file) {
            var img_temp, post;
            if (!file) {
                return false;
            };
            img_temp = $scope.form.cover;
            $scope.form.cover = loadingImg;
            post = {
                url: config.API_ROOT + '/seller/shop/upload_cover',
                data: { image: file }
            };
            uploadFile(file, [], post).then(function(data) {
                $scope.form.cover = data[0].url;
            }, function(error) {
                $scope.form.cover = img_temp;
            });
        };

        //店铺相册图片上传
        function uploadPhotos(files) {
            files = angular.isArray(files) ? files : [files];
            if (files.length > imgTotal || files.length + $scope.images.length > imgTotal) {
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '只能上传 ' + imgTotal + ' 张图片！',
                    closeable: true
                });
                return;
            }
            files.forEach(function(file) {
                if (!file) {
                    return false;
                };
                uploadFile(
                    file, $scope.images, {
                        url: uploadPhotoUrl,
                        data: { image: file, album_id: 0 }
                    }
                ).then(function(data) {

                }, function(error) {

                });
            })
        };

        //相册图片列表
        function getImgList() {
            var query = {
                album_id: 0,
                page: $scope.help.imgPage,
                limit: $scope.help.imgLimit
            };
            Album.getImgList(query).$promise.then(function(response) {
                if (response.error == "0") {
                    $scope.images = response.data.list;
                    $scope.help.imgTotal = response.data.total;
                    angular.forEach($scope.images, function(img) {
                        img.per = 100;
                    });
                }
            }, function(response) {
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: response.message || "链接失败",
                    closeable: true
                });
            });
        };

        //删除相册图片
        function deleteImg(id) {
            Confirm.show({
                title: '删除图片',
                content: '是否删除图片',
                ok: function() {
                    Album.deleteImg({ ids: id }).$promise.then(function(response) {
                        if (response.error == "0") {
                            for (var i = 0; i < $scope.images.length; i++) {
                                if (id == $scope.images[i].id) {
                                    $scope.images.splice(i, 1);
                                    break;
                                }
                            }
                            Alert.show({
                                title: '成功',
                                type: 'success',
                                msg: "删除成功",
                                closeable: true
                            });
                        } else {
                            Alert.show({
                                title: '失败',
                                type: 'danger',
                                msg: response.message,
                                closeable: true
                            });
                        }
                    });
                }
            });
        };

        initForm();
        $scope.uploadLogo = uploadLogo;
        $scope.uploadCover = uploadCover;
        $scope.uploadPhotos = uploadPhotos;
        $scope.deleteImg = deleteImg;
        $scope.getImgList = getImgList;
        $scope.submit = submit;
        $scope.formatIndustry = formatIndustry;
        $scope.$state = $state;

        //预约地址
        $scope.address_template = "home/address/address.html";

        //店铺类型，控制预约显示
        $scope.shop_type = $cookies.get('shop_type');

        //店铺封面预览
        $scope.previewCover = function previewCover(file) {
            readImg(file).then(function(data) {
                $scope.form.cover = data;
            }, function() {})

        }

        $scope.applyStatus = function(status) {
            var dic = {
                0: "资料审核中，请耐心等待",
                1: "提交",
                2: "提交"
            };
            return dic[status] || "";
        }

        //店铺申请记录
        $scope.history = applyHistroy({ formatIndustry: formatIndustry });

    }
])

.directive('dyFormDisabled', ['$timeout', function($timeout) {
        return {
            scope: {
                disabled: '=dyFormDisabled'
            },
            link: function(scope, element, attrs) {
                scope.$watch('disabled', function(newval, oldval) {
                    if (newval != oldval) {
                        if (+scope.disabled <= 0) {
                            element[0].querySelectorAll('input,select').forEach(function(item) {
                                item.disabled = true;
                            })
                        } else {
                            element[0].querySelectorAll('input,select').forEach(function(item) {
                                item.disabled = false;
                            })
                        }
                    }
                })
            }
        }
    }])
    .service('applyHistroy', ['ModalService', 'Shop', '$rootScope', '$q', function(ModalService, Shop, $rootScope, $q) {


        return function applyHistroy(opts) {
            var res = angular.extend({}, opts),
                modal = null;

            var scope = $rootScope.$new(false);

            //店铺信息修改申请状态
            function getInfo() {
                Shop.applyInfo(function(response) {

                    if (response && response.error <= 0) {
                        res.apply = response.data.apply;
                        res.apply.status = res.apply.status==undefined?1:res.apply.status;
                        angular.extend(scope, res);
                    } else {
                        ModalService.error((response && response.message) || '服务器错误');
                    }
                });
            }

            getInfo();

            res.show = function show() {
                modal = ModalService.show({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: "home/edit/history.html",
                    scope: scope
                });
            }

            scope.close = function close() {
                ModalService.close(modal);
            }

            return res;
        };

    }])
    .filter('dyPosition', function() {
        return function(input) {
            input = input || [];
            return input.filter(function(item, index, array) {
                return index == array.indexOf(item);
            }).join('');
        }
    })
    .filter('dyApplyStatus', function() {
        return function(input) {
            var dic = {
                0: "资料审核中",
                1: "资料审核通过",
                2: "资料审核未通过"
            };
            return dic[input];
        }
    })
