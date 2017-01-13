angular.module('App.Goods.Add', []).controller('App.Goods.Add.Controller', [
    '$scope',
    '$state',
    'Category',
    'Goods',
    '$timeout',
    'Alert',
    function(
        $scope,
        $state,
        Category,
        Goods,
        $timeout,
        Alert
    ) {
        var form,help;
        $scope.brands=[];
        $scope.parentCates=[];
        $scope.subCates=[];
        $scope.mycates=[];

        form={
            brand_id:"",
            category_id:"",
            shop_category_id:"0",
            title:""
        };
    
        $scope.parentCate_id="";
        $scope.submitName="发布新品";
        $scope.form=form;

        $scope.help=help={
            submiting : false
        };

        //初始化表单
        function initForm(){
            if ($state.params.id){
                Goods.getDetial({id:$state.params.id}).$promise.then(function(response){
                    var data,cats;
                    if (response.error=="0"){
                        data=response.data.goods;
                        cats=data.category;
                        form.brand_id=cats[0].brand_id;
                        form.category_id=cats[1].category_id;
                        form.shop_category_id=cats[2].shop_category_id;
                        form.title=data.title;
                        $scope.parentCate_id=cats[1].category_pid=="0"?cats[1].category_id:cats[1].category_pid;
                        getBrands();
                        getParentCates(true);
                        getMyCates();
                    }
                });
                $scope.submitName="提交修改";
            }else{
                $scope.submitName="发布新品";
                getBrands();
                getParentCates();
                getMyCates();
            }

        };
        
        //提交表单
        function submit(){
            if (form.brand_id==""){
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '请选择品牌',
                    closeable: false
                });
            }
            if(form.shop_category_id==""&&form.category_id==""){
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '请选择商品分类！',
                    closeable: false
                });
                return false;
            }
            if (form.brand_id==""){
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '请输入产品名称！',
                    closeable: false
                });
                return false;
            }
            form.category_id=form.category_id||$scope.parentCate_id;
            help.submiting=true;
            if ($state.params.id){
                form.id=$state.params.id;
                Goods.edit(form).$promise.then(function(response){
                    help.submiting=false;
                    if (response.error == "0") {
                        Alert.show({
                            title: '成功',
                            type: 'success',
                            msg: response.message,
                            closeable: true
                        });
                        $state.go('goods.editDetial',{id:form.id});
                    }else{
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: response.message,
                            closeable: false
                        });
                    }
                });
            }else{
                Goods.createGood(form).$promise.then(function(response){
                    help.submiting=false;
                    if (response.error == "0") {
                        Alert.show({
                            title: '成功',
                            type: 'success',
                            msg: response.message,
                            closeable: true
                        });
                        $state.go('goods.publish',{id:response.data.id});
                    }else{
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: response.message,
                            closeable: false
                        });
                    }
                });

            }
            
        };

        //获取所有品牌
        function getBrands(){
            Category.getBrand({status:1}).$promise.then(function(response) {
                if (response.error == "0") {
                    $scope.brands=response.data.list;
                    form.brand_id=form.brand_id||$scope.brands[0].id; 
                }else{
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message,
                        closeable: false
                    });
                }
            });
        };
        
        //获取某品牌的大分类
        function getParentCates(flag){
           
            Category.getSysCategory({status:1}).$promise.then(function(response){
                if (response.error=="0"){
                    if (response.data.list.length>0){
                        $scope.parentCates=response.data.list;
                        $scope.parentCate_id=$scope.parentCate_id||$scope.parentCates[0].id;
                        getSubCates($scope.parentCate_id,flag);
                    }else{
                        $scope.parentCates=[];
                        $scope.subCates=[];
                        $scope.parentCate_id="";
                        form.category_id="";
                    } 
                }else{ 
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message,
                        closeable: false
                    });
                }
            });

        };

        //获取某分类的子分类
        function getSubCates(id,flag){

            id=id||$scope.parentCate_id;
            if (id){
                Category.getSysCategory({status:1,pid:id}).$promise.then(function(response){
                    $scope.subCates=[];
                    if (response.error=="0"){
                        if (response.data.list.length>0){
                            $scope.subCates=response.data.list;
                            $scope.parentCate_id=$scope.parentCate_id||$scope.parentCates[0].id;
                            if (flag&&$state.params.id){
                                form.category_id=form.category_id||$scope.subCates[0].id;
                            }else{
                                form.category_id=$scope.subCates[0].id;
                            }
                            
                        }else{
                            $scope.subCates=[];
                            form.category_id="";
                        }
                    }else{
                        Alert.show({
                            title: '失败',
                            type: 'danger',
                            msg: response.message,
                            closeable: false
                        });
                    }
                });
            }else{
                $timeout(function setDefaultModel(){
                    form.brand_id=form.brand_id||$scope.brands[0].id;
                    $scope.parentCate_id=$scope.parentCate_id||$scope.parentCates[0].id;
                    
                },0)
                
            }
        };
        
        //获取自定义分类
        function getMyCates(){
            Category.getCategory({}).$promise.then(function(response){
                if (response.error=="0"){
                    $scope.myCates=response.data; 
                }else{
                    Alert.show({
                        title: '失败',
                        type: 'danger',
                        msg: response.message,
                        closeable: false
                    });
                }
            });
        };

        //获取所有选择的分类
        function getCategories(){
            var str='',i;
            if ($scope.brands){
                for(i=0;i<$scope.brands.length;i++){
                    if ($scope.brands[i].id==form.brand_id){
                        str+=$scope.brands[i].title;
                        break;
                    }
                }
            }
            if ($scope.parentCates){
                for(i=0;i<$scope.parentCates.length;i++){
                    if ($scope.parentCates[i].id==$scope.parentCate_id||$scope.parentCates[i].id==form.category_id){
                        str+=' > '+$scope.parentCates[i].title;
                        break;
                    }
                }
            }
            if ($scope.subCates){
                for(i=0;i<$scope.subCates.length;i++){
                    if ($scope.subCates[i].id==form.category_id){
                        str+=' > '+$scope.subCates[i].title;
                        break;
                    }
                }
            }
            return str;
        };
        
        $scope.getBrands=getBrands;
        $scope.getParentCates=getParentCates;
        $scope.getSubCates=getSubCates;
        $scope.submit=submit;
        $scope.initForm=initForm;
        $scope.getCategories=getCategories;
        
        $scope.initForm();
    }
]);
