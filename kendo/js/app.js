define([
    'kendo',
    './app/Garage/GarageViewModel',
    './app/Customer/CustomerViewModel',
    './app/Orders/OrdersViewModel',
], function (kendo, garageViewModel, customerViewModel, ordersViewModel) {
    var os = kendo.support.mobileOS;
    var statusBarStyle = os.ios && os.flatVersion >= 700 ? "black-translucent" : "black";
    var customerList = [];
    return {
        kendoApp : null,
        garageService : {
            viewModel: null
        },
        customerService: {
            viewModel: null
        },
        ordersService: {
            viewModel: null
        },
        init: function () {
            this.kendoApp = new kendo.mobile.Application(document.body, { layout: "layout", statusBarStyle: statusBarStyle });
            loadInGarage();
        },
        loadCustomer: function (e) {
                app.customerService.viewModel = new customerViewModel($("#customer"));
                kendo.bind($("#customerView"), app.customerService.viewModel);
                customerList = app.customerService.viewModel.customerDataSource;
        },
        loadInGarage: function (e) {
            app.garageService.viewModel = new garageViewModel($("#garage"));
        },
        loadOrder: function (e) {
            this.ordersService.viewModel = new ordersViewModel($("#order"));
            kendo.bind($("#ordersView"), this.ordersService.viewModel);
        },

        getSelectedCustomer: function (customerid) {
            debugger;
            var selectedcustomer;
            app.customerService.viewModel = new customerViewModel($("#customer"));
            for (var i = 0; i < customerList._data.length; i++) {
                if (customerid == customerList._data[i].id) {
                    selectedcustomer = customerList._data[i];
                    break;
                }
            }

            return selectedcustomer;
        }
    };
});