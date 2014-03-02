﻿MyAgDataMobile.dataAccess = (function () {

    function callService(options){
        $.ajax({
            url: options.url,   
            type: options.requestType,
            data: options.data,   
         //   crossDomain: true,
            dataType: options.dataType,
        //    type: "group",
        //    fixedHeaders: true,

            //Add HTTP headers if configured
            beforeSend: function (xhr) {
           //     alert("before send.");
                if (typeof options.httpHeader !== 'undefined'
                    && typeof options.headerValue !== 'undefined') {
          //          alert("before send -in");
                    xhr.setRequestHeader(options.httpHeader, options.headerValue);
          //          alert("after send -in");
                }
           //     alert("after send");
            },
            //on successful ajax call back
            success: function (resultData, status, xhr) {
          //      alert("Success");
                var result = {
                    data: resultData,
                    success: true
                };
                options.callBack(result);
            },
            //Callback function incase of an error
            error: function (xhr, status, errorThrown) {
            //    alert("In Error");
                switch(xhr.status){
                    case 401 :
                     //   alert('401 Unauthorized access detected.Please check the credentials you entered. ' + errorThrown);
                        $("#myModalView").data("kendoMobileModalView").open();
                        break;
                    case '500' :
                        alert('500 Internal Server Error. Please check the service code.' + errorThrown);
                        break;
                    default :
                        alert('Unexpected error: ' + errorThrown);
                        break;
                }
                var result = { success: false };                
                options.callBack(result);
            }
        });
    }

    return {
        callService: callService
    }
})();