define([
    'kendo',
    'text!garageTemplate'
], function (kendo, garageTemplate) {
    return kendo.data.ObservableObject.extend({
        garageDataSource: null,
        init: function (listView) {
            var self = this;
            listView.kendoMobileListView({
                template: kendo.template(garageTemplate)
            });

            kendo.data.ObservableObject.fn.init.apply(self, []);
            var baseImageUrl = "http://192.168.2.14:8201"
            var dataSource = new kendo.data.DataSource({
                data: [
                    { "ID": "0", "brand": "Audi", "model": "R8", "image": baseImageUrl +"/Images/fiet.jpg", "imagefilename": "My car", "status": "I", "plate": "C-1234567", "CustomerName": "Mr. Taj", "PhoneNumber": "0876543219", "Job": ["Change Type", "Change Oil"], "Estimation": "2000 AED" },
                    { "ID": "0", "brand": "Volkswagen", "model": "v1234", "image": baseImageUrl + "/Images/benz.jpg", "imagefilename": "My car", "status": "R", "plate": "v-1234567", "CustomerName": "Mr. Taj", "PhoneNumber": "0876543219", "Job": ["Change Type", "Change Oil"], "Estimation": "2000 AED" },
                    { "ID": "0", "brand": "Jaguar", "model": "Land Rover", "image": baseImageUrl + "/Images/bmw.jpg", "imagefilename": "My car", "status": "R", "plate": "J-1234567", "CustomerName": "Mr. Taj", "PhoneNumber": "0876543219", "Job": ["Change Type", "Change Oil"], "Estimation": "2000 AED" },
                    { "ID": "0", "brand": "Ford", "model": "Rider", "image": baseImageUrl + "/Images/wagen.jpg", "imagefilename": "My car", "status": "R", "plate": "F1-1234", "CustomerName": "Mr. Taj", "PhoneNumber": "0876543219", "Job": ["Change Type", "Change Oil"], "Estimation": "2000 AED" },
                    { "ID": "0", "brand": "Audi", "model": "R8", "image": baseImageUrl + "/Images/chevrolet2.jpg", "imagefilename": "My car", "status": "R", "plate": "C-1234567", "CustomerName": "Mr. Taj", "PhoneNumber": "0876543219", "Job": ["Change Type", "Change Oil"], "Estimation": "2000 AED" },
                ],
            });

            self.set("garageDataSource", dataSource);
        }
    });
});