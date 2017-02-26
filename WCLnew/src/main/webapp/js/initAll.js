var VIDEO_URL;
var LOGOUT_FLAG=false;
//var VIDEO_URL = "http://mysparkweb.free4lab.com/http-bind:8888";
//填写IM的一些回调函数,待替换
$(document).ready(function(){
	var username = $('.pub_banner').attr("user");
	console.log(username);
	VIDEO_URL = com.websockets[0];
	console.log(VIDEO_URL);
	if(com.webrtc.getMediaSupport() == true){
		loginwebrtc();
		console.log("initAll end to loginwebrtc");
	}else{
		//不支持webrtc API
	}
	
	//连接环信
	console.log("connectToEase");
	connectToEase();
	console.log("connectToEase success in initAll.js");
	
	//连接Netty
	beginWebSocketToNetty();
	
	// 查询是否有未接收的离线文件
	
	
	//初始化顶部未接信息数量
	initHeadTips(username);
});


//格式转化，去掉“@”换成“-”，并在后面加“@WebRTC”	
//eg: jxk143@163.com -->  jxk143-163.com@WebRTC
function formatChange(original){
	if(original.indexOf("@")!=-1){
		console.log("##################################################");
		console.log(original.split("@")[0]+'-'+original.split("@")[1]+"@WebRTC");
		return original.split("@")[0]+'-'+original.split("@")[1]+"@WebRTC";
	}
	else{
		console.log("**************************************************");
		console.log(original+"@WebRTC");
		return original+"@WebRTC";
	}
	
}
//格式转换，去掉“@WebRTC”，“-”换成“@”
////eg: jxk143-163.com@WebRTC -->  jxk143@163.com
function formatRechange(original){
	return original.split('@')[0].replace('-','@');
}
//格式转化，去掉“@”换成“-”  
//eg: jxk143@163.com -->  jxk143-163.com
function formatToEase(original){
	return original.replace('@','-');
}
//格式转化，去掉“-”换成“@”  
//eg: jxk143-163.com -->  jxk143@163.com
function formatReEase(original){
	return original.replace('-','@');
}

