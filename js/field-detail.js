﻿MyAgDataMobile.fieldDetail = (function () {

    var viewModel = kendo.observable({
        cropList:  {},
        practiceList: {},
        typeList: {},
        selectedField: {
            	userId: "",    
	 	        cropyear: "",
		        growerId: "",
		        partFieldId: "",
		        growerPartFieldId: ""
                    },
        growerId: 0,
        growerPartFieldId: 0,
        partFieldId: 0,
        partFieldShapeId: 0,
        cropCode: 91,
        cropName: "crop name",
        practiceCode: "002",
        practiceName: "Irrigated",
        typeCode: "012",
        typeName: "Spring Wheat",
        countyName: "County name",
        stateName: "State name",
        fieldAcres: 0,
        fieldAcresReadOnly: "",
        plantedAcres: 0,
        share: 0,
        fieldName: "Field Name",
        plantDate:  new Date(2014,1,1),
        updateClick: function (e) {
            // alert('update Field Started - UserId = ' + myUserId);
            //    viewModel.set("selectedField", {
            //            userId: viewModel.selectedField.userId,
            //            partFieldId: viewModel.get("partFieldId"),
            //            typeCode: viewModel.get("typeCode"),
            //            practiceCode: viewModel.get("practiceCode")
            //            });

            var pYear = viewModel.get("plantDate").getFullYear();
        //    alert('Year = ' + pYear);
            var pMonth = viewModel.get("plantDate").getMonth() + 1;
        //    alert('Month = ' + pMonth);
            var pDay = viewModel.get("plantDate").getDate();
       //     alert('Day = ' + pDay);
            var pDate = pMonth + "/" + pDay + "/" + pYear;
       //     alert('Date = ' + pDate);
       //     alert("the newDate1 = " + viewModel.get("plantDate"));
       //     alert("the newDate2 = " + pDate);

                var updateOptions = {
                    url: MyAgDataMobile.configuration.updateFieldDetailUrl,
                    requestType: "GET",
                    dataType: "JSON",
                    data: {
                        userId: myUserId,
                        growerId: viewModel.selectedField.growerId,
                        partFieldId: viewModel.get("partFieldId"),
                        partFieldShapeId: viewModel.get("partFieldShapeId"),
                        cropId: viewModel.get("cropCode"), 
                        typeCode: viewModel.get("typeCode"), 
                        practiceCode: viewModel.get("practiceCode"),
                        fieldAcres: viewModel.get("fieldAcres"),
                        plantedAcres: viewModel.get("plantedAcres"),
                        share: viewModel.get("share"),
                        plantDate: pDate
                          },
                    callBack: function (result) {
                        //if you are using PhoneGap to deploy as an app, 
                        //you should use the notification api
                        //navigate to User Account screen.

                        if (result.success)
                            {
                            //   alert('Growerid = ' + viewModel.selectedField.growerId);
                            //   window.kendoMobileApplication.navigate("#:back");
                            MyAgDataMobile.common.navigateToView('#fieldlist-view'); //?GrowerId=' + viewModel.get("growerId"));
                        //    alert('Success');
                            }
                        else {
                            alert('Error on PartField Update...');
                        }
                    }
                };
                MyAgDataMobile.dataAccess.callService(updateOptions);    
        },
        cropChangeEvent: function (e) {
            alert("Change the Crop - Update the dropdownlists");
        }
        });


    function loadFieldData() {
        var fieldDetailOptions = {
            url: MyAgDataMobile.configuration.getFieldDetailUrl,
            data: { 
		    userid: viewModel.selectedField.userId, 
		    growerid: viewModel.selectedField.growerId, 
		    growerpartfieldid: viewModel.selectedField.growerPartFieldId 
		  }, 
            requestType: "GET",
            dataType: "JSON",
            callBack: callBackFieldDetail
        };
        MyAgDataMobile.dataAccess.callService(fieldDetailOptions);
    }

    function loadCropData() {
        var cropListOptions = {
            url: MyAgDataMobile.configuration.getCropListUrl,
            data: { 
		     userid: viewModel.selectedField.userId, 
		     partFieldId: viewModel.selectedField.partFieldId, 
		     cropyear: viewModel.selectedField.cropyear
		   },   
            requestType: "GET",
            dataType: "JSON",
            callBack: cropListCallBack
        };
        MyAgDataMobile.dataAccess.callService(cropListOptions);
    };

    function loadTypeData() {
        var typeListOptions = {
            url: MyAgDataMobile.configuration.getTypeListUrl,
            data: { 
		     id: viewModel.selectedField.userId, 
		     cropyear: viewModel.selectedField.cropyear, 
	             commodityid: viewModel.cropCode 
		  },  
            requestType: "GET",
            dataType: "JSON",
            callBack: typeListCallBack
        };
        MyAgDataMobile.dataAccess.callService(typeListOptions);
    }

    function loadPracticeData() {
        var practiceListOptions = {
            url: MyAgDataMobile.configuration.getPracticeListUrl,
            data: { 
		     id: viewModel.selectedField.userId, 
		     cropyear: viewModel.selectedField.cropyear, 
		     commodityId: viewModel.cropCode 
		  },   
            requestType: "GET",
            dataType: "JSON",
            callBack: practiceListCallBack
        };
        MyAgDataMobile.dataAccess.callService(practiceListOptions);
    }

    //callback method from service call
    function callBackFieldDetail(result) {
        if (result.success === true) {
        //    alert('Success on Field Detail Callback');
            if (result.success === true) {
                viewModel.set("partFieldId", result.data.PartFieldId);
                viewModel.set("partFieldShapeId", result.data.PartFieldShapeId);
                viewModel.set("cropCode", result.data.CommodityCodeId);
                viewModel.set("cropName", result.data.CommodityName);
                if (result.data.PracticeCode == null)
                {
                    viewModel.set("practiceCode", "");
                    viewModel.set("practiceName", "");
                }
                else
                {
                    viewModel.set("practiceCode", result.data.PracticeCode);
                    viewModel.set("practiceName", result.data.PracticeAbbreviation);
                }

                viewModel.set("typeCode", result.data.TypeCode);
                viewModel.set("typeName", result.data.TypeName);
                viewModel.set("countyName", result.data.GrowerCountyName);
                viewModel.set("stateName", result.data.GrowerStateName);
                viewModel.set("fieldAcres", result.data.CalculatedAcres);
                viewModel.set("fieldAcresReadOnly", result.data.CalculatedAcres + " acres");
                viewModel.set("plantedAcres", result.data.ReportedAcres);
                viewModel.set("share", result.data.FieldShare);
                viewModel.set("fieldName", result.data.CommonFarmName);
             //   viewModel.set("plantDate",  result.data.CompletedDate);
                //   alert("Date coming back = " + result.data.CompletedDate);
                
                var intDay = 0;
                var intMonth = 0;
                var intYear = 0

                if (result.data.CompletedDate == null || result.data.CompletedDate == "") {
                    var currentDate = new Date();
                    intDay = currentDate.getDate();
                    intMonth = currentDate.getMonth();
                    intYear = currentDate.getFullYear();
                }
                else {
                    var str = result.data.CompletedDate;
                    var res = str.substring(0, 10);
                    if (res == "1900-01-01") {
                        var today = new Date();
                        intYear = today.getFullYear();
                        intMonth = today.getMonth();
                        intDay = today.getDate();
                    }
                    else {
                        var dateParts = str.split("-");
                        intYear = parseInt(dateParts[0], 10);
                        intMonth = parseInt(dateParts[1], 10) - 1;
                        intDay = parseInt(dateParts[2], 10);
                    }
                }

                       viewModel.set("plantDate",  new Date(intYear, intMonth, intDay));

                       $("#plantingdate").kendoDatePicker({
                           value: new Date(intYear, intMonth, intDay),
                           change: function () {
                               var value = this.value();
                               viewModel.set("plantDate", value);
                               //      alert("Select Date = " + value); //value is the selected date in the datepicker
                           }
                       });
                   
                       $("#plantingdate").closest("span.k-datepicker").width(120);

                    //   $("#plantingdate").attr('value', new Date('2013-08-11'));
                    //  $("#plantingdate").kendoDatePicker();
                //    $("#CropDropDown").data('kendoDropDownList').value(viewModel.cropCode);
                //    $("#Practice").data('kendoDropDownList').value(viewModel.practiceCode);
                //    $("#Type").data('kendoDropDownList').value(viewModel.typeCode);

                    //navigate to User Account Growers.
                //MyAgDataMobile.common.navigateToView("GrowersList.html");
                //          alert("call load Crop");

                    // create Percentage NumericTextBox from input HTML element
              $("#Share").kendoNumericTextBox({
                    format: "p0",
                  //    value: result.data.FieldShare,
                        type: Number,
                        min: 0,
                        max: 1.00,
                        step: 0.01,
                        decimals: 3,
                        spinners: false
              }).focus(function () {
                  var input = $(this);
                  setTimeout(function () {
                      input.select();
                  });
              });

              //$("#FAcres").kendoNumericTextBox({
              //    format: "#.00 acres",
              //    decimals: 2,
              //    min: 0,
              //    disabled: true,
              //    max: 100000,
              //    spinners: false
              //});

              $("#PAcres").kendoNumericTextBox({
                  format: "#.00 acres",
                  type: Number,
                  pattern: [0-23455],
                  decimals: 2,
                  min: 0,
                  max: 100000,
                  spinners: false
              }).focus(function () {
                  var input = $(this);
                  setTimeout(function () {
                      input.select();
                  });
              });



    //          var input = e.container.find("input");
    //          setTimeout(function () {
    //              input.select();
    //          }, 25);

    //        $("#PAcres").on('focus', function () {
    //              var input = $(this);
    //              setTimeout(function () { input.select(); });
    //          });

//              $("#Share").on('focus', function () {
  //                var input = $(this);
    //              setTimeout(function () { input.select(); });
      //        });

                    loadCropData();
                }
            else {
                //any error handling code
                alert('error on Field Detail callback');
            }
        }
    }

    //callback method from service call
    function cropListCallBack(result) {
        if (result.success === true) {
            viewModel.set("cropList", result.data);
            loadTypeData();
            loadPracticeData();
        }
    }

    //callback method from service call
    function practiceListCallBack(result) {
        if (result.success === true) {
            viewModel.set("practiceList", result.data);
        }
    }

    //callback method from service call
    function typeListCallBack(result) {
        if (result.success === true) {
            viewModel.set("typeList", result.data);
        }
    }

    function CropCodeChange() {
     //   alert("Change the Crop Code");
    }

    //handler for show event of the view
     function showDetail(e) {
        //    alert('made it to the showdetails');
        //    alert('GrowerPF value = ' + e.view.params.GrowerPartFieldId);
        //    alert('GrowerId value = ' + e.view.params.GrowerId);
        //hard coding today's date for selected date
       // viewModel.set('selectedDate', new Date().toLocaleDateString());
        //read the selected movie's details from the query string
    //    viewModel.set("growerPartFieldId", e.view.params.GrowerPartFieldId);
    //    viewModel.set("partFieldId", e.view.params.PartFieldId); //e.view.params.PartFieldId);
    //    viewModel.set("growerId", e.view.params.GrowerId); //e.view.params.PartFieldId);
   	viewModel.set("selectedField", 
		{ 
		   userId: myUserId, 
		   cropyear: myCropYear,
	       growerId: e.view.params.GrowerId,
		   partFieldId: e.view.params.PartFieldId,
		   growerPartFieldId: e.view.params.GrowerPartFieldId
		});

        ////hard coding today's date for selected date
        //viewModel.set('selectedDate', new Date().toLocaleDateString());
        //getFieldList(e.view.params.GrowerId);

        loadFieldData();
    }

    function loadPracType() 
    {
        loadTypeData();
        loadPracticeData();
    }

    return {
        showDetail: showDetail,
   //     initialize3: initialize3,
        loadFieldData: loadFieldData,
        loadPracType: loadPracType,
        viewModel: viewModel
    }
})();