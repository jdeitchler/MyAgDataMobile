MyAgDataMobile.userAccount = (function () {
	//ViewModel for User Account view
//	debugger;
	var viewModel = kendo.observable({
	    isUserLoggedIn: false,
	    defaultList: {},
       	userId: 0,
		firstName: "",
		lastName: "",
		userName: "", 
		password: "", 
		userAddress: "",
		userEmailAddress: "",
		subscribedForNewsLetter:false,
		userBookingHistory: [],
		userLogin: function () {
		      $.support.cors = true;
		 //  	alert("login with userid = " + this.userName + ", password = " + this.password);

		 //  	$("#myModalView").data("kendoMobileModalView").open();

		   	var loginOptions = {
				url: MyAgDataMobile.configuration.accountUrl,
				requestType: "GET",
				dataType: "JSON",
				httpHeader: "Authorization", //for HTTP Basic authentication
				//btoa function will convert the text to base 64 encoding
				headerValue: "Basic " + btoa(this.userName + ":" + this.password),
				callBack: this.fnLoginCallBack,
			};

		   	MyAgDataMobile.dataAccess.callService(loginOptions);
		},
		//method for user login
		fnLoginCallBack: function (result) {
	//	    alert("Login return = " + result.success);
		    if (result.success === true && result.data != null) {
			    viewModel.set("userId", result.data.UserId);
			    viewModel.set("firstName", result.data.FirstName);
			    viewModel.set("lastName", result.data.LastName);
			    viewModel.set("userEmailAddress", result.data.EmailId);
			    viewModel.set("isUserLoggedIn", true);
		//	    alert("Login successfull");
			    getCropSeasonDefaults(result.data.UserId);
			} else {
			    //any error handling code
	//		    alert("Unable to Login");
			}
		},

		//method to update user details
		updateUserDetails: function () {
			var updateOptions = {
				url: MyAgDataMobile.configuration.accountUrl,
				requestType: "POST",
				dataType: "JSON",
				data: { firstName: viewModel.get("firstName"),
						lastName: viewModel.get("lastName"),
						address: viewModel.get("userAddress"),
						emailId: viewModel.get("userEmailAddress"),
						subscribedForNewsLetter: viewModel.get("subscribedForNewsLetter")
				},

				//for HTTP Basic authentication
				httpHeader: "Authorization",
				//btoa function will convert the text to base 64 encoding
				headerValue: "Basic " + btoa(this.userName + ":" + this.password),
				callBack: function () {
					//if you are using PhoneGap to deploy as an app, 
					//you should use the notification api
					alert('Details updated...');
				}
			};
			MyAgDataMobile.dataAccess.callService(updateOptions);
		},

		//method called when log off button is clicked
		logOff: function () {
			console.log('inside logOff');
			viewModel.set("firstName", "");
			viewModel.set("lastName", "");
			viewModel.set("userAddress", "");
			viewModel.set("userEmailAddress", "");
			viewModel.set("userBookingHistory", "");
			viewModel.set("isUserLoggedIn", false);
			viewModel.set("userName", "");
			viewModel.set("password", "");

			//hide log off button
			MyAgDataMobile.common.hideLogOffButton();
		//	$("span.titleDetails").html(" " + myCropYear + " - " + mySeasonName + " " + myFarmOperationName + " ");
			//navigate to User Account screen.
			MyAgDataMobile.common.navigateToView('#account-view');
		}
	});

    // Set the Global Default values
	function getCropSeasonDefaults(userId) {
	    myUserId = userId;
	    $.support.cors = true;
	    var getDefaultsoptions = {
	        url: MyAgDataMobile.configuration.getDefaultsUrl,
	        data: { userId: userId },
	        requestType: "GET",
	        dataType: "JSON",
	        callBack: function (result) {
	            if (result.success) {
	                // Returned defaults for User - now set them // alert('Success for Defaults');
	                viewModel.set("defaultList", result.data);
                    var length = viewModel.defaultList.length;
                    for (var i = 0; i < length; i++) {
                        if (viewModel.defaultList[i].Name == "CropYear")
                            myCropYear = viewModel.defaultList[i].Value;
                        else if (viewModel.defaultList[i].Name == "SeasonName") 
                            mySeasonName = viewModel.defaultList[i].Value;
                        else if (viewModel.defaultList[i].Name == "SeasonValue") {
                            mySeasonValue = viewModel.defaultList[i].Value;
                        }
                    }

              //      alert("Set Defaults userid = " + myUserId + ", myCropYear = " + myCropYear + ", mySeasonName = " + mySeasonName + ", mySeasonValue = " + mySeasonValue);
                    MyAgDataMobile.common.showLogOffButton();
                    MyAgDataMobile.common.navigateToView('#Growerlist-view?userId=' + result.data.UserId);
	            }
	            else {
	       //         alert('Error on get Defaults...');
	                MyAgDataMobile.common.showLogOffButton();
	                MyAgDataMobile.common.navigateToView('#Growerlist-view?userId=' + result.data.UserId);
	            }
	        }
	    };
	    MyAgDataMobile.dataAccess.callService(getDefaultsoptions);
	}

    //handler for show event of the view
	function show(e) {
	    kendoEditor.data("user-acc-username").focus();
	}

	return {
        show: show,
		viewModel: viewModel
	}
})();