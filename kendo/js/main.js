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
    GetVehicleModelUrl: "",
    CustomerCreatesNewVehicle: false,
    SelectedCustomerId: 0,

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

        clearVehicleInputValues();

        var link = document.createElement('a');
        link.href = "#AddCustomerVehicle";
        document.body.appendChild(link);
        link.click();

        loadVehicleDropDowns();
    });

    //// Create New customer
    $("#createCustomer").click(function () {
        var NewCustomerUrl = baseUrl + "/customerAdd";
        var CustomerEdit = baseUrl + "/customerEdit";
        //var vehicleCustomerUrl = baseUrl + "/vechicleAdd";
        var CustomerId = 0;
        var data = {
            name: $("#name").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
            poBox: $("#pobox").val(),
            street: $("#street").val(),
            city: $("#city").val()
        }
        if (data.name != "" && data.phone != "" && data.email != "" && data.poBox != "") {
            ///// Create or update customer
            //// Fund 0 - create new customer
            //// Not 0 - Update customer
            if (Global.SelectedCustomerId == 0) {
                $.ajax({
                    type: "POST",
                    url: NewCustomerUrl + '?name=' + data.name + '&street=' + data.street + '&pobox=' + data.poBox + '&city=' + data.city + '&phone=' + data.phone + '&email=' + data.email,
                    cache: false,
                    success: function (data, statusText, xhr) {
                        debugger;
                        $("#popupMessage").text("");
                        if (xhr.status == 200 || xhr.status == 201) {
                            debugger;
                            $("#popupMessage").text("User Created Successfully.");
                            var CustomerId = data;
                            Global.SelectedCustomerId = data;
                            $("#createCustomer").val("Update");
                            $(".additemlist").show();
                            $('.cd-popup').addClass('is-visible');

                        } else {
                            $("#popupMessage").text("User Details Insertion Failed");
                            $('.cd-popup').addClass('is-visible');
                        }
                    }
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: CustomerEdit + '?id=' + Global.SelectedCustomerId + '&name=' + data.name + '&street=' + data.street + '&pobox=' + data.pobox + '&city=' + data.city + '&phone=' + data.phone + '&email=' + data.email,
                    cache: false,
                    success: function (data, statusText, xhr) {
                        $("#popupMessage").text("");
                        debugger;
                        if (xhr.status == 200 || xhr.status == 201) {
                            debugger;
                            $("#popupMessage").text("User Created Successfully.");
                            var CustomerId = data;

                            $(".additemlist").show();
                            $('.cd-popup').addClass('is-visible');

                        } else {
                            $("#popupMessage").text("User Details Insertion Failed");
                            $('.cd-popup').addClass('is-visible');
                        }
                    }
                });
            }
        } else {
            $("#popupMessage").text("");
            $("#popupMessage").text("Please enter the customer detail.");
            $(".km-header").css("visibility", "hidden");
            $('.cd-popup').addClass('is-visible');
        }
    });

    ////Customer Clear

    $("#clearCustomer").click(function () {
        //clear values
        $("#name").val("");
        $("#street").val("");
        $("#city").val("");
        $("#pobox").val("");
        $("#phone").val("");
        $("#email").val("");

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
    $("#confirmOk").on('click', function () {
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
        var createVehicleUrl = baseUrl + "/createVehicle";

        if (Global.CustomerCreatesNewVehicle == true) {
            Global.NewVehicleBrand = $("#NewVehicleBrand").val();
            Global.NewVehicleModel = $("#NewVehicleModel").val();
            vehiclePlateNumber = $("#NewVehiclePlate").val();
            Global.NewVehicleBrandId = null;
            Global.NewVehicleModelId = null;
        } else {
            Global.NewVehicleBrandId = $('#ddlVehicleBrand option:selected').val();
            Global.NewVehicleModelId = $('#ddlVehicleModel option:selected').val();
            Global.NewVehicleBrand = $('#ddlVehicleBrand option:selected').text();
            Global.NewVehicleModel = $('#ddlVehicleModel option:selected').text();
        }

        if (Global.NewVehicleBrand != "" && Global.NewVehicleModel != "" && vehiclePlateNumber != "") {
            $("#errorMessage").text("");

            var id = Global.CustomersVehicle.length;
            brandId, modelId, license_plate
            $.ajax({
                type: "POST",
                url: createVehicleUrl + '?brandId=' + Global.NewVehicleBrandId + '&modelId=' + Global.NewVehicleModelId + '&license_plate=' + vehiclePlateNumber,
                cache: false,
                success: function (data, statusText, xhr) {

                    $("#popupMessage").text("");
                    if (xhr.status == 200 || xhr.status == 201) {
                        debugger;
                        $("#popupMessage").text("Vehicle added to customer successfully.");
                        var CustomerId = data;
                        Global.SelectedCustomerId = data;
                        $("#createCustomer").val("Update");
                        $(".additemlist").show();
                        var vehicleId = data;

                        Global.CustomersVehicle.push({
                            "Id": vehicleId,
                            "VehicleBrand": Global.NewVehicleBrand, "VehicleBrandId": Global.NewVehicleBrandId,
                            "VehicleModel": Global.NewVehicleModel, "VehicleModelId": Global.NewVehicleModelId,
                            "VehiclePlateNumber": vehiclePlateNumber
                        });

                        $('<div class="vehiclenumber" id="vehicle' + id + '"><div class="vehicleinput"><label>' + Global.NewVehicleBrand + ' / ' + Global.NewVehicleModel + '</label></div> <div id="removeVN' + id + '" onclick="javascript: removefunction(this);" class="remScnt vehiclenoremove"><img data-id="' + id + '" onclick="javascript: removefunction(this);" src="./Images/Removebutton2.png" class="removebutton" alt="remove" style=""></div></div>').appendTo('#p_scents');

                        window.history.go(-1);

                    } else {
                        $("#popupMessage").text("Failed to add Vehicle");
                    }

                    $(".km-header").css("visibility", "hidden");
                    $('.cd-popup').addClass('is-visible');
                }
            });



        } else {
            $("#errorMessage").text("Please enter vehicle details.");
        }
    });

    //// View New Vehicle input boxs
    $("#CreateNewVehicle").on('click', function (event) {
        if (Global.CustomerCreatesNewVehicle == false) {
            $("#ExistingVehile").slideUp();
            $("#NewVehicle").slideDown();
            Global.CustomerCreatesNewVehicle = true;
        } else {
            Global.CustomerCreatesNewVehicle = false;
            $("#ExistingVehile").slideDown();
            $("#NewVehicle").slideUp();
        }
    });

    $("#ddlVehicleBrand").change(function () {
        $.ajax({
            cache: false,
            type: "GET",

            url: "http://adigielite.ddns.net:8069/openacademy/OpenacademyCustomer/getModelbyBarand?brand_id=" + $(this).val(),
            datatype: "json",
            statusCode: {
                200: function (data) {
                    $("#ddlVehicleModel").get(0).options.length = 0;
                    $("#ddlVehicleModel").get(0).options[0] = new Option("-- Select --", "");
                    $.each(data, function (index, obj) {
                        $("#ddlVehicleModel").append(new Option(obj.modelname, obj.id));
                    });//

                },
                401: function (data) {
                    alert('401: Unauthorized'); // Handle the 401 error here.
                },
                400: function (data) {
                    alert("400: Bad request");
                },
                408: function (data) {
                    alert("408: Timeout error");
                }
            }
        });

    }).change();

    //Login Page Js Begin  Here

    $("#imgremb").click(function () {
        if ($("#isRemember").val() == "0") {
            $("#imgremb").attr("src", "images/on.png");
            $("#isRemember").val("1");
        } else {
            $("#imgremb").attr("src", "images/off.png");
            $("#isRemember").val("0");
        }
    });

    $(".rememberme").click(function () {
        if ($("#isRemember").val() == "0") {
            $("#imgremb").attr("src", "images/on.png");
            $("#isRemember").val("1");
        } else {
            $("#imgremb").attr("src", "images/off.png");
            $("#isRemember").val("0");
        }
    });

    $(".login-btn").click(function () {
        alert("in");
        var data = {
            name: $("#userName").val(),
            password: $("#password").val(),
        };
        var loginUrl = "";
        if (data.name != "" && data.password != "") {
            //$.ajax({
            //    type: "POST",
            //    url: loginUrl + '?name=' + data.name + '&street=' + data.password,
            //    //data: JSON.stringify(data),
            //    //contentType: "application/json; charset=utf-8",
            //    //dataType: "json",
            //    //processdata: false,
            //    cache: false,
            //    success: function (data, statusText, xhr) {
            //        //debugger;
            //        $("#popupMessage").text("");
            //        if (xhr.status == 200 || xhr.status == 201) {
            //            //$("#popupMessage").text("User Created Successfully.");
            //            var CustomerId = data;
            //        } else {
            //            $("#popupMessage").text("Invalid User Name and Password");
            //        }

            //        $('.cd-popup').addClass('is-visible');
            //    }
            //});
            if (data.name == "admin" && data.password == "admin") {
                var link = document.createElement('a');
                link.href = "#garagepageView";
                document.body.appendChild(link);
                link.click();
            }


        } else {
            $("#popupMessage").text("");
            $("#popupMessage").text("Please enter the User Name and Password ");
            $('.cd-popup').addClass('is-visible');
        }
    });


    $("#datepickerAFD").kendoDatePicker();
    $("#datepickerStatus").kendoDatePicker();
});

