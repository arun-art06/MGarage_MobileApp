var host = "http://192.168.2.17:8069/";
var baseUrl = host + "openacademy/OpenacademyCustomer";

require.config({
    paths: {
        kendo: "./lib/kendo.all.min",
        jquery: "./lib/jquery.min",
        text: "./lib/text",
        templateLoader: "./lib/kendo-template-loader",
        garageViewModel: "./app/Garage/GarageViewModel",
        garageTemplate: "./app/Garage/garagelist_template.html",
        customerViewModel: "./app/Customer/CustomerViewModel",
        customerTemplate: "./app/Customer/customerlist_template.html",
        ordersViewModel: "./app/Orders/OrdersViewModel",
        ordersTemplate: "./app/Orders/orderslist_template.html",
    },

    shim: {
        kendo: {
            deps: ['jquery'],
            exports: 'kendo'
        }
    }
});


var Global = {
    SelectedOrderView: 0,
    NewVehicleBrand: "",
    NewVehicleBrandId: 0,
    NewVehicleModel: "",
    NewVehicleModelId: 0,
    NewVehiclePlateNumber: "",
    CustomersVehicle: [],
    objVehicleModelDropDownList: "",
    objVehicleBrandDropDownList: "",
    VehicleDropdownloaded: false,

};

require(['kendo', 'app'], function (kendo, app) {//['app'], function (app) {
    window.app = app;
    $(function () {
        app.init();
    });

    //$("ul.TopMenu li").click(function () {
    //    //$("ul.TopMenu li").each(function (index) {
    //    //    $(this).removeClass("active");
    //    //});
    //    //$(this).addClass("active");
    //});


    $("#filter").keyup(function () {

        // Retrieve the input field text and reset the count to zero
        var filter = $(this).val(), count = 0;

        if ($("#customermenu").hasClass("active")) {
            // Loop through the comment list
            $(".customerList li").each(function () {

                // If the list item does not contain the text phrase fade it out
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).fadeOut();

                    // Show the list item if the phrase matches and increase the count by 1
                } else {
                    $(this).show();
                    count++;
                }
            });
        }
        else if ($("#garagemenu").hasClass("active")) {
            // Loop through the comment list
            $("#garage li").each(function () {

                // If the list item does not contain the text phrase fade it out
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).fadeOut();

                    // Show the list item if the phrase matches and increase the count by 1
                } else {
                    $(this).show();
                    count++;
                }
            });
        }
        else if ($("#ordermenu").hasClass("active")) {
            // Loop through the comment list
            $("#order li").each(function () {

                // If the list item does not contain the text phrase fade it out
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).fadeOut();

                    // Show the list item if the phrase matches and increase the count by 1
                } else {
                    $(this).show();
                    count++;
                }
            });
        }

        // Update the count
        var numberItems = count;
        $("#filter-count").text("Number of Comments = " + count);
    });

    $('.addbutton').click(function () {

        if (Global.VehicleDropdownloaded == false) {
            loadVehicleDropDowns();
        }

        Global.objVehicleBrandDropDownList.select(0);
        Global.objVehicleModelDropDownList.select(0);
        $("#vehiclePlateNumber").val('');
        Global.NewVehicleBrand = "";
        Global.NewVehicleBrandId = "";
        Global.NewVehicleModel = "";
        Global.NewVehicleModelId = "";

        $(".km-header").css("visibility", "hidden");
        $('.cd-vehicleaddpopup').addClass('is-visible');

        return false;
    });

    //// Create New customer
    $("#createCustomer").click(function () {
        var NewCustomerUrl = baseUrl + "/customerAdd";
        //NewCustomerUrl = NewCustomerUrl + "?name=" + $("#name").val() + "&street=" + $("#address").val();
        //debugger;
        //$.ajax({
        //    type: "POST",
        //    url: NewCustomerUrl,
        //    success: function (response) {
        //        debugger;
        //        if (response == 'success')
        //            $("#myForm").slideUp('slow', function () {
        //                $("#msg").html("<p class='success'>You have logged in successfully!</p>");
        //            });
        //        else
        //            $("#msg").html("<p class='error'>Invalid username and/or password.</p>");
        //    }
        //});
        var data = {
            name: $("#name").val(),
            street: $("#address").val(),
        }
        if (data.name != "" && data.street != "") {
            $.ajax({
                type: "POST",
                url: NewCustomerUrl + '?name=' + data.name + '&street=' + data.street,
                //data: JSON.stringify(data),
                //contentType: "application/json; charset=utf-8",
                //dataType: "json",
                //processdata: false,
                cache: false,
                success: function (data, statusText, xhr) {
                    //debugger;
                    $("#popupMessage").text("");
                    if (xhr.status == 200 || xhr.status == 201) {
                        $("#popupMessage").text("User Created Successfully.");
                        var CustomerId = data;
                    } else {
                        $("#popupMessage").text("User Details Insertion Failed");
                    }
                    $(".km-header").css("visibility", "hidden");
                    $('.cd-popup').addClass('is-visible');
                }
            });
        } else {
            $("#popupMessage").text("");
            $("#popupMessage").text("Please enter the customer detail.");
            $(".km-header").css("visibility", "hidden");
            $('.cd-popup').addClass('is-visible');

        }
    });

    //// Alert Popup Action
    //close popup
    $('.cd-popup').on('click', function (event) {
        if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')) {
            event.preventDefault();
            $("#popupMessage").text("");
            $(".km-header").css("visibility", "visible");
            $(this).removeClass('is-visible');
        }
    });
    //close popup when clicking the esc keyboard button
    $(document).keyup(function (event) {
        if (event.which == '27') {
            $("#popupMessage").text("");
            $(".km-header").css("visibility", "visible");
            $('.cd-popup').removeClass('is-visible');
        }
    });

    //// confirm ok click
    $("#confirmOk").click(function () {
        $("#popupMessage").text("");
        $(".km-header").css("visibility", "visible");
        $('.cd-popup').removeClass('is-visible');
    });


    //// Vehicle add popup action
    //close popup
    $('.cd-vehicleaddpopup').on('click', function (event) {
        if ($(event.target).is('.cd-vehicleaddpopup-close') || $(event.target).is('.cd-vehicleaddpopup')) {
            event.preventDefault();
            $("#popupMessage").text("");
            $(".km-header").css("visibility", "visible");
            $(this).removeClass('is-visible');
        }
    });
    //close popup when clicking the esc keyboard button
    $(document).keyup(function (event) {
        if (event.which == '27') {
            $("#popupMessage").text("");
            $(".km-header").css("visibility", "visible");
            $('.cd-vehicleaddpopup').removeClass('is-visible');
        }
    });

    //// confirm ok click
    $("#addvehicle").click(function () {
        var vehiclePlateNumber = $(".vehicleplatenumber").val();
        if (Global.NewVehicleBrand != "" && Global.NewVehicleModel != "" && vehiclePlateNumber != "") {
            $("#errorMessage").text("");

            var id = Global.CustomersVehicle.length;

            Global.CustomersVehicle.push({
                "Id": id,
                "VehicleBrand": Global.NewVehicleBrand, "VehicleBrandId": Global.NewVehicleBrandId,
                "VehicleModel": Global.NewVehicleModel, "VehicleModelId": Global.NewVehicleModelId,
                "VehiclePlateNumber": vehiclePlateNumber
            });

            $('<div class="vehiclenumber" id="vehicle' + id + '"><div class="vehicleinput"><label>' + Global.NewVehicleBrand + ' / ' + Global.NewVehicleModel + '</label></div> <div id="removeVN' + id + '" onclick="javascript: removefunction(this);" class="remScnt vehiclenoremove"><img data-id="' + id + '" onclick="javascript: removefunction(this);" src="./Images/Removebutton2.png" class="removebutton" alt="remove" style=""></div></div>').appendTo('#p_scents');

            $(".km-header").css("visibility", "visible");
            $('.cd-vehicleaddpopup').removeClass('is-visible');
        } else {
            $("#errorMessage").text("Please enter vehicle details.");
        }
    });

});

