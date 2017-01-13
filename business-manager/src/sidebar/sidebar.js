angular.module("App.Sidebar", []).controller("App.Sidebar.Controller", [
    "$scope",
    "$state",
    "$uibModal",
    "User",
    "$cookies",
    "Confirm",
    "Prompt",
    "$http",
    function(
        $scope,
        $state,
        $uibModal,
        User,
        $cookies,
        Confirm,
        Prompt,
        $http
    ) {         
        //登出操作
        $scope.logout = function() {
            Confirm.show({
                title: '登出',
                content: '是否确认登出系统',
                ok: function() {
                    $http.post(config.API_ROOT+'/seller/login/logout',{
                        withCredentials: true,
                        crossDomain:true
                    }).success(function(){
                        $cookies.remove('is_login',{path: '/'});
                        window.location.href = "login.html";
                    }).error(function(resonse){
                        //alert(resonse.message);
                        console.log(response);
                    });
                    
                }
            })
        };

        $scope.$state = $state;
        //商品管理
        $scope.goods = {
            status: false
        };
        //订单管理
        $scope.orders = {
            status: false
        };
        //财务管理
        $scope.financia = {
            status: false
        };
        //售后管理
        $scope.customer = {
            status: false
        };
        //仓储管理
        $scope.warehouse = {
            status: false
        };

        $scope.status = false;
        $scope.change = function(item) {
            $scope.status = !$scope.status; //箭头切换方向
            switch (item) {
                case "goods":
                    $scope.goods.status = !$scope.goods.status;
                    break;
                case "orders":
                    $scope.orders.status = !$scope.orders.status;
                    break;
                case "financia":
                    $scope.financia.status = !$scope.financia.status;
                    break;
                case "customer":
                    $scope.customer.status = !$scope.customer.status;
                    break;
                case "warehouse":
                    $scope.warehouse.status = !$scope.warehouse.status;
                    break;
            }
            save();
        }

        //保存菜单打开状态
        function save(){
            var obj;
            obj={
                goods: !!$scope.goods.status,
                orders: !!$scope.orders.status,
                financia: !!$scope.financia.status,
                customer: !!$scope.customer.status,
                warehouse: !!$scope.warehouse.status
            };

            if (sessionStorage){
                sessionStorage.menu = angular.toJson(obj);
            }
        }   

        //获取菜单打开状态
        function get(){
            var obj;
            if (sessionStorage && sessionStorage.menu){
                obj = angular.fromJson(sessionStorage.menu);
            }
            if (typeof obj == "object"){
                $scope.goods.status = !!obj.goods;
                $scope.orders.status = !!obj.orders;
                $scope.financia.status = !!obj.financia;
                $scope.customer.status = !!obj.customer;
                $scope.warehouse.status = !!obj.warehouse;
            }
        }

        get();

        $scope.user = User.getUserInfo();
    }
]);


