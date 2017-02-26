var tempUserName3 = null;
var tempUserNameToIMS = null;
var tempUserNameToMeeting = null;

function imsCall(remoteUserNameOriginal) {
	tempUserNameToIMS = remoteUserNameOriginal;	
	$("#turntoselectchangeForIMS").click();
}
function imsmeetingCall(remoteUserNameOriginal) {
	tempUserNameToMeeting = remoteUserNameOriginal;	
	$("#turntoselectchangeForMeeting").click();
}
function phoneCall(remoteUserNameOriginal) {
	tempUserName3 = remoteUserNameOriginal;	
	$("#turntoselectchange").click();
}

$(function () { 
	$('#selectbutton').click(function () { 
		var typeselect = $('#videotype option:selected').val(); 
		phoneCall2(tempUserName3,typeselect);
	}) 
	$('#selectbuttonForIMS').click(function () { 
		var typeselect = $('#videotypeForIMS option:selected').val(); 
		imsCall2(tempUserNameToIMS,typeselect);
	}) 
	$('#selectbuttonForMeeting').click(function () { 
		var typeselect = $('#videotypeForMeeting option:selected').val(); 
		imsmeetingCall2(tempUserNameToMeeting,typeselect);
	}) 
}) 