function loadVehicleDropDowns() {
    //// Bind Vehicle Brand
    var Brand = [{ "id": 66, "name": "" }, { "id": 1, "name": "Abarth" }, { "id": 2, "name": "Acura" }, { "id": 3, "name": "Alfa" }, { "id": 4, "name": "Audi" }, { "id": 5, "name": "Austin" }, { "id": 6, "name": "Bentley" }, { "id": 7, "name": "Bmw" }, { "id": 8, "name": "Bugatti" }, { "id": 9, "name": "Buick" }, { "id": 10, "name": "Byd" }, { "id": 11, "name": "Cadillac" }, { "id": 12, "name": "Chevrolet" }, { "id": 13, "name": "Chrysler" }, { "id": 14, "name": "Citroen" }, { "id": 15, "name": "Corre La Licorne" }, { "id": 16, "name": "Daewoo" }, { "id": 17, "name": "Dodge" }, { "id": 18, "name": "Ferrari" }, { "id": 19, "name": "Fiat" }, { "id": 20, "name": "Ford" }, { "id": 21, "name": "Holden" }, { "id": 22, "name": "Honda" }, { "id": 23, "name": "Hyundai" }, { "id": 24, "name": "Infiniti" }, { "id": 25, "name": "Isuzu" }, { "id": 26, "name": "Jaguar" }, { "id": 27, "name": "Jeep" }, { "id": 28, "name": "Kia" }, { "id": 29, "name": "Koenigsegg" }, { "id": 30, "name": "Lagonda" }, { "id": 31, "name": "Lamborghini" }, { "id": 32, "name": "Lancia" }, { "id": 33, "name": "Land Rover" }, { "id": 34, "name": "Lexus" }, { "id": 35, "name": "Lincoln" }, { "id": 36, "name": "Lotus" }, { "id": 37, "name": "Maserati" }, { "id": 38, "name": "Maybach" }, { "id": 39, "name": "Mazda" }, { "id": 40, "name": "Mercedes" }, { "id": 41, "name": "Mg" }, { "id": 42, "name": "Mini" }, { "id": 43, "name": "Mitsubishi" }, { "id": 44, "name": "Morgan" }, { "id": 45, "name": "Nissan" }, { "id": 46, "name": "Oldsmobile" }, { "id": 47, "name": "Opel" }, { "id": 48, "name": "Peugeot" }, { "id": 49, "name": "Pontiac" }, { "id": 50, "name": "Porsche" }, { "id": 51, "name": "Rambler" }, { "id": 52, "name": "Renault" }, { "id": 53, "name": "Rolls-Royce" }, { "id": 54, "name": "Saab" }, { "id": 55, "name": "Scion" }, { "id": 56, "name": "Skoda" }, { "id": 57, "name": "Smart" }, { "id": 58, "name": "Steyr" }, { "id": 59, "name": "Subaru" }, { "id": 60, "name": "Tesla Motors" }, { "id": 61, "name": "Toyota" }, { "id": 62, "name": "Trabant" }, { "id": 63, "name": "Volkswagen" }, { "id": 64, "name": "Volvo" }, { "id": 65, "name": "Willys" }];
    var Model = [{ "modelname": "A1", "id": 13 }, { "modelname": "A3", "id": 14 }, { "modelname": "A4", "id": 15 }, { "modelname": "A5", "id": 16 }, { "modelname": "A6", "id": 17 }, { "modelname": "A7", "id": 18 }, { "modelname": "A8", "id": 19 }, { "modelname": "Q3", "id": 20 }, { "modelname": "Q5", "id": 21 }, { "modelname": "Q7", "id": 22 }, { "modelname": "TT", "id": 23 }, { "modelname": "Serie 1", "id": 24 }, { "modelname": "Serie 3", "id": 25 }, { "modelname": "Serie 5", "id": 26 }, { "modelname": "Serie 6", "id": 27 }, { "modelname": "Serie 7", "id": 28 }, { "modelname": "Serie Hybrid", "id": 32 }, { "modelname": "Serie M", "id": 31 }, { "modelname": "Serie X", "id": 29 }, { "modelname": "Serie Z4", "id": 30 }, { "modelname": "Dodge Dart", "id": 47 }, { "modelname": "civic123", "id": 49 }, { "modelname": "Class A", "id": 33 }, { "modelname": "Class B", "id": 34 }, { "modelname": "Class C", "id": 35 }, { "modelname": "Class CL", "id": 36 }, { "modelname": "Class CLS", "id": 37 }, { "modelname": "Class E", "id": 38 }, { "modelname": "Class GL", "id": 40 }, { "modelname": "Class GLK", "id": 41 }, { "modelname": "Class M", "id": 39 }, { "modelname": "Class R", "id": 42 }, { "modelname": "Class S", "id": 43 }, { "modelname": "Class SLK", "id": 44 }, { "modelname": "SLS", "id": 45 }, { "modelname": "nm1", "id": 48 }, { "modelname": "Agila", "id": 3 }, { "modelname": "Ampera", "id": 12 }, { "modelname": "Antara", "id": 11 }, { "modelname": "Astra", "id": 2 }, { "modelname": "AstraGTC", "id": 6 }, { "modelname": "Combo Tour", "id": 4 }, { "modelname": "Corsa", "id": 1 }, { "modelname": "Insignia", "id": 9 }, { "modelname": "Meriva", "id": 5 }, { "modelname": "Mokka", "id": 10 }, { "modelname": "Zafira", "id": 7 }, { "modelname": "Zafira Tourer", "id": 8 }];

    Global.objVehicleBrandDropDownList = $("#vehicleBrand").kendoDropDownList({
        optionLabel: "--select--",
        dataTextField: "name",
        dataValueField: "id",
        dataSource: Brand,
        index: 0,
        select: onBrandSelect
    }).data("kendoDropDownList");

    //// Bind Vehicle Model
    Global.objVehicleModelDropDownList = $("#vehicleModel").kendoDropDownList({
        optionLabel: "--select--",
        dataTextField: "modelname",
        dataValueField: "id",
        dataSource: Model,
        index: 0,
        select: onModelSelect
    }).data("kendoDropDownList");

    Global.VehicleDropdownloaded = true;
}