function loadVehicleDropDowns() {
    var getBarndUrl = baseUrl + "/getBrand";
    $.ajax({
        cache: false,
        type: "GET",
        url: getBarndUrl + "?id=73",
        datatype: "json",
        success: function (data) {
            $("#ddlVehicleBrand").get(0).options.length = 0;
            $("#ddlVehicleBrand").get(0).options[0] = new Option("-- Select --", "");
            $.each(data, function (index, obj) {
                //console.log(obj.name);
                $("#ddlVehicleBrand").append(new Option(obj.name, obj.id));
                //$('#ddlVehicleBrand').append('<option value="' + obj.id + '">' + obj.name + '</option>');
            });//
        },
    });

    ////statusCode: {
    ////    200: function (data) {
    ////        $("#ddlVehicleBrand").get(0).options.length = 0;
    ////        $("#ddlVehicleBrand").get(0).options[0] = new Option("-- Select --", "");
    ////        $.each(data, function (index, obj) {
    ////            $("#ddlVehicleBrand").append(new Option(obj.name, obj.id));
    ////        });//

    ////    },
    ////        401: function (data) {
    ////            alert('401: Unauthorized'); // Handle the 401 error here.
    ////        },
    ////        400: function (data) {
    ////            alert("400: Bad request");
    ////        },
    ////        408: function (data) {
    ////            alert("408: Timeout error");
    ////        }
    ////}

    //////// Bind Vehicle Brand
    ////Global.objVehicleBrandDropDownList = $("#vehicleBrand").kendoDropDownList({
    ////    optionLabel: "--select--",
    ////    dataTextField: "name",
    ////    dataValueField: "id",
    ////    dataSource: {
    ////        transport: {
    ////            read: "http://adigielite.ddns.net:8069/openacademy/OpenacademyCustomer/brand",
    ////            dataType: "json"
    ////        }
    ////    },
    ////    index: 0,
    ////    select: onBrandSelect
    ////}).data("kendoDropDownList");

    //////// Bind Vehicle Model
    ////Global.objVehicleModelDropDownList = $("#vehicleModel").kendoDropDownList({
    ////    autoBind: false,
    ////    optionLabel: "--select--",
    ////    dataTextField: "modelname",
    ////    dataValueField: "id",
    ////    dataSource: {
    ////        transport: {
    ////            read: "http://adigielite.ddns.net:8069/openacademy/OpenacademyCustomer/getModelbyBarand?brand_id=0",
    ////            dataType: "json"
    ////        }
    ////    },
    ////    index: 0,
    ////    select: onModelSelect
    ////}).data("kendoDropDownList");

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
    $(".ordermenu").css("display", "inline-block");
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
    Global.SelectedCustomerId = customerID;
    debugger;
    if (selectedCustomer != null) {

        $("#name").val(selectedCustomer.name);
        $("#phone").val(selectedCustomer.phone);
        $("#email").val(selectedCustomer.email);
        $("#address").val(selectedCustomer.street);
        $("#pobox").val(selectedCustomer.zip);
        $("#street").val(selectedCustomer.street);
        $("#city").val(selectedCustomer.city);

        if (selectedCustomer.vehicle != null) {
            for (var i = 0; i < selectedCustomer.vehicle.length; i++) {

                var Template = '<div class="vehiclenumber" id="vehicle' + i + '"><div class="vehicleinput"><input type="text" id="p_scnt" size="20" placeholder="Vechile No  ' + i + '" value="' + selectedCustomer.vehicle[i] + '"  /></div> <div id="removeVN' + i + '" onclick="javascript: removefunction(this);" class="remScnt vehiclenoremove"><img data-id="' + i + '" onclick="javascript: removefunction(this);" src="./Images/Removebutton2.png" class="removebutton" alt="remove" style=""></div></div>';
                $(Template).appendTo($('#p_scents'));

            }
        }
    }

    $(".additemlist").show();

    $("#createCustomer").val("Update");

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


};

function onModelSelect(e) {
    ////if ("kendoConsole" in window) {
    var dataItem = this.dataItem(e.item.index());
    ////kendoConsole.log("event :: select (" + dataItem.text + " : " + dataItem.value + ")");
    Global.NewVehicleModel = dataItem.modelname;
    Global.NewVehicleModelId = dataItem.id;
    //// }
};

function clearVehicleInputValues() {
    $('#ddlVehicleBrand').val("0").prop('selected', true);
    $('#ddlVehicleModel').val("0").prop('selected', true);
    $("#vehiclePlateNumber").val('');
    Global.NewVehicleBrand = "";
    Global.NewVehicleBrandId = "";
    Global.NewVehicleModel = "";
    Global.NewVehicleModelId = "";
    $("#NewVehicleBrand").val("");
    $("#NewVehicleModel").val("");
    $("#NewVehiclePlate").val("");
    $("#errorMessage").text("");
}