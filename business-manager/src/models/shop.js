angular.module("App.Models").factory("Shop", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/seller/shop/:action", {}, {
            getAccount: {
                method: "GET",
                params: {
                    action: "account"
                }
            },
            getInfo: {
                method: "GET",
                params: {
                    action: "info"
                }
            },
            getMyAccount: {
                method: "GET",
                params: {
                    action: "my_account"
                }
            },
            getNotice: {
                method: "GET",
                params: {
                    action: "notice"
                }
            },
            getCategoryInfo: {
                method: "GET",
                params: {
                    action: "category_info"
                }
            },
            addCategory: {
                method: "POST",
                params: {
                    action: "category_add"
                }
            },
            editCategory: {
                method: "POST",
                params: {
                    action: "category_edit"
                }
            },
            getCategoryList: {
                method: "GET",
                params: {
                    action: "category_list"
                }
            },
            editInfo: {
                method: "POST",
                params: {
                    action: "apply"
                }
            },
            getServiceAddress:{
                method: "POST",
                params: {
                    action: "service_address_list"
                }
            },
            addServiceAddress:{
                method: "POST",
                params: {
                    action: "service_address_add"
                }
            },
            delServiceAddress:{
                method: "POST",
                params: {
                    action: "service_address_del"
                }
            },
            editServiceAddress:{
                method: "POST",
                params: {
                    action: "service_address_edit"
                }
            },
            applyInfo:{
                method: "POST",
                params: {
                    action: "apply_info"
                }
            }

        })
    }
])