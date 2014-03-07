MyAgDataMobile.dataAccess = (function () {

    function callService(options) {
        var timeoutValue = 15000;
        var LoginRequest = false;

        // Looking for the URL: http://myagdatawebapi.cloudapp.net/api/Account/
        var n = options.url.indexOf("api/Account");
        if (n > 0) {
            timeoutValue = 5000;
            LoginRequest = true;
        }

        $.ajax({
            url: options.url,   
            type: options.requestType,
            data: options.data,   
            //   crossDomain: true,
            timeout: timeoutValue,
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
                if (status === "timeout") {
                    if (LoginRequest == true)
                        $("#myModalView").data("kendoMobileModalView").open();
                    else
                        alert("Request timed out");
                }
                else {
                    switch (xhr.status) {
                        case 401:
                            //   alert('401 Unauthorized access detected.Please check the credentials you entered. ' + errorThrown);
                            if (LoginRequest == true)
                                $("#myModalView").data("kendoMobileModalView").open();
                            else
                                alert('Request timed out');
                            break;
                        case '500':
                            alert('500 Internal Server Error. Please check the service code.' + errorThrown);
                            break;
                        default:
                            alert('Unexpected error: ' + errorThrown);
                            break;
                    }
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