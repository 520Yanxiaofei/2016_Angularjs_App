angular.module('App.financia.settlement', []).controller('settlementCtrl', [
        '$scope',
        '$state',
        'FinanciaService',
        'Alert',
        function(
            $scope,
            $state,
            FinanciaService,
            Alert
        ) {
            //当前结算方式 
            var cate = $scope.cate = $state.current.name;

            //设置结算方式
            FinanciaService.setType(cate);

            // 结算明细等
            $scope.info = FinanciaService.info; 

            // 账户信息
            $scope.amount = FinanciaService.getMyAccount();

            // 结算类型信息
            var category = FinanciaService.getCategory();

            // 结算标题
            $scope.title = category.title || "";
                
            //一键提取
            $scope.extract = FinanciaService.extract;

            //查询
            $scope.list = FinanciaService.list;


            //分页
            $scope.page = FinanciaService.page;

            //标签状态
            $scope.status = 1;

            //订单号
            $scope.order_number = "";

            //初始化页面查询
            $scope.list({status : $scope.status});

            //查询按钮
            $scope.serch = function (argument) {
                 if(!argument.order_number){
                    Alert.show({
                        title: '错误',
                        type: 'danger',
                        msg: "请输入订单号",
                        closeable: true
                    });
                    return
                 }
                argument.status= $scope.status

                 FinanciaService.list(argument)
            }
                


            //查询重置选项卡
            // $scope.$watch('info.list[0]',function (newval,oldval){
            //     if (newval && newval!==oldval ){
            //         $scope.status = +newval.status;
            //     } 
            // })
        }
    ])
    .factory('FinanciaService', ['Financia', 'Shop', 'Alert','$q', function(Financia, Shop, Alert,$q) {
        
        var model = {
            info: {
                list:[],
                totalItems:0
            },
            page: {
                totalItems : 0,
                currentPage : 1,
                itemsPerPage : 10,
                maxSize : 4
            },
            amount:{
                "financia.settlement": {
                    expert: "￥0",
                    settled: "￥0",
                    extractable: "￥0",
                    extracted: "￥0"
                },
                "financia.integral": {
                    expert: 0,
                    settled: 0,
                    extractable: 0,
                    extracted:0
                },
                "financia.gold": {
                    expert: 0,
                    settled: 0,
                    extractable: 0,
                    extracted:0
                }
            },
            category:{
                "financia.settlement": {
                    list : "lists",
                    extract: "extract",
                    title: "金额"
                },
                "financia.integral": {
                    list : "integralList",
                    extract: "integralExtract",
                    title: "颜值分"  
                },
                "financia.gold": {
                    list : "goldList",
                    extract: "goldExtract",
                    title: "代言币",      
                }
            },
            // 结算类型
            type: "financia.settlement",
            // 选择结算类型
            setType: function changeType(type){
                model.type = type;
            },
            // 获取某个结算类型的对应的操作
            getAction: function getAction(action){
                return model.category[model.type] && model.category[model.type][action];
            },
            // 获取结算类型信息
            getCategory: function getCategory(){
                return model.category[model.type];
            },

            // 取账号信息
            getMyAccount: function getMyAccount(resolve,reject) {
                model.action({
                    resource: Shop,
                    action: "getMyAccount",
                    params: {},
                    resolve: function (response){
                        var info = response.data;

                        var amount = {
                            "financia.settlement": {
                                expert: "￥"+(info.expected_amout.amount/100),
                                settled: "￥"+(info.settlement_amout.amount/100),
                                extractable: "￥"+(info.money.amount/100),
                                extracted: "￥"+(info.total.amount/100)
                            },
                            "financia.integral": {
                                expert: info.expected_amout.integral,
                                settled: info.settlement_amout.integral,
                                extractable: info.money.integral,
                                extracted:info.total.integral
                            },
                            "financia.gold": {
                                expert: info.expected_amout.gold/100,
                                settled: info.settlement_amout.gold/100,
                                extractable: info.money.gold/100,
                                extracted:info.total.gold/100
                            }
                        };

                        for(var x in model.amount){
                            model.amount[x] = angular.extend(model.amount[x],amount[x]);
                        }
                        
                        model.info = angular.extend(model.info,response.data);
                        return resolve && resolve(model.info) || response;
                    },
                    reject: function (response){
                        return reject && reject(response) || $q.reject(response);
                    }
                });
                return model.amount[model.type];
            },
            // 一键提取
            extract: function extract(params,resolve,reject) {
                // 发起提现
                var promise = model.action({
                    resource: Financia,
                    action: model.getAction('extract'),
                    params: {},
                    resolve: resolve,
                    reject: reject
                });
                // 重新获取财务信息
                promise.then(function (response){
                    model.getMyAccount();
                })
            },
            // 财务明细列表
            list: function (params,resolve,reject){

                model.action({
                    resource: Financia,
                    action: model.getAction('list'),
                    params: angular.extend({page:model.page.currentPage,limit:model.page.itemsPerPage},params),
                    resolve: function (response){
                        model.info.list = response.data.list;
                        model.page.totalItems = parseInt(response.data.total,10);
                        //model.page.currentPage = 1;
                        return resolve && resolve(model.info) || response;
                    },
                    reject: function (response){
                        model.msg(response.message);
                        return reject && reject(response) || $q.reject(response);
                    }
                });
            },
            // crud事件代理
            action: function(def) {
                var resource_action, promise;
                def = def || {};
                if (!def.resource && !def.action) {
                    return $q.reject({message:"invalid"});
                }
                resource_action = def.resource[def.action];
                if (!resource_action) {
                    return $q.reject({message:"invalid"});
                }
                promise = resource_action(def.params || {});
                promise.$promise
                .then(function (response){
                    if (response.error != 0){
                        return $q.reject(response);
                    }
                    return response;
                },function (response){
                    return $q.reject(response);
                })
                .then(def.resolve, def.reject)
                .then(function(data) {

                }, function(error) {
                    model.msg(error.message)
                });
                return promise.$promise;
            },
            // crud反馈
            msg: function(data) {
                Alert.show({
                    title: '错误',
                    type: 'danger',
                    msg: data || "服务器错误！",
                    closeable: true
                });
            }
        };
        return model;
    }])