function loadCustomer(e) {
    $("ul.TopMenu li").each(function (index) {
        $(this).removeClass("active");
    });
    $("#customermenu").addClass("active");

    showCustomSearchPanel(true);
    $(".searchbox").css("width", "70%");
    $(".ordermenu").hide();
    window.app.loadCustomer(e);
    $(".addbutton1").show();
};

function loadInGarage(e) {
    $("ul.TopMenu li").each(function (index) {
        $(this).removeClass("active");
    });
    $("#garagemenu").addClass("active");
    showCustomSearchPanel(true);
    $("#addbutton").hide();
    $(".searchbox").css("width", "83%");
    $(".ordermenu").hide();
    window.app.loadInGarage(e);
};

function loadOrder(e) {
    $("ul.TopMenu li").each(function (index) {
        $(this).removeClass("active");
    });
    $("#ordermenu").addClass("active");
    $("#addbutton").hide();
    $(".searchbox").css("width", "83%");
    $(".ordermenu").show();
    showCustomSearchPanel(true);
    window.app.loadOrder(e);
};

function removefunction(e) {
    var id = $(e).data("id");

    for (var i = 0; i < Global.CustomersVehicle.length; i++) {
        if (Global.CustomersVehicle[i].Id == id) {
            Global.CustomersVehicle.splice(i, 1);
        }
    }

    $("#vehicle" + id).remove();
}

