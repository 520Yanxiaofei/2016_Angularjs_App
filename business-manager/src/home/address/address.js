angular.module('App.Address', []).controller('App.Address.Controller', [
    '$scope',
    '$state',
    'Shop',
    'Alert',
    'Confirm',
    '$timeout',
    'Album',
    '$q',
    '$uibModal',
    function(
        $scope,
        $state,
        Shop,
        Alert,
        Confirm,
        $timeout,
        Album,
        $q,
        $uibModal
    ) {
        
        
        $scope.form={
            area_id: "000000"
        };
        $scope.data={};
        $scope.help={
            position:[],
            itemdefault:['全部省份','全部城市','全部区/县'],
            setdefault :false
        };
        //全选checkbox
        $scope.select_all = false;
        //点击全选checkbox
        $scope.selectAll = function() {
            $scope.select_all = !$scope.select_all;
            for(var item in $scope.data){
                item.checked = $scope.select_all;
            }
        }

        //点击单个checkbox
        $scope.change = function(good) {
            var flag = true;
            good.checked = !good.checked;
            if (good.checked) {
                for (var i = 0; i < $scope.data.length; i++) {
                    if ($scope.data[i].checked == false) {
                        flag = false
                        break;
                    }
                }
                $scope.select_all = flag ? true : false;
            } else {
                $scope.select_all = false;
            }
        }

        // 分页         
        $scope.total = 0; //总共数据条数
        $scope.currentPage = 1; //当前在第几页
        $scope.itemsPerPage = 10; //每页显示的数据条数
        $scope.maxSize = 4; //分页显示的最大页数

        //查询
        function search(params){
            params=params || {};
            params=angular.extend(params,$scope.form);
            params.area_id=params.area_id || "000000";
            angular.forEach(params,function(value,key){
                if (value=="" || value==null || value==undefined ){
                    delete params[key];
                }
            });
            
            params.limit=params.limit || $scope.itemsPerPage;
            params.page=params.page || $scope.currentPage;
            Shop.getServiceAddress(params).$promise.then(function(response){
                if (response.error=="0"){
                    $scope.data=response.data.list;
                    $scope.total=parseInt(response.data.total,10);
                }else{
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message,
                        closeable: true
                    });
                }
            });
        };

        //提示信息
        var resolve=function(response){
            if (response.error=="0"){
                Alert.show({
                    title: '成功',
                    type: 'success',
                    msg: response.message,
                    closeable: true
                });
                return response;
            }else{
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: response.message,
                    closeable: true
                });
                return $q.reject(response);
            };
        };

        var reject=function (response) {
            Alert.show({
                title: '失败',
                type: 'danger',
                msg: "服务器链接失败",
                closeable: true
            });
            return $q.reject(response);
        };

        //添加服务地址
        function add(params){
            return Shop.addServiceAddress(params).$promise.then(resolve,reject);
        }
        //删除服务地址
        function del(params){
            return Shop.delServiceAddress(params).$promise.then(resolve,reject);
        }
        //修改服务地址
        function edit(params){
            return Shop.editServiceAddress(params).$promise.then(resolve,reject);
        }

        //弹窗控制器
        var ModalController = [
            "$scope",
            "$uibModalInstance",
            "$timeout",
            "data",
            "Alert",
            function(
                $scope,
                $uibModalInstance,
                $timeout,
                data,
                Alert
            ) {
                
                $scope.data=data;
                $scope.form={
                    area_id:data.form.area_id || "000000",
                    mobile: data.form.mobile || "",
                    address: data.form.address || "",
                    contacts: data.form.contacts || ""
                };

                //修改
                if (data.action){
                    $scope.form.service_address_id = data.form.id;
                }
                $scope.help={};
                $scope.ok = function() {
                    for(var item in $scope.form){
                        if ($scope.form[item] == ""){
                            Alert.show({
                                title: '失败',
                                type: 'danger',
                                msg: "信息不完整！",
                                closeable: true
                            });

                            return false;
                        }
                    }
                    data.action($scope.form).then(function (data){
                        var item=angular.copy($scope.form);
                        if (data.data){
                            item = angular.extend(item,data.data);
                        }
                        $uibModalInstance.close(item);
                    });
                    
                }
                $scope.cancel = function() {
                    $uibModalInstance.dismiss("cancel")
                }
                   
            }
        ];

        //弹窗
        function show(action,form){
            return $uibModal.open({
                backdrop: 'static',
                animation: true,
                templateUrl: "home/address/address-add.html",
                windowClass: "address-modal",
                controller: ModalController,
                resolve :{
                    data: {
                        modal_title:"新增服务地址",
                        form:form||{},
                        action: action?edit:add
                    }
                }  
            })
        }

        
        //添加
        $scope.add=function (){
            var modal=show();
            modal.result.then(function (data) {
                $scope.data.unshift(data);
            }, function (data) {
                
            })
        };

        //修改
        $scope.edit=function (obj){
            var modal=show(true,obj);
            modal.result.then(function (data) {
                angular.extend(obj,data);
            }, function (data) {
                
            })
        };

        //删除
        $scope.del=function (id){
            if (typeof id == "undefined"){
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: "请选择要删除的地址！",
                    closeable: true
                });
                return false;
            }
            Confirm.show({
                title: '删除地址',
                content: '是否删除地址',
                ok: function() {
                    id=angular.isArray(id) ? id : [id];
                    del({service_address_id:id.join(',')}).then(function(data){
                        angular.forEach(id,function(m){
                            for(var i=$scope.data.length-1;i>=0;i--){
                                if ($scope.data[i].id == m){
                                    $scope.data.splice(i,1);
                                }
                            }
                        });
                    },function (){

                    });
                }
            });
            
        }

        $scope.search=search;
    }
]);