angular.module('App.Orders.Detail', []).controller('App.Orders.Detail.Controller', [
    '$scope',
    '$state',
    'Orders',
    '$http',
    'OrderNote',
    'Alert',
    '$uibModal',
    function(
        $scope,
        $state,
        Orders,
        $http,
        OrderNote,
        Alert,
        $uibModal
    ) {

        var detail = {},
            ship = {};
        detail.pay_statusText = ['未支付', '部分支付', '已支付'];
        detail.pay_info_type = ['代言币', '颜值分', '红包']; //抵扣方式
        $scope.detail = detail;
        $scope.ship_number = ""; //运单号
        $scope.self_ship_number = ""; //自提码
        $scope.server_number = ""; //填写预约自提码
        $scope.server_ship_number = ""; //预约自提码
        $scope.ship = ship;
        $scope.address = null;
        $scope.isHide = false;
        $scope.isClose = false; //是否已关闭交易
        $scope.isShip = false; //是否已发货
        $scope.isFinish = true; //是否已完成交易
        $scope.toShip = false; //是否物流
        $scope.autoShip = false; //是否自提
        $scope.isServer = false; //是否预约
        $scope.ship_type = ""; //发货类型
        $scope.serverArea = "";
        $scope.serverAdd = "";
        $scope.ships = [
        {
            id: 1,
            title: "韵达快递"
        }, {
            id: 2,
            title: "顺丰快递"
        }, {
            id: 3,
            title: "圆通快递"
        }, {
            id: 4,
            title: "中通快递"
        }, {
            id: 5,
            title: "申通快递"
        }, {
            id: 6,
            title: "邮政快递"
        }, {
            id: 7,
            title: "宅急送"
        }, {
            id: 8,
            title: "天天快递"
        }, {
            id: 9,
            title: "百世快递"
        }, {
            id: 10,
            title: "国通快递"
        }, {
            id: 11,
            title: "EMS"
        }];
        $scope.pay_statusNo = {
            "redPacket": 0,
            "facePoint": 0,
            "faceMoney": 0
        }
        detail.pay_statusNo = $scope.pay_statusNo;
        $scope.form = {
            express_no:"",
            number:""
        };
        $scope.selected = $scope.ships[0];
        $scope.chooseShip = function(ship) {

            $scope.selected.id = ship.id;
            console.log(ship.id);

        }
        //订单状态字典
        $scope.statusEmum={
            0: "未支付",
            1: "已支付",
            2: "已发货",
            3: "交易完成",
            4: "交易关闭"
        };
        $http.get('widgets/city/city.data-3.json').success(function(data) {

            $scope.address = data;
            getData($scope.address);

        }).error(function(data) {

        });

        function getData(add) {
            Orders.getDetail({
                id: $state.params.id
            }).$promise.then(function(response) {

                console.log(response);
                var data = null;

                if (response.error == "0") {
                    data = response.data;
                    detail = angular.extend(detail,data);
                    detail.mobile = data.mobile; //买家电话
                    detail.order_id = data.goods_info[0].order_id; //订单标识
                    detail.shop_id = data.shop_id; //店铺id
                    detail.mobile = data.mobile; //买家电话
                    detail.title = data.goods_info[0].title; //宝贝标题 
                    detail.image = data.goods_info[0].image; //宝贝图片 
                    detail.pay_status = data.pay_status; //宝贝状态
                    detail.price = data.goods_info[0].price; //商品单价
                    detail.quantity = data.goods_info[0].quantity; //商品数量
                    detail.total_fee = Number(data.total_fee); //商品总价
                    detail.ship_fee = Number(data.ship_fee); //商品运费
                    detail.pay_info = data.pay_info; //抵扣信息
                    detail.remark = data.remark;
                    detail.ship_time = +data.ship_time;
                    detail.pay_time = +data.pay_time;
                    detail.receipt_time = +data.receipt_time;

                    var selectedTypeList = []
                    angular.forEach(data.goods_info[0].attrbute_value ,function(attrbute){
                        selectedTypeList.push(attrbute.value)
                    })
                    detail.selectedType = selectedTypeList.join("、")//商品属性

                    if (detail.pay_info && detail.pay_info != "") {
                        for (var i = 0; i < detail.pay_info.length; i++) {
                            if (detail.pay_info[i].type == 2) {
                                $scope.pay_statusNo.faceMoney = detail.pay_info[i].money;
                            }
                            if (detail.pay_info[i].type == 3) {
                                $scope.pay_statusNo.facePoint = detail.pay_info[i].money;
                            }
                            if (detail.pay_info[i].type == 4) {
                                $scope.pay_statusNo.redPacket = detail.pay_info[i].money;
                            }
                        }
                    } else {
                        $scope.pay_statusNo.facePoint = 0;
                    }
                    detail.pay_list_count = 0;
                    angular.forEach(detail.pay_statusNo,function (val) {
                        detail.pay_list_count += parseInt(val)
                    })
                    detail.actual_fee = Number(data.goods_fee) + Number(data.ship_fee); //实收款

                    if (data.address){
                        detail.position = getAddress(add, data.address.area_id) || [];
                        detail.position = detail.position.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });
                        detail.position = detail.position.join('');
                        detail.address.address = detail.position + data.address.address; //详细地址
                    }

                    if (data.service_address){
                        detail.position = getAddress(add, data.service_address.area_id) || [];
                        detail.position = detail.position.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });
                        detail.position = detail.position.join('');
                        detail.service_address.address = detail.position + data.service_address.address; //详细地址
                    }

                    if (data.pick_adress){
                        detail.position = getAddress(add, data.pick_area_id) || [];console.log(detail.position)
                        detail.position = detail.position.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });
                        detail.position = detail.position.join('');
                        detail.pick_adress = detail.position + data.pick_adress; //详细地址
                    }
                    
                    detail.nick_name = data.nick_name;              //买家昵称
                    detail.number = data.number;                            //订单编号
                    detail.create_time = data.create_time;                  //创建时间
                    detail.isShip = data.ship_status == 0 ? true : false;
                    detail.status = data.status;
                    $scope.ship_type = data.ship_type;
                    //订单交易状态
                    if (detail.status == 0 || detail.status == 1) {
                        if (data.ship_type == 1) { //物流
                            $scope.toShip = true;
                            $scope.autoShip = false;
                            $scope.isServer = false;
                        } else if (data.ship_type == 2) { //自提
                            $scope.toShip = false;
                            $scope.autoShip = true;
                            $scope.isServer = false;
                        } else if (data.ship_type == 4) { //预约服务
                            $scope.toShip = false;
                            $scope.isServer = true;
                            $scope.autoShip = false;
                            $scope.serverArea = getAddress($scope.address, data.service_address.area_id).join("") || [];
                            $scope.serverAdd = data.service_address.address;
                            $scope.server_ship_number = data.pick_info.number;
                        }
                        $scope.isHide = false;
                        $scope.isFinish = false;
                    }
                    if (detail.status == 2) {
                        $scope.isClose = false;
                        $scope.isFinish = false;
                        $scope.isShip = true;
                        $scope.toShip = $scope.autoShip = false;
                        $scope.isHide = true;
                    }
                    if (detail.status == 3) {
                        $scope.isFinish = true;
                        $scope.isClose = false;
                        $scope.isShip = false;
                        $scope.toShip = $scope.autoShip = false;
                        $scope.isHide = true;
                        if (data.ship_type == 4) {
                            $scope.isHide = false;
                            $scope.serverArea = getAddress($scope.address, data.service_address.area_id).join("") || [];
                            $scope.serverAdd = data.service_address.address;
                            $scope.server_ship_number = data.pick_info.number;
                            console.log($scope.server_ship_number);
                        }
                    }
                    if (detail.status == 4) {
                        $scope.isClose = true;
                        $scope.isFinish = false;
                        $scope.isShip = false;
                        $scope.toShip = $scope.autoShip = false;
                        $scope.isHide = true;
                    }
                    if (detail.pay_status == 0) {
                        $scope.isHide = true;
                    }
                    
                    // 物流发货
                    ship.deliverGoods = function(num){
                        Orders.getShip({

                            order_id: detail.order_id,
                            shop_id: detail.shop_id,
                            express_id: detail.ship_info.express_id,
                            express_no:num

                        }).$promise.then(function(data) {

                            // console.log("运单号：" + $scope.ship_number);
                            if (data.error == "4040303") {
                                msg("请选择快递！");
                                return;
                            }
                            if (num == "") {
                                msg("运单号不能为空！");
                                return;
                            }
                            if (data.error == "0") {
                                msg(data.message,1);
                                $state.go("orders.unsigned");
                            } else {
                                msg(data.message);
                            }

                        });

                    }

                    // 预约验证
                    ship.serverNo = function(num){

                        if( num == "" ){
                            msg("预约码不能为空！");
                            return;
                        }

                        Orders.selfShip({

                            order_id: detail.order_id,
                            shop_id: detail.shop_id,
                            number: num,
                            ship_type: $scope.ship_type

                        }).$promise.then(function(data) {
                            console.log(data);
                            if (data.error > 0) {
                                msg(data.message);
                                return;
                            }
                            msg(data.message,1);
                            $state.go("orders.completed");
                        });

                    }

                } else {

                    msg(response.message);

                }
            });

        }

        // 自提验证
        ship.testingNo = function(num) {

            if (num == "") {
                msg("自提码不能为空！");
                return;
            }

            Orders.selfShip({
                order_id: detail.order_id,
                shop_id: detail.shop_id,
                number: num,
                ship_type: $scope.ship_type
            }).$promise.then(function(data) {
                console.log(data);
                if (data.error > 0) {
                    msg(data.message);
                    return;
                }
                msg(data.message,1);
                $state.go("orders.completed");
            });

        }

        //根据地址id取省市县
        function getAddress(data, value) {
            var temId, result, parent;
            var id = parseInt(value, 10);
            result = [];
            for (var i = 0; i < data.length; i++) {
                temId = parseInt(data[i].value, 10);
                if (temId == id) {
                    result = result.concat(data[i].text);
                    break;
                } else if (Math.abs(temId - id) < 10000 && data[i].children) {
                    parent = data[i].text;
                    result = getAddress(data[i].children, value);
                    if (result.length > 0) {

                        result.unshift(parent);
                        break;
                    }
                }
            }
            return result;
        }

        //订单备注
        $scope.order_note = OrderNote($state.params.id);

        function msg(str,flag){
            Alert.show({
                title: flag?'成功':'失败',
                type: flag?'success':'danger',
                msg: str,
                closeable: true
            });
        }
        $scope.changePrice = function (item) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'change-price.html',
                controller: 'changePrice',
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                console.log(result);
            })
        }

    }
])
.service('OrderNote',['ModalService','Orders','Alert',function (ModalService,Orders,Alert){
    
    function service(id){
        this.model = {
            remark: '',
            order_id:''
        };
        this.state = {
            editing:false
        };
        
        this.model.order_id = id;
    }
    
    service.prototype = {
        save: function (data){
            var that = this;
            if (data.remark && data.remark.length>100){
                Alert.show({
                    title: '失败',
                    type: 'danger',
                    msg: '备注不能超过100个字！',
                    closeable: true
                });
                return false;
            }
            ModalService.action(Orders.setRemark,angular.extend(that.model,data),function (){
                that.state.editing = false;
            });
        },
        edit: function(){
            this.state.editing = true;
        },
        isEditing: function(){
            return this.state.editing;
        }
    }

    return function OrderNote(id){
        return new service(id);
    };
}]).controller('changePrice', [
    '$scope',
    'Goods',
    '$uibModalInstance',
    'item',
    'Alert',
    'Orders',
    function ($scope, Goods, $uibModalInstance, item, Alert, Orders) {
        $scope.item = item;
        $scope.type = '1';
        $scope.price = '0.00';
        var ship_fee = item.ship_fee / 100 || 0;
        $scope.ship_fee = ship_fee ? ship_fee.toFixed(2) : '0';
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        $scope.new_goods_fee = parseInt(item.total_fee) - parseInt(item.ship_fee);
        $scope.new_ship_fee = parseInt(item.ship_fee);
        $scope.discount_fee = $scope.new_goods_fee - parseInt(item.goods_fee);
        $scope.pay_fee = $scope.new_goods_fee + $scope.new_ship_fee - $scope.discount_fee;
        $scope.viewPrice = function () {
            var price = parseFloat($scope.price) * 100 || 0;
            if ($scope.type == '1') {
                $scope.new_goods_fee = parseInt(item.total_fee) - parseInt(item.ship_fee) - price;
            }
            if ($scope.type == '2') {
                $scope.new_goods_fee = parseInt(item.total_fee) - parseInt(item.ship_fee) + price;
            }
            $scope.new_ship_fee = parseFloat($scope.ship_fee) * 100;
            $scope.pay_fee = $scope.new_goods_fee + $scope.new_ship_fee - $scope.discount_fee;
            if($scope.pay_fee - $scope.new_ship_fee < 1){
                $scope.price = '0.00';
                var ship_fee = item.ship_fee / 100 || 0;
                $scope.ship_fee = ship_fee ? ship_fee.toFixed(2) : '0';
                $scope.new_goods_fee = parseInt(item.total_fee) - parseInt(item.ship_fee);
                $scope.new_ship_fee = parseInt(item.ship_fee);
                $scope.discount_fee = $scope.new_goods_fee - parseInt(item.goods_fee);
                $scope.pay_fee = $scope.new_goods_fee + $scope.new_ship_fee - $scope.discount_fee;
            }

        }
        $scope.ok = function () {
            var goods_fee = parseInt(item.goods_fee) / 100;
            if ($scope.type == '1') {
                goods_fee = goods_fee - parseFloat($scope.price);
            }
            if ($scope.type == '2') {
                goods_fee = goods_fee + parseFloat($scope.price);
            }
            Orders.changePrice({
                'order_id': item.id,
                'goods_fee': goods_fee,
                'ship_fee': $scope.ship_fee,
            }).$promise.then(function (response) {
                if (response.error == "0") {
                    item.actual_fee = $scope.pay_fee;
                    item.ship_fee = $scope.new_ship_fee;
                    item.total_fee = item.total_fee - parseFloat($scope.price) * 100;
                    $uibModalInstance.dismiss('cancel');
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

    }
])