function NewCustomer(e) {
    $("#name").val("");
    $("#phone").val("");
    $("#email").val("");
    $("#address").val("");
    $("#pobox").val("");
    $("#p_scents").empty();
    Global.CustomersVehicle = [];
    $("#vehiclePlateNumber").val('');
    Global.NewVehicleBrand = "";
    Global.NewVehicleBrandId = "";
    Global.NewVehicleModel = "";
    Global.NewVehicleModelId = "";
    showCustomSearchPanel(false);

    var link = document.createElement('a');
    link.href = "#customerEditview";
    document.body.appendChild(link);
    link.click();
}

function showCustomSearchPanel(isShow) {
    if (isShow == true) {
        $(".customsearchpanel").show();
    } else {
        $(".customsearchpanel").hide();
    }
}

function CustomerEdit(e) {
    $("#p_scents").empty();
    showCustomSearchPanel(false);
    var customerID = $(e).data("customerid");
    var selectedCustomer = window.app.getSelectedCustomer(customerID);
    debugger;
    if (selectedCustomer != null) {

        $("#name").val(selectedCustomer.name);
        $("#phone").val(selectedCustomer.phone);
        $("#email").val(selectedCustomer.email);
        $("#address").val(selectedCustomer.street);
        $("#pobox").val(selectedCustomer.pobox);

        if (selectedCustomer.vehicle != null) {
            for (var i = 0; i < selectedCustomer.vehicle.length; i++) {

                var Template = '<div class="vehiclenumber" id="vehicle' + i + '"><div class="vehicleinput"><input type="text" id="p_scnt" size="20" placeholder="Vechile No  ' + i + '" value="' + selectedCustomer.vehicle[i] + '"  /></div> <div id="removeVN' + i + '" onclick="javascript: removefunction(this);" class="remScnt vehiclenoremove"><img data-id="' + i + '" onclick="javascript: removefunction(this);" src="./Images/Removebutton2.png" class="removebutton" alt="remove" style=""></div></div>';
                $(Template).appendTo($('#p_scents'));

            }
        }
    }

    var link = document.createElement('a');
    link.href = "#customerEditview";
    document.body.appendChild(link);
    link.click();
}

