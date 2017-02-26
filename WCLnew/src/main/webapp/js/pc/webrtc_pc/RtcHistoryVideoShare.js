//显示视频邀请记录（单击视频邀请记录触发）
var HistoryVideo=function(){
	document.getElementById("onVideo").setAttribute("class","on");
	document.getElementById("onAudio").removeAttribute("class");
	document.getElementById("onChat").removeAttribute("class");
	document.getElementById("onMeeting").removeAttribute("class");
	$('#list_chat').hide();
	$('#list_audio').hide();
	$('#list_video').show();
	$('#list_meeting').hide();
	
};
