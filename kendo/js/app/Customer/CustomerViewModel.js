define([
    'kendo',
    'text!customerTemplate'
], function (kendo, customerTemplate) {
    return kendo.data.ObservableObject.extend({
        customerDataSource: null,

        init: function (listView) {
            var self = this;
            console.log("customer template");
            listView.kendoMobileListView({
                template: kendo.template(customerTemplate)
            });
            kendo.data.ObservableObject.fn.init.apply(self, []);
            var dataSource = new kendo.data.DataSource({
                transport: {
                        read: {
                            url: "http://192.168.2.17:8069/openacademy/OpenacademyCustomer/list/",
                            dataType: "json"
                        }
                    }               
            });

            self.set("customerDataSource", dataSource);
        }
    });
});