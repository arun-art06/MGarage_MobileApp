define([
    'kendo',
    'text!ordersTemplate'
], function (kendo, ordersTemplate) {
    return kendo.data.ObservableObject.extend({
        orderDataSource: null,

        init: function (listView) {
            var self = this;
            listView.kendoMobileListView({
                template: kendo.template(ordersTemplate)
            });

            kendo.data.ObservableObject.fn.init.apply(self, []);

            //var dataSource = new kendo.data.DataSource({
            //    //transport: {
            //    //    read: {
            //    //        url: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products",
            //    //        dataType: "json"
            //    //    }
            //    //}
            //    type: "odata",
            //    transport: {
            //        read: {
            //            url: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
            //        }
            //    },
            //    sort: {
            //        field: "ProductName",
            //        dir: "desc"
            //    },
            //    serverPaging: true,
            //    serverFiltering: true,
            //    serverSorting: true,
            //    pageSize: 50
            //});
            var dataSource = new kendo.data.DataSource({
                data: [
                    { "ID": "1", "brand": "Audi", "status": "I", "Job": ["Change Type", "Change Oil"], "Date": "31.03.15", "Estimation": "2000 AED" },
                    { "ID": "2", "brand": "Volkswagen", "status": "I", "Job": ["Change Type", "Change Oil"], "Date": "31.03.15", "Estimation": "2000 AED" },
                    { "ID": "3", "brand": "Jaguar", "status": "R", "Job": ["Change Type", "Change Oil"], "Date": "31.03.15", "Estimation": "2000 AED" },
                    { "ID": "4", "brand": "Ford", "status": "R", "Job": ["Change Type", "Change Oil"], "Date": "31.03.15", "Estimation": "2000 AED" },
                    { "ID": "5", "brand": "Audi", "status": "R", "Job": ["Change Type", "Change Oil"], "Date": "31.03.15", "Estimation": "2000 AED" },
                ],
            });

            self.set("orderDataSource", dataSource);
        }
    });
});