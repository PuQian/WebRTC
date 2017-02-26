var tempUserType = null;
var tempUserNameForMeeting = null;

$(function () { 
	$('#receiveselectbutton').click(function () { 
		tempUserType = $('#receivevideotype option:selected').val(); 
		
		var namefrommeeting = $("#tempvalue").attr("value");
		//com.webrtc.mobileInterfaceShow(tempUserType,tempUserNameForMeeting);
		if(tempUserType == "refuse")
		{
			com.webrtc.refuse(namefrommeeting);
		}
		else
		{
			com.webrtc.mobileInterfaceShow(tempUserType,namefrommeeting);
		}
		

	}) 
}) 