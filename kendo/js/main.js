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

require(['kendo', 'app'], function (kendo, app) {//['app'], function (app) {
    window.app = app;
    $(function () {
        app.init();
    });

    $("ul.TopMenu li").click(function () {
        $("ul.TopMenu li").each(function (index) {
            $(this).removeClass("active");
        });
        $(this).addClass("active");
    });


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
            $(".commentlist li").each(function () {

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
            $(".orderList li").each(function () {

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

    var scntDiv = $('#p_scents');
    var i = $('#p_scents p').size() + 0;

    $('.addbutton').click(function () {
        $('<div class="vehiclenumber" id="vehicle' + i + '"><div class="vehicleinput"><input type="text" id="p_scnt" size="20" placeholder="Vechile No  ' + i + '" value=""  /></div> <div id="removeVN' + i + '" onclick="javascript: removefunction(this);" class="remScnt vehiclenoremove"><img data-id="' + i + '" onclick="javascript: removefunction(this);" src="./Images/Removebutton2.png" class="removebutton" alt="remove" style=""></div></div>').appendTo(scntDiv);
        i++;
        return false;
    });

    //// Create New customer
    $("#createCustomer").click(function () {
        var NewCustomerUrl = "http://192.168.2.17:8069/openacademy/OpenacademyCustomer/customerAdd";
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
                url: NewCustomerUrl + '?Name=' + data.name + '&street=' + data.street,
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

                    $('.cd-popup').addClass('is-visible');
                }
            });
        } else {
            $("#popupMessage").text("");
            $("#popupMessage").text("Please enter the customer detail.");
            $('.cd-popup').addClass('is-visible');
        }
    });

    //close popup
    $('.cd-popup').on('click', function (event) {
        if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')) {
            event.preventDefault();
            $("#popupMessage").text("");
            $(this).removeClass('is-visible');
        }
    });
    //close popup when clicking the esc keyboard button
    $(document).keyup(function (event) {
        if (event.which == '27') {
            $("#popupMessage").text("");
            $('.cd-popup').removeClass('is-visible');
        }
    });

    //// confirm ok click
    $("#confirmOk").click(function () {
        $("#popupMessage").text("");
        $('.cd-popup').removeClass('is-visible');
    });

});

var Global = { SelectedOrderView: 0, };

function loadCustomer(e) {
    showCustomSearchPanel(true);
    $("#addbutton").show();
    $("#addbutton").removeAttr("href");
    $("#addbutton").attr("href", "customerEditview");
    $(".searchbox").css("width", "70%");
    $(".ordermenu").hide();
    window.app.loadCustomer(e);
};

function loadInGarage(e) {
    showCustomSearchPanel(true);
    $("#addbutton").hide();
    $(".searchbox").css("width", "83%");
    $(".ordermenu").hide();
    window.app.loadInGarage(e);
};

function loadOrder(e) {
    $("#addbutton").show();
    $("#addbutton").removeAttr("href");
    $("#addbutton").attr("href", "OrderEditView");
    $(".searchbox").css("width", "70%");
    $(".ordermenu").show();
    showCustomSearchPanel(true);
    window.app.loadOrder(e);
};

function removefunction(e) {
    var id = $(e).data("id");
    $("#vehicle" + id).remove();
    //$(e).parents('p').remove();
}

function NewCustomer() {
    $("#name").val("");
    $("#phone").val("");
    $("#email").val("");
    $("#address").val("");
    $("#pobox").val("");
    $("#p_scents").empty();
    showCustomSearchPanel(false);
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