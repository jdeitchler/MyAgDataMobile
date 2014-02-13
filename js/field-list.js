﻿
MyAgDataMobile.fieldList = (function () {

    //ViewModel to be bound to the view
    var viewModel = kendo.observable({
        fieldList: {},
        fieldCount: 0,
        selectedGrower: {
            userId: "",
            growerId: "",
            growerName: "",
            cropYear: ""
        },
        selectedDate: ""
    });

    function getFieldList(groupBy) {
        //    alert("Get the List of Field for GrowerId = " + viewModel.selectedGrower.growerId);
     //   alert("select FIeldList - userid = " + viewModel.selectedGrower.userId + ", GrowerId = " + viewModel.selectedGrower.growerId + ", CropYear = " + myCropYear + ", Season = " + mySeasonValue + ", FarmOperation = " + myFarmOperationValue);

        var serviceOptions = {
            url: MyAgDataMobile.configuration.getFieldListUrl,
//            data: { id: 16, growerId: 2036, cropYear: 2013, seasonNumber: 44, farmOpNumber: 22, groupBy: groupBy},    //id=16&growerId=2036&cropYear=2013&seasonNumber=44&farmOpNumber=22
            data: {
                userId: viewModel.selectedGrower.userId, // 16,
                growerId: viewModel.selectedGrower.growerId,
                cropYear: myCropYear, // viewModel.selectedGrower.cropYear,
                seasonValueId: mySeasonValue, // 21,
                farmOperationValueId: myFarmOperationValue, // 22,
                GroupByItem: groupBy
            },    
            requestType: "GET",
            dataType: "JSON",
        //     group: "cropName",
        //    callBack: callBack //,
            //  group: { field: "letter" }
            callBack: function (result) {
                if (result.success === true) {
                    viewModel.set("fieldList", result.data);
                    var buttongroup = $("#fieldlistButtonGroup").data("kendoMobileButtonGroup");
                    if (buttongroup.selectedIndex == 1 ||
                        buttongroup.selectedIndex == 2 ||
                        buttongroup.selectedIndex == 3) {
                        $("#partfield-list").kendoMobileListView({
                            style: "inset",
                            dataSource: kendo.data.DataSource.create({ data: viewModel.fieldList, group: "GroupBy" }),
                            //  template: "${Script1Template}",
                            template: kendo.template($("#fieldlist_template").html()) //,
                            // fixedHeaders: true
                        });
                    }
                    else {
                        $("#partfield-list").kendoMobileListView({
                            style: "inset",
                            fixedHeaders: false,
                            dataSource: kendo.data.DataSource.create({ data: viewModel.fieldList}), //, group: "GroupBy" }),
                            //  template: "${Script1Template}",
                            template: kendo.template($("#fieldlist_template").html()) //,
                            // fixedHeaders: true
                        });
                    }

                    if (result.data.length < 1) {
                        $("#partfield-list").append("<br /><h2 style='color : #FFFFFF;'><br/>This grower does not have any fields for the selected Crop Year, Season and Farming Operation. </h2>");
                    }

                } else {
                    //any error handling code
                }
            }
        };
        MyAgDataMobile.dataAccess.callService(serviceOptions);
    }

    function callBack(result) {
        if (result.success === true) {
            viewModel.set("fieldList", result.data);
        }
    }    

    //handler for show event of the view
    function show(e) {
     //    alert("Field List Show UserId Value = " + e.view.params.UserId);
     //   alert('made it to the Initialize Field list');
        var buttongroup = $("#fieldlistButtonGroup").data("kendoMobileButtonGroup");

        //hard coding today's date for selected date
        viewModel.set('selectedDate', new Date().toLocaleDateString());
        //read the selected movie's details from the query string
        if (e.view.params.GrowerId != null) {
            viewModel.set("selectedGrower", {
                userId: e.view.params.UserId,
                growerId: e.view.params.GrowerId,
                growerName: e.view.params.BusinessName,
                cropYear: e.view.params.CropYear
            });

            var titleString = viewModel.selectedGrower.growerName; // + '\r\n' + '2014 - Spring Plant';
            
            myUserId = e.view.params.UserId;

            $("#mt-main-layout-navbar").data("kendoMobileNavBar").title(titleString.toString());
        }

        if (buttongroup.selectedIndex == 1)
            getFieldList("County");
        else if (buttongroup.selectedIndex == 2)
            getFieldList("State");
        else if (buttongroup.selectedIndex == 3)
            getFieldList("CropName");
        else 
            getFieldList("FieldName");

        $("span.titleDetails").html(" " + myCropYear + " - " + mySeasonName + " " + myFarmOperationName + " ");
    }

    //retrieve list of theaters from the service
    function showGrowerList() {
        MyAgDataMobile.common.navigateToView('#Growerlist-view');
    }

    function mobileListViewDataBindInitGrouped(e) {
        if (e.sender.selectedIndex == 1)
            getFieldList("County");
        else if (e.sender.selectedIndex == 2)
            getFieldList("State");
        else if (e.sender.selectedIndex == 3)
            getFieldList("CropName");
        else 
            getFieldList("FieldName");
    }

    function initializeApp2() {

        application = new kendo.mobile.Application(document.body,
            {
                //   transition: 'slide',
                loading: "<h3>Loading...</h3>",
                skin: 'ios'
               // skin: "flat"
            });

        $(document).ajaxStart(function () {

            //application.showLoading calls the showLoading() method of the 
            //pane object inside the application. During the application's 
            //initial view's init method this pane object may not be initialized
            //and so application.showLoading() may throw error.To prevent this
            //we need to do a check for existence application.pane before calling
            //application.showLoading();
            if (application.pane) {
                application.showLoading();
            }
        });

        //Hide ajax loading image on after ajax call
        $(document).ajaxStop(function () {
            if (application.pane) {
                application.hideLoading();
            }
        });
    }

    return {
        show: show,
        initializeApp2: initializeApp2,
        showGrowerList: showGrowerList,
        getFieldList: getFieldList,
        viewModel: viewModel,
        mobileListViewDataBindInitGrouped: mobileListViewDataBindInitGrouped
    }
})();