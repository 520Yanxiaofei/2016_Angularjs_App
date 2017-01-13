angular.module("App.User.MerchantInformation", []).controller("App.User.MerchantInformation.Controller", [
    "$scope",
    "$state",
    "Member",
    "Shop",
    "$ionicPopup",
    "$http",
    "Loading",
    function(
        $scope,
        $state,
        Member,
        Shop,
        $ionicPopup,
        $http,
        Loading
    ) {
        var form = {
            title: "",
            area_id: "000000",
            address: "",
            mobile: "",
            contact: "",
            industry_id: "",
            logo: ""
        };

        $scope.editInfo = $state.params;    // 0：第一次填写入驻信息  1：重新编辑入驻信息  2:入驻成功之后重新修改入驻信息
        $scope.form = form;
        $scope.logo = [];
        $scope.newLogo = [];
        $scope.industries = [];
        $scope.mutiIndustry = {};
        $scope.isActive = 0;
        $scope.haveLogo = false;
        $scope.isSavePay = true;   // 保存并支付入驻费用
        $scope.isSave = false;      // 入驻成功后保存修改
        $scope.notPassSave = false;  // 客服驳回之后重新提交
        $scope.apply_id = 0;        // 申请标识id
        $scope.urlStatus = 0;        // 申请标识id
        var obj = {};

        if( $scope.editInfo.type == 1 ){
            $scope.haveLogo = true;
            Member.getMemberApplyStatus().$promise.then(function(data){
                console.log(data);
                $scope.urlStatus = data.apply.status;
                $scope.form.id = data.apply.id;
                if( data.apply.status == 2 ){
                    $scope.notPassSave = true;
                    $scope.isSavePay = false;
                    $scope.isSave = false;
                }else {
                    $scope.notPassSave = false;
                    $scope.isSavePay = true;
                    $scope.isSave = false;
                }
                getData(data);
            });
        }
        if( $scope.editInfo.type == 2 ){
            $scope.haveLogo = true;
            $scope.isSavePay = false;
            $scope.isSave = true;
            Member.getMemberEditStatus().$promise.then(function(data){
                if( !data.apply.title || data.apply.title == "" ){
                     Member.getMemberApplyStatus().$promise.then(function(data){
                        getData(data);
                     }, function(error){
                        console.log(error);
                     })
                }
                getData(data);
            });
        }

        // 获取数据
        function getData(data){
            $scope.form.title = data.apply.title;
            $scope.form.area_id = "000000";
            $scope.form.address = data.apply.address;
            $scope.form.mobile = data.apply.mobile;
            $scope.form.contact = data.apply.contact;
            $scope.form.industry_id = data.apply.industry_id;
            $scope.form.newLogo = data.apply.logo;
            $scope.form.area_id = data.apply.area_id;
            $scope.isActive = data.apply.shop_type;
            $scope.mutiIndustry = industry(data.apply.industry);
            $scope.apply_id = data.apply.id;
            $scope.newLogo = data.apply.logo.split("/");
            for( var i=3; i<$scope.newLogo.length; i++ ){
                $scope.logo.push($scope.newLogo[i]);
            }
            $scope.form.logo = $scope.logo.join("/");
        }

        // 获取所属行业
        function industry(data){
            for( var i=0; i<data.length; i++ ){
                obj[data[i].id] = true;
            }
            return obj; 
        }

        $scope.storeType = function(type){
            $scope.isActive = type;
        }

        $scope.submit = function submit() {
            var error = 0,
                industrys = [];
            angular.forEach($scope.mutiIndustry, function(val, key) {
                if (val) {
                    industrys.push(key);
                }
            });
            var category_id = industrys.join(",");
            console.log(category_id);
            form.industry_id = category_id;
            //验证表单
            angular.forEach(form, function(val, key) {
                if (!val) {
                    error = 1;
                }
            });

            if (error) {
                showMsg({
                    content: "表单信息不完整！"
                });
                return false;
            }

            //最多可选3个行业
            if (category_id.split(",").length>3){
                showMsg({
                    content: "所属行业最多可选3个！"
                });
                return false;
            };

            Loading.show();
            if( $scope.editInfo.type == 1 ){
                Member.postReApply(form).$promise.then(function(data) {
                    Loading.hide();
                    if( $scope.urlStatus == 2 ){
                        $state.go('user.information-check');
                    }else {
                        $state.go('user.join-pay');
                    }
                }, function(response) {
                    Loading.hide();
                    showMsg({
                        content: (response.data && response.data.message)
                    })
                });
            }else if( $scope.editInfo.type == 2 ){
                Member.getMemberEditApply(form).$promise.then(function(data) {
                    console.log(data);
                    Loading.hide();
                    $state.go('user.information-check');
                }, function(response) {
                    Loading.hide();
                    showMsg({
                        content: (response.data && response.data.message)
                    })
                });
            }else {
                Member.postApply(form).$promise.then(function(data) {
                    console.log(data);
                    Loading.hide();
                    $state.go('user.join-pay');
                }, function(response) {
                    Loading.hide();
                    showMsg({
                        content: (response.data && response.data.message)
                    })
                });
            }
            // $state.go("user.join-pay", {

            // });
        };

        //弹窗提示
        function showMsg(msg) {
            var popup;
            msg = msg || {};
            popup = $ionicPopup.alert({
                title: msg.title || "错误",
                template: msg.content || "服务器错误！"
            });
        };

        //获取一级行业分类
        function getTopIndustry() {
            Shop.getTopIndustry().$promise.then(function(data) {
                $scope.industries = data;
            }, function(response) {
                showMsg({
                    content: response.message
                });
            })
        };

        //上传logo
        $scope.uploadLogo = function uploadLogo(elm) {
            var imgObjPreview;
            imgObjPreview = angular.element(elm).parent();
            Loading.show();

            function dataURLtoBlob(dataurl) {
                var arr   = dataurl.split(','),
                    mime  = arr[0].match(/:(.*?);/)[1],
                    bstr  = atob(arr[1]),
                    n     = bstr.length,
                    u8arr = new Uint8Array(n);

                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type:mime});
            }

            //压缩图片
            function zipimg(callback) {
                if (!(elm.files && elm.files[0])) return;

                var img = new Image();

                img.onload = function(){
                    var canvas  = document.createElement('canvas');
                    var context = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    callback(canvas.toDataURL('image/jpeg' , 0.5));
                };

                var reader = new FileReader();
                reader.onload = function(e) {
                    img.src = e.target.result;
                }
                reader.readAsDataURL(elm.files[0]);
            }

            function preview(imgurl) {
                imgObjPreview.css('backgroundImage', 'url(' + imgurl + ')');
            }

            function post(imgurl) {
                var url = config.API_ROOT + '/mall/member/shop_logo_upload';
                var formdata = new FormData();

                formdata.append('image', dataURLtoBlob(imgurl));

                var xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.withCredentials = true;
                if(window.DYW_AUTHENTICATION){
                    xhr.setRequestHeader('X-Dyw-Authentication', window.DYW_AUTHENTICATION);
                }
                xhr.onload = function() {
                    var result;
                    try {
                        result = angular.fromJson(this.responseText);
                    } catch (e) {
                        result = {};
                    }
                    if (result.error == "0") {
                        form.logo = result.data.logo;
                        $scope.haveLogo = false;
                        Loading.hide({
                            type: "success",
                            title: "上传成功"
                        });
                    } else {
                        showMsg({
                            title: "上传失败",
                            content: result.message
                        });
                        Loading.hide();
                    }

                };
                xhr.onerror = function(){
                    showMsg({
                        title: "上传失败",
                        content: "未知错误"
                    });
                    Loading.hide();
                };
                xhr.ontimeout = function(){
                    showMsg({
                        title: "上传失败",
                        content: "上传图片服务器超时"
                    });
                    Loading.hide();
                    $scope.haveLogo = false;
                }
                xhr.send(formdata);
            }

            zipimg(function(imgurl){
                preview(imgurl);
                post(imgurl);
            });
        }

        getTopIndustry();

    }
]);