function orderdetailview(e) {
    ////$(".orderdownarrow").addClass('imagerotated');
    var orderId = $(e).data("orderid");

    //// Hide all
    $(".commondueon").slideUp();


    $(".ordersubmit").slideDown();

    if (Global.SelectedOrderView != orderId) {
        $(".orderdownarrow").removeClass('imagerotated');
    }

    if (!($(e).hasClass("imagerotated"))) {
        $(".dueon" + orderId).slideDown();

        //// hide edit button
        $("#orderedit" + orderId).slideUp();

        Global.SelectedOrderView = orderId;

        $(e).addClass('imagerotated');
    } else {
        $(e).removeClass("imagerotated");
    }
}

function onBrandSelect(e) {
    ////if ("kendoConsole" in window) {
    var dataItem = this.dataItem(e.item.index());
    ////kendoConsole.log("event :: select (" + dataItem.text + " : " + dataItem.value + ")");
    Global.NewVehicleBrand = dataItem.name;
    Global.NewVehicleBrandId = dataItem.id;
    ////}
};

function onModelSelect(e) {
    ////if ("kendoConsole" in window) {
    var dataItem = this.dataItem(e.item.index());
    ////kendoConsole.log("event :: select (" + dataItem.text + " : " + dataItem.value + ")");
    Global.NewVehicleModel = dataItem.modelname;
    Global.NewVehicleModelId = dataItem.id;
    //// }
};