//格式转化，加上“@”
//eg: jxk143-163.com -->  jxk143-163.com@WebRTC
function EaseToWCS(original){
	return original+"@WebRTC";;
}
//格式转化，去掉“@WebRTC” 
//eg: jxk143-163.com@WebRTC -->  jxk143-163.com
function WCSToEase(original){
	return original.split('@')[0];
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//开始IMS call视频通话
function beginIMSVideo(remoteUserName, remoteUserId){
       
	//In IMS CALL remoteUserName和 remoteUserId 是一样的 eg: alice@open-ims.com 

	   console.log(remoteUserName+remoteUserId);

		var localUserName = $('.pub_banner').attr("user"), localUserId = $('.pub_banner').attr("userId");
		var remoteMedia = 'video' + remoteUserId, localMedia = 'video' + localUserId + '_' + remoteUserId;
		var operationId = 'operation' + localUserId + '_' + remoteUserId;
					
        var IMSCHAT=$(document.getElementById('chat'+remoteUserId));
		IMSCHAT.find('.video').removeClass('hidden').attr('src', 'images/videoing.png');
		IMSCHAT.find('.audio').addClass('hidden');
		IMSCHAT.find('.hang').removeClass('hidden');		
		
		com.webrtc.setMediaDisplayLabel(localMedia, remoteMedia);
		
		com.webrtc.setRemoteUserID(remoteUserName);
					
		var tipContent = "向"+remoteUserName+"发起IMS呼叫...";
		fillTipBox('success',tipContent);
	com.webrtc.call("video", "SDES");

}

//开始IMS 音频通话
function beginIMSAudio(remoteUserName, remoteUserId){
	
		var localUserName = $('.pub_banner').attr("user"), localUserId = $('.pub_banner').attr("userId");
		var remoteMedia = 'video' + remoteUserId, localMedia = 'video' + localUserId + '_' + remoteUserId;
		var operationId = 'operation' + localUserId + '_' + remoteUserId;

		 var IMSCHAT=$(document.getElementById('chat'+remoteUserId));
			IMSCHAT.find('.audio').removeClass('hidden').attr('src', 'images/audioing.png');
			IMSCHAT.find('.video').addClass('hidden');
			IMSCHAT.find('.hang').removeClass('hidden');
			IMSCHAT.find("img[id^=bigaudiopicture]").show();			
		com.webrtc.setMediaDisplayLabel(localMedia, remoteMedia);
		com.webrtc.setRemoteUserID(remoteUserName);
				
		var tipContent = "向"+remoteUserName+"发起呼叫...";
		fillTipBox('success',tipContent);
	com.webrtc.call("audio", "SDES");
}


//开始Webrtc用户间视频通话
//remoteUserNameOriginal eg:woshikelebaobao@163.com   remoteUserId eg:811
function beginVideo(remoteUserNameOriginal, remoteUserId){
	
	//remoteUserName eg:woshikelebaobao-163.com@WebRTC
	   var remoteUserName = formatChange(remoteUserNameOriginal);
	   console.log("remoteUserName="+remoteUserName+" remoteUserId="+remoteUserId+"\n");
	   
	   //localUserName eg: jxk143@163.com    localUserId eg:742
		var localUserName = $('.pub_banner').attr("user");
		var localUserId = $('.pub_banner').attr("userId");
		var remoteMedia = 'video' + remoteUserId, localMedia = 'video' + localUserId + '_' + remoteUserId;
		var operationId = 'operation' + localUserId + '_' + remoteUserId;
		console.log('#'+operationId+' .video');
		
		var chatname='chat'+remoteUserId;
				
		  var CHAT=$(document.getElementById('chat'+remoteUserId));
			CHAT.find('.video').removeClass('hidden').attr('src', 'images/videoing.png');
			CHAT.find('.audio').addClass('hidden');
			CHAT.find('.hang').removeClass('hidden');
		
	    var CHATdblclick=$(document.getElementById(remoteUserId));
	    CHATdblclick.dblclick();
	
		//暂时存储在com.webrtc中  事实上最终应存在 com.webrtc.gPeerConnections[对端ID]中 
		com.webrtc.setMediaDisplayLabel(localMedia, remoteMedia);
		com.webrtc.setRemoteUserID(remoteUserName);
				
		var tipContent = "向"+remoteUserName+"发起呼叫...";
		fillTipBox('success',tipContent);
		
	com.webrtc.call("video", "DTLS");

}

//开始音频通话的方法 WebRTC用户间
function beginAudio(remoteUserNameOriginal, remoteUserId){
	   var remoteUserName = formatChange(remoteUserNameOriginal);	

		var localUserName = $('.pub_banner').attr("user"), localUserId = $('.pub_banner').attr("userId");
		var remoteMedia = 'video' + remoteUserId, localMedia = 'video' + localUserId + '_' + remoteUserId;
		var operationId = 'operation' + localUserId + '_' + remoteUserId;
	
		
		var chatname='chat'+remoteUserId;
		
		
		  var CHAT=$(document.getElementById('chat'+remoteUserId));
		 
			CHAT.find('.audio').removeClass('hidden').attr('src', 'images/audioing.png');
			CHAT.find('.video').addClass('hidden');
			CHAT.find('.hang').removeClass('hidden');	 
			CHAT.find("img[id^=bigaudiopicture]").show();		
			var CHATdblclick=$(document.getElementById(remoteUserId));
			    CHATdblclick.dblclick();
				
		com.webrtc.setMediaDisplayLabel(localMedia, remoteMedia);
		com.webrtc.setRemoteUserID(remoteUserName);
		
		var tipContent = "向"+remoteUserName+"发起呼叫...";
		fillTipBox('success',tipContent);
	com.webrtc.call("audio", "DTLS");

}


//开始屏幕共享
function beginScreen(remoteUserNameOriginal, remoteUserId)
{
	//remoteUserName eg:woshikelebaobao-163.com@WebRTC
	   var remoteUserName = formatChange(remoteUserNameOriginal);
	   console.log("remoteUserName="+remoteUserName+" remoteUserId="+remoteUserId+"\n");
	   
	   //localUserName eg: jxk143@163.com    localUserId eg:742
		var localUserName = $('.pub_banner').attr("user");
		var localUserId = $('.pub_banner').attr("userId");
		var remoteMedia = 'video' + remoteUserId, localMedia = 'video' + localUserId + '_' + remoteUserId;
		var operationId = 'operation' + localUserId + '_' + remoteUserId;
		console.log('#'+operationId+' .video');
		
		var chatname='chatscreen'+remoteUserId;
			
		  var CHAT=$(document.getElementById('chatscreen'+remoteUserId));
			CHAT.find('.video').removeClass('hidden').attr('src', 'images/videoing.png');
			CHAT.find('.hang').removeClass('hidden');
		
//	    var CHATdblclick=$(document.getElementById(remoteUserId));
//	    CHATdblclick.dblclick();			
	
		//暂时存储在com.webrtc中  事实上最终应存在 com.webrtc.gPeerConnections[对端ID]中 
		com.webrtc.setMediaDisplayLabel(localMedia, remoteMedia);
		com.webrtc.setRemoteUserID(remoteUserName);
		
		
		var tipContent = "向"+remoteUserName+"发起呼叫...";
		fillTipBox('success',tipContent);
		
	com.webrtc.call("screen", "DTLS");
	
}

//开始文件传输
function beginFileTransfer(){
	
	var remoteUserIDs =readFromMark();
	var localUserName = $('.pub_banner').attr("user"), localUserId = $('.pub_banner').attr("userId");
//	var operationId = 'operation' + localUserId + '_' + remoteUserId;
	console.log(remoteUserIDs);
	var tipContent = "向"+remoteUserIDs+"传输文件";
	com.webrtc.setRemoteUserID(formatChange(remoteUserIDs));
    fillTipBox('success',tipContent);
    //判断是否已经建立文件传输的PeerConnection，是的话直接调用sendFile函数，否则调用call函数后再调用sendFile函数
    if  (typeof com.webrtc.gPeerConnections[formatChange(remoteUserIDs)+"file"] !="undefined" 
    	      && com.webrtc.gPeerConnections[formatChange(remoteUserIDs)+"file"]!=null ){
    		com.webrtc.file.sendFiles(formatChange(remoteUserIDs));
            com.webrtc.showprocessbar();
    
        }
    else
    {com.webrtc.call("file", "DTLS");}
}



//开始群组音频的方法
function beginRoomAudio(){
	
}

//关闭Webrtc 用户间会话
function endVideo(remoteUserName, remoteUserId){
	
	var remoteUserNameID=formatChange(remoteUserName);
	
		var hangUpname='chat'+remoteUserId;		
		
        var CHAT=$(document.getElementById('chat'+remoteUserId));
    	CHAT.find('.video').removeClass('hidden').attr('src','images/video.png');
		CHAT.find('.audio').removeClass('hidden').attr('src','images/voice.png');
		CHAT.find('.hang').addClass('hidden');
		CHAT.find("img[id^=bigaudiopicture]").hide();		
		
		com.webrtc.hangUp(remoteUserNameID);
		
		$("#tipbox").tipbox  ({
	        content: '会话已结束',
	        autoclose: true,
	        hasclose: false
		});
//	}
}

// IMS 挂断
function endIMSVideo(remoteUserName, remoteUserId){
	console.log(remoteUserName+remoteUserId);
	
	var remoteUserNameID=remoteUserName;
	
		var hangUpname='chat'+remoteUserId;
				
        var CHAT=$(document.getElementById('chat'+remoteUserId));
    	CHAT.find('.video').removeClass('hidden').attr('src','images/video.png');
		CHAT.find('.audio').removeClass('hidden').attr('src','images/voice.png');
		CHAT.find('.hang').addClass('hidden');
		CHAT.find("img[id^=bigaudiopicture]").hide();		
		
		console.log(com.webrtc.gPeerConnections[remoteUserNameID]);
		
		com.webrtc.hangUp(remoteUserNameID);
		$("#tipbox").tipbox  ({
	        content: '会话已结束',
	        autoclose: true,
	        hasclose: false
		});
}


function endScreen(remoteUserName, remoteUserId)
{	
	var remoteUserNameID=formatChange(remoteUserName);
	
		var hangUpname='chatscreen'+remoteUserId;		
		
        var CHAT=$(document.getElementById('chatscreen'+remoteUserId));
		CHAT.find('.video').removeClass('hidden').attr('src','images/video.png');
		CHAT.find('.hang').addClass('hidden');
		
		com.webrtc.hangUp(remoteUserNameID);
		$("#tipbox").tipbox  ({
	        content: '会话已结束',
	        autoclose: true,
	        hasclose: false
		});
}

function beginIMSmeetingVideo(){
	var IMSId = $('#meetingInputId').val();
	
	if(IMSId==""){
		
		$('#meetingInputId').val("");
		$('#meetingInputId').attr("placeholder","请输入会议号");
		alert("会议号不能为空！");
	}
	else{
		loadmeetingVideoNew(IMSId);
		beginMeetingVideo(IMSId,IMSId);
	}	
}

function beginIMSmeetingAudio(){
	var IMSId = $('#meetingInputId').val();
	
	if(IMSId==""){
		
		$('#meetingInputId').val("");
		$('#meetingInputId').attr("placeholder","请输入会议号");
		alert("会议号不能为空！");
	}
	else{
		loadmeetingVideoNew(IMSId);
		beginMeetingAudio(IMSId,IMSId);
	}
	
}


//发起会议视频
function beginMeetingVideo(remoteUserName,remoteUserId)
{
	   console.log(remoteUserName+remoteUserId);

		var localUserName = $('.pub_banner').attr("user"), localUserId = $('.pub_banner').attr("userId");
		var remoteMedia = 'video' + remoteUserId, localMedia = 'video' + localUserId + '_' + remoteUserId;
		var operationId = 'operation' + localUserId + '_' + remoteUserId;
					
     var IMSCHAT=$(document.getElementById("Meeting"));
		IMSCHAT.find('.video').removeClass('hidden').attr('src', 'images/videoing.png');
		IMSCHAT.find('.audio').addClass('hidden');
		IMSCHAT.find('.hang').removeClass('hidden');		
		IMSCHAT.find("img[id^=bigaudiopicture]").show();	
		com.webrtc.setMediaDisplayLabel(localMedia, remoteMedia);
		
		com.webrtc.setRemoteUserID(remoteUserName);
					
		var tipContent = "向"+remoteUserName+"发起视频会议呼叫...";
		fillTipBox('success',tipContent);
		com.webrtc.call("video","DTLS");
}

function beginMeetingAudio(remoteUserName,remoteUserId)
{
	   console.log(remoteUserName+remoteUserId);

		var localUserName = $('.pub_banner').attr("user"), localUserId = $('.pub_banner').attr("userId");
		var remoteMedia = 'video' + remoteUserId, localMedia = 'video' + localUserId + '_' + remoteUserId;
		var operationId = 'operation' + localUserId + '_' + remoteUserId;
					
     var IMSCHAT=$(document.getElementById("Meeting"));
		IMSCHAT.find('.audio').removeClass('hidden').attr('src', 'images/audioing.png');
		IMSCHAT.find('.video').addClass('hidden');
		IMSCHAT.find('.hang').removeClass('hidden');	
		IMSCHAT.find("img[id^=bigaudiopicture]").show();	
		
		com.webrtc.setMediaDisplayLabel(localMedia, remoteMedia);
		
		com.webrtc.setRemoteUserID(remoteUserName);
					
		var tipContent = "向"+remoteUserName+"发起音频会议呼叫...";
		fillTipBox('success',tipContent);
		com.webrtc.call("audio","DTLS");
}

function endIMSmeetingVideo(){
	$('#meetingInputId').attr("placeholder","请输入会议号");
	$('#meetingInputId').val("");
	var IMSId=$("#videoflag video").attr("id").substr(5);
	console.log("hangup IMSId="+IMSId);
	$("#ullist").children().remove();	
	endMeetingVideo(IMSId,IMSId);
}


function endMeetingVideo(remoteUserName, remoteUserId){
	console.log(remoteUserName+remoteUserId);
	
	var remoteUserNameID=remoteUserName;
				
        var CHAT=$(document.getElementById("Meeting"));
		CHAT.find('.video').removeClass('hidden').attr('src','images/video.png');
		CHAT.find('.audio').removeClass('hidden').attr('src','images/voice.png');
		CHAT.find('.hang').addClass('hidden');
		CHAT.find("img[id^=bigaudiopicture]").hide();	
		
		console.log(com.webrtc.gPeerConnections[remoteUserNameID]);
		
		com.webrtc.hangUp(remoteUserNameID);
		$("#tipbox").tipbox  ({
	        content: '会话已结束',
	        autoclose: true,
	        hasclose: false
		});
}

//发送im消息的方法
function sendMsg(jid, content, divId){
	jid = jid.replace('-', '@');
	com.xmpp.sendChatMessage(jid, content);
	var myemail = $('.pub_banner').attr("user");
	$('#to'+divId).append('<div class=\'leftalign orangeletter strong padding5\'>' + myemail + '</div>');
	$('#to'+divId).append('<div class=\'lefttalign padding5\'>' + content + '</div>');
	console.log('Send message to ' + jid + ': ' + content);
	document.getElementById('to'+divId).scrollTop = document.getElementById('to'+divId).scrollHeight;
}

//取消、关闭浮层
function cancelFaceboxFn(){
	$(document).trigger('close.facebox');			
}
//检查非空
function checkNullIllegal(checkId,tipId){
	var checkValue = $("#"+checkId).val();
	if(!checkValue || checkValue == ""){
		var errorTip = "该项不能为空";
		$("#"+tipId).html(errorTip);
		return false;
	}else{
		$("#"+tipId).html("√");
		return true;
	}
}
//检查是否符合email格式
function checkEmailIllegalFn(checkId,tipId){
	var checkValue = $("#"+checkId).val();
	var check = new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(checkValue);	
	if(!check){
		$("#"+tipId).html("格式错误");
		return false;
	}else{
		$("#"+tipId).html("√");
		return true;	
	}
}
//填充状态提醒框
function fillTipBox(status,content){
	var  tipContent = "<table><tr><td><img src='images/"+status+".png'/></td><td>&nbsp;"+content+"&nbsp;</td></tr></table>";
	 
	$("#tipboxWrapper").html("<div  id=\"tipbox\"  class=\"mytipboxposition\"></div>");
	$("#tipbox").tipbox  ({
	         content:tipContent,
	         autoclose:true,
	         hasclose:false
	});
}
//记录刚刚点击的好友的id
function writeIntoMark(friendId){
	$("#whichIsClicked").val(friendId);
}
function readFromMark(){
	return $("#whichIsClicked").val();
}

//点击“通讯录”，分组显示
 //存储联系人名字
function showFriendListOnAddr(){
	alert('通讯录列表正在加载中，请在加载成功后再切换到好友列表！');
}

function ShowAddListOnRoster(){
	alert('好友列表正在加载中，请在加载成功后再切换到通讯录！');
}
function ShowRoomListOnAddr(){
	alert('好友列表正在加载中，请在加载成功后再切换到群组列表！');
}
function ShowRoomListOnRoster(){
	alert('通讯录列表正在加载中，请在加载成功后再切换到群组列表！');
}

var contactNameList = [];
var contactGroupnameList= [];//存储联系人群组名字的数组

//点击“我的好友”
function showFriendListFn(){
	showFriendFrame('friend');
	showFriendList();
	
}

function showRoomListFn(){
	
	showFriendFrame('room');
	
	showFriendList();
	
	$("#myfriendgb").unbind();
	$('#myfriendgb').click(function(){showFriendListFn();});
	
}

//将用户email转为用户id
function emailToUserId(email){
	var friendList = [];
	friendList = com.xmpp.getRoster();
	for(var i = 0; i < friendList.length; i++){
		if(friendList[i].email_id == email){
			return friendList[i].name.split('@')[0].replace('#','_').replace('.','_');
			console.log(friendList[i].name);
		}
	}
	return undefined;
}

//将用户id转为email
function userIdToEmail(userId){
	var friendList = [];
	friendList = com.xmpp.getRoster();
	console.log(friendList);
	for(var i = 0; i < friendList.length; i++){
		console.log("friendList name:"+friendList[i].name);
//		var fUserId = friendList[i].name.split('@')[0].replace('#','_').replace('.','_');
		var fUserId= friendList[i].name;
		console.log("fUserId:"+fUserId+','+"userId:"+userId);
		if(fUserId == userId){
			return friendList[i].email_id;
		}
	}
	return undefined;
}
//用户退出账号
function logoutForWebrtc(){
	com.xmpp.close();
}

//播放提示音
function playAudioFn() {
    if (window.HTMLAudioElement) { //支持html5的aduio属性，使用之
        var oAudio = document.getElementById('myaudio');
		oAudio.play();	                   
    }
}


