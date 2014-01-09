MyAgDataMobile.growerList = (function () {

    var viewModel = kendo.observable({
        growerList: {},
        selectedUserId: 0
    });

   $.support.cors = true;

    function getGrowerList(listType) {
//	alert(" userid = " + viewModel.selectedUserId + ", CropYear = " + myCropYear);
        var growerListoptions = {
            url: MyAgDataMobile.configuration.getGrowerListUrl,
            data: { userid: viewModel.selectedUserId, cropyear: myCropYear}, // 2013 },   //id=16&cropyear=2013  userid=16&cropyear=2013
            requestType: "GET",
            dataType: "JSON",
            callBack: callBack
        };
        MyAgDataMobile.dataAccess.callService(growerListoptions);
    }
    //callback method from service call
    function callBack(result) {
        if (result.success === true) {
            viewModel.set("growerList", result.data);
        }
    }

    function listTypeSelected(e) {
        getGrowerList(e.sender.selectedIndex);
    }

    function initList() {
        getGrowerList(0);
    }

    function initializeApp1() {
        application = new kendo.mobile.Application(document.body,
            {
                //   transition: 'slide',
                loading: "<h3>Loading...</h3>",
                skin: 'ios'
              //  skin: "flat"
            });

        ////initialize app
        //application = new kendo.mobile.Application(document.body,
        // {
        //     //   transition: 'slide',
        //     loading: "<h3>Loading...</h3>"

        // });

        //Display loading image on every ajax call
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

    //handler for show event of the view
    function showGrowerList(e) {
        viewModel.set("selectedUserId", e.view.params.userId);
        initList();
    }

    return {
        showGrowerList: showGrowerList,
        initializeApp1: initializeApp1,
        getGrowerList: getGrowerList,
        viewModel: viewModel,
        listTypeSelected: listTypeSelected
    }

})();