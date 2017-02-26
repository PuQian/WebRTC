//打开会话主窗口的方法
var count=200;
var dialogHeight = 60, dialogWidth = 100;
var t = null, l = null;
function resetPosition(){
	var h = $(window).height(), w = $(window).width();
	if(t == null && l == null){
		t = (h - dialogHeight) / 2;
		l = (w - dialogWidth) / 2;
	}else if( t > $(window).height() - $('.dialogbox').height() || l > $(window).width() - $('.dialogbox').width() - $('#friendlist').width() - 15){
		t = (h - dialogHeight) / 2;
		l = (w - dialogWidth) / 2;
	}else{
		t += 15;
		l += 15;
	}
}

//设置音频head可拖拽
function dragWindow(dragClass, newContent){
	  var bool=false, offsetX = 0, offsetY = 0;   //标识是否移动元素，声明DIV在当前窗口的Left和Top值
	  $('.'+dragClass).mouseover(function(){
	    $(this).css('cursor','move');     //当鼠标移动到拖拽的DIV上的时候，将鼠标的样式设置为移动(move)
	  });

	  $('.'+dragClass).mousedown(function(evt){ 
	    $(this).css('cursor','move');
	    bool=true;                //当鼠标在移动元素按下的时候将bool设定为true
	    offsetX = evt.offsetX;        //获取鼠标在当前窗口的相对偏移位置的Left值并赋值给offsetX
	    offsetY = evt.offsetY;        //获取鼠在当前窗口的相对偏移位置的Top值并赋值给offsetY
	    console.log("down！！！！"+evt.offsetX+"Y!!!!"+evt.offsetY);
	  });

	  $(document).mousemove(  function(evt){
	    if(!bool){                //如果bool为false则返回
	      return;
	    }   
	    var x = evt.clientX-offsetX, y = evt.clientY-offsetY; 
	    if(y < 0){
	      y = 0;
	     }
	    $(newContent).css("left", x);
	    $(newContent).css("top", y);
	  }   ).mouseup(function(){
	    bool=false;               //当鼠标在移动元素起来的时候将bool设定为false
	  });
}

//返回视频会话功能区id
var getContactVideoDiv = function(chatFriendId) {//InfoPrefix = "Info"; CallVideoPrefix = "Video";
	return document.getElementById(CallVideoPrefix + chatFriendId);
};

//返回音频会话功能区id
var getContactAudioDiv = function(chatFriendId) {//CallAudioPrefix = "Audio";"
	return document.getElementById(CallAudioPrefix + chatFriendId);
};

var judgeExist = function(divId) {
	var test = document.getElementById(divId);
	if (test) {
		return true;
	} else {
		return false;
	}
}
var isActive = function(divId) {
	var $test = $(document.getElementById(divId));

	if ("YES" == $test.find("#activeflag").attr("value")) {
		return true;
	}
	if ("NO" == $test.find("#activeflag").attr("value")) {
		return false;
	}
	console.log("do not know the value of active ? ");
	return false;

}

var setNewSessionID = function(divId, friendname, SessionId) {
	var $test = $(document.getElementById(divId));

	$test.find("#sessionId").attr("value", SessionId);

	var $change = $test.find("[name=\"hangup\"]");
	var gRemoteUserID = EaseToWCS(friendname);
	$change.attr("onclick", "HangUpvideo\('" + gRemoteUserID + "','"
			+ SessionId + "'\)");

}

var setActiveFlag = function(divId, flag) {
	var $test = $(document.getElementById(divId));

	$test.find("#activeflag").attr("value", flag);
	console.log("setActionFlag"+flag);
}

////模态框开启视频会话
//var ModalCreateVideoBefore = function(){
//	var contact = $("#myModalLabel").text();
//	createCallVideoPageBefore(contact);
//}
//
//var ModalCreateAudioBefore = function(){
//	var contact = $("#myModalLabel").text();
//	createCallAudioPageBefore(contact);
//}

//创建视频会话预处理
var createCallVideoPageBefore = function(contact) {

	//重新呼叫
	if($(document.getElementById(CallVideoPrefix + contact + "ErrorPage")))
		$(document.getElementById(CallVideoPrefix + contact + "ErrorPage")).remove();
	
	// 与某人通话界面存在 并且正在 通话
	if (true == judgeExist(CallVideoPrefix + contact)
			&& true == isActive(CallVideoPrefix + contact)) 
	{   ///////////////切换为视频界面
		console.log("before video 1");
		showWeb(CallVideoPrefix,contact);
		return;
	}
	// 与某人通话界面存在，但是并未通话
	else if (true == judgeExist(CallVideoPrefix + contact)
			&& false == isActive(CallVideoPrefix + contact)) {
		// 需要更新SessionID，并调用CallVideo执行视频通话
		console.log("before video 2");
		var SessionID = null;
		SessionID = guid();
		setNewSessionID(CallVideoPrefix + contact, contact, SessionID);
		var gRemoteUserID = EaseToWCS(contact);

		Callvideo(gRemoteUserID, SessionID);
		setActiveFlag(CallVideoPrefix + contact, "YES");
		
	
		return;
	}
	else{
		console.log("before video 3");
	    var SessionID = null;
	    SessionID = guid();

	    // 与某人通话界面不存在
	    // 先执行CallVideo执行视频通话，再执行Callvideo
		
	    var contact1=formatToEase(contact);
	    var gRemoteUserID = EaseToWCS(contact1);
	    Callvideo(gRemoteUserID, SessionID);
	    
	    createCallVideoPage(contact, SessionID);  //先hide
	    setActiveFlag(CallVideoPrefix + contact, "YES");
	    
	}
}

var createCallVideoWait = function(contact, SessionID){
	
	console.log("执行callVideoWait+ contact:" + contact +"SessionID:" + SessionID);
	//jxk143@163.com -->  jxk143-163.com
	var contact1=formatToEase(contact);

	//jxk143-163.com -->  jxk143-163.com@WebRTC
	var gRemoteUserID = EaseToWCS(contact1);

	var gLocalUserID = com.webrtc.sigSessionConfig.username;
	var sessionType = com.webrtc.UserSession.TYPE.P2P;
	var moduleType = com.webrtc.UserSession.MODULE_TYPE.VIDEO;
	
    var Div = CallVideoPrefix + contact + "Wait";
    
    resetPosition();
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}

    
	var newContent = document.createElement("div");
	newContent.setAttribute("id", Div);
	document.body.appendChild(newContent);
	
	$(newContent).attr('class', 'pop_chat_voice dialogbox');
	$(newContent).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
	$(newContent).attr('onselectstart', 'return false');//禁止复制
	$(newContent).attr('onselect', 'document.selection.empty()');//不让选择文本内容
	$(newContent).css({'z-index':count++});
	$(newContent).show();
	$(newContent).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		$(this).css({'z-index':count});
	});
	
	
	//加载标题栏
	var titleHeight=40,titleWidth=365,titleTableHeight=40,titleTableWidth=365;
	var titleDiv=document.createElement('div');		//标题Div
	$(newContent).append(titleDiv);
	$(titleDiv).css({'width':titleWidth+'px', 'height':titleHeight+'px'});
	
	var titleTable=document.createElement("table");
	titleDiv.appendChild(titleTable);
	$(titleTable).css({'width':titleTableWidth+'px', 'height':titleTableHeight+'px', 'margin':'-4px 0px'});
	
	var titleTr=document.createElement("tr");
	titleTable.appendChild(titleTr);
	
	var titleTd1=document.createElement("td");
	titleTr.appendChild(titleTd1);
	$(titleTd1).css({'width':'335px','height':'40px'});
	
	var titleTd2=document.createElement("td");
	titleTr.appendChild(titleTd2);
	$(titleTd2).css({'width':'30px','height':'40px'});
	
	
	var dragClass="VideoWait";				//设置窗口可拖拽
	$(titleTd1).attr('class', dragClass);
	dragWindow(dragClass, newContent);
	
	/////////////////加载正在等待回应内容
	var CallState = $("<div class='call_state'></div>");
	$(newContent).append(CallState);
	
	var ClosePop = $("<i class='close_pop' onclick=\"DetermineCancel\('"+ gRemoteUserID +
			"','"+ SessionID +"','video'\)\");'></i>");
	$(newContent).append(ClosePop);
	
	var CallState = $("<div class='call_state'></div>");
	$(newContent).append(CallState);	
	var StateImg = $("<div class='state_img'><img src='css/pc/images/call_video.png' /></div>");
	CallState.append(StateImg);	
    var CallFriendName = $("<p class='title'>"+ contact +"</p><p>正在等待对方回应…</p>");
    CallState.append(CallFriendName);
    
    //////取消按钮
    var CallOperation = $("<div class='call_operation'><div class='call_btn call_btn_cancel' "+
    		"onclick=\"DetermineCancel\('"+ gRemoteUserID + "','"+ SessionID +"','video'\)\">取消</div></div>");
    $(newContent).append(CallOperation);
	console.log("createVideoWaitPage finish!");
	
}

var DetermineCancel = function(remoteID,SessionID,moduleType){


    var type = null;
    if(moduleType == "video"){
        type = "视频";
    }
    else if(moduleType == "audio"){
        type = "音频";
    }
    var content = "确定取消与" + formatRechange(remoteID) + "的" + type + "会话？";

    $.tipModal('confirm', 'warning', content, 
        function(result) {
        console.log('warning callback: ' + result);
        if(result == false){ //不取消呼叫
            return;
        }
        else{ //确认取消呼叫
            if(moduleType == "video")
            {
                CancelVideo(remoteID,SessionID);
            }
            else if(moduleType == "audio")
            {
                CancelAudio(remoteID,SessionID);
            }
        }
    }
    );
}

//主叫方主动取消视频呼叫
var CancelVideo = function(gRemoteUserID,SessionID){
	console.log("cacelVideo--remoteID:"+ gRemoteUserID +"--sessionId:"+SessionID);
	HangUpvideo(gRemoteUserID,SessionID);
	if($(document.getElementById(CallVideoPrefix + formatRechange(gRemoteUserID) + "Wait"))){
       $(document.getElementById(CallVideoPrefix + formatRechange(gRemoteUserID) + "Wait")).remove();
	}
}

////删除等待视频界面
//var RemoveVideoWaitPage = function(contact){
//	if($(document.getElementById(CallVideoPrefix + contact + "Wait")))
//		$(document.getElementById(CallVideoPrefix + contact + "Wait")).remove();
//	else
//		console.log("VideoWaitPage doesn't exist!");
//}

//接收方直接调用此函数，发送方先调用createCallVideoPageBefore
//创建视频会话界面(没有添加隐藏的sessionID 以及 activeflag)
var createCallVideoPage = function(contact, sessionid) {
	
	//count++;
	console.log("******************creat Video count******************="+count);
//	console.log(contact);
	var SessionID = sessionid;

	//jxk143@163.com -->  jxk143-163.com
	var contact1=formatToEase(contact);

	//jxk143-163.com -->  jxk143-163.com@WebRTC
	var gRemoteUserID = EaseToWCS(contact1);
	console.log("gRemoteUserID="+gRemoteUserID);

	var gLocalUserID = com.webrtc.sigSessionConfig.username;
	var sessionType = com.webrtc.UserSession.TYPE.P2P;
	var moduleType = com.webrtc.UserSession.MODULE_TYPE.VIDEO;
	
    var Div = CallVideoPrefix + contact;
    
    resetPosition();
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}

    
	var newContent = document.createElement("div");
	newContent.setAttribute("id", Div);
	document.body.appendChild(newContent);
	
	$(newContent).attr('class', 'pop_chat_voice dialogbox');
	$(newContent).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
	$(newContent).attr('onselectstart', 'return false');//禁止复制
	$(newContent).attr('onselect', 'document.selection.empty()');//不让选择文本内容
	$(newContent).css({'z-index':count++});
	$(newContent).hide();
	$(newContent).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		console.log("++++++++++++++++creat Video count end +++++++++++++++++="+count);
		$(this).css({'z-index':count});
	});
	
	

	//加载标题栏
	var titleHeight=60,titleWidth=365,titleTableHeight=40,titleTableWidth=365;
	var titleDiv=document.createElement('div');		//标题Div
	$(newContent).append(titleDiv);
	$(titleDiv).css({'width':titleWidth+'px', 'height':titleHeight+'px'});
	
	var titleTable=document.createElement("table");
	titleDiv.appendChild(titleTable);
	$(titleTable).css({'width':titleTableWidth+'px', 'height':titleTableHeight+'px', 'margin':'-4px 0px'});
	
	var titleTr=document.createElement("tr");
	titleTable.appendChild(titleTr);
	
	var titleTd1=document.createElement("td");
	titleTr.appendChild(titleTd1);
	$(titleTd1).css({'width':'335px','height':'40px','background-color':'#4196ca'});
	
	var titleTd2=document.createElement("td");
	titleTr.appendChild(titleTd2);
	$(titleTd2).css({'width':'30px','height':'40px','background-color':'#4196ca'});
	
	var FriendTitle = $("<p class='title' onclick=\"\('"
			+ contact+ "'\);\">" + contact + "</p><p>正在通话中...</p>");
	$(titleTd1).append(FriendTitle);
	var CloseVideo =$("<div class='close_pop' onclick=\"HangUpvideo\('"
			+ gRemoteUserID + "','" + SessionID + "'\)\">关闭</div>");
	 $(titleTd2).append(CloseVideo);
	

	var titleClass=contact.replace(".","a");
	var titleClass1=titleClass.replace("@","b");
	var dragClass='Video'+titleClass1;				//设置窗口可拖拽
	$(titleTd1).attr('class', dragClass);
	dragWindow(dragClass, newContent);
	
    
    /////////////////////////////video图像


   var Video = $("<div class='call_video'></div>");
   $(newContent).append(Video);
//   var VideoImg = $("<div class='video_img'>"+
//   "<img src='css/pc/images/videoing.jpg'/></div>");
//   Video.append(VideoImg);

	var RemoteVideo =  $("<video class='remote' id=\""
			+ gRemoteUserID + gLocalUserID + sessionType + moduleType
			+ "\" autoplay=\"autoplay\" ></video>");
	Video.append(RemoteVideo);

	var LocalVideo = $("<video class='local' id=\""
			+ gLocalUserID + gRemoteUserID + sessionType + moduleType
			+ "\" autoplay=\"autoplay\" ></video>");
	Video.append(LocalVideo);
    createActiveList(contact,CallVideoPrefix);

	console.log("createVideoPage finish!");
	
	//本端静音
    document.getElementById(gLocalUserID+gRemoteUserID+sessionType+moduleType).muted=true;

}


//视频-收到错误消息的显示界面
var createVideoErrorPage = function(RemoteUserID,error){
	
	console.log("执行callVideoErrorPage RemoteID:" + RemoteUserID +"--error:" + error);

	var gLocalUserID = com.webrtc.sigSessionConfig.username;
	var sessionType = com.webrtc.UserSession.TYPE.P2P;
	var moduleType = com.webrtc.UserSession.MODULE_TYPE.VIDEO;
	
	//contact为对方好友账户名
	var contact = formatRechange(RemoteUserID);
    var Div = CallVideoPrefix + contact + "ErrorPage";
    
    resetPosition();
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}

    
	var newContent = document.createElement("div");
	newContent.setAttribute("id", Div);
	document.body.appendChild(newContent);
	
	$(newContent).attr('class', 'pop_chat_voice dialogbox');
	$(newContent).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
	$(newContent).attr('onselectstart', 'return false');//禁止复制
	$(newContent).attr('onselect', 'document.selection.empty()');//不让选择文本内容
	$(newContent).css({'z-index':count++});
	$(newContent).show();
	$(newContent).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		$(this).css({'z-index':count});
	});
	
	
	//加载标题栏
	var titleHeight=40,titleWidth=365,titleTableHeight=40,titleTableWidth=365;
	var titleDiv=document.createElement('div');		//标题Div
	$(newContent).append(titleDiv);
	$(titleDiv).css({'width':titleWidth+'px', 'height':titleHeight+'px'});
	
	var titleTable=document.createElement("table");
	titleDiv.appendChild(titleTable);
	$(titleTable).css({'width':titleTableWidth+'px', 'height':titleTableHeight+'px', 'margin':'-4px 0px'});
	
	var titleTr=document.createElement("tr");
	titleTable.appendChild(titleTr);
	
	var titleTd1=document.createElement("td");
	titleTr.appendChild(titleTd1);
	$(titleTd1).css({'width':'335px','height':'40px'});
	
	var titleTd2=document.createElement("td");
	titleTr.appendChild(titleTd2);
	$(titleTd2).css({'width':'30px','height':'40px'});
	
	
	var dragClass="VideoWait";				//设置窗口可拖拽
	$(titleTd1).attr('class', dragClass);
	dragWindow(dragClass, newContent);
	
	////////////加载具体视频错误内容
	
	var CallState = $("<div class='call_state'></div>");
	$(newContent).append(CallState);
	
	var ClosePop = $("<i class='close_pop' onclick='RemoveVideoErrorPage(\""+ contact +"\");'></i>");
	$(newContent).append(ClosePop);
	var CallState = $("<div class='call_state'></div>");
	$(newContent).append(CallState);
	
	var StateImg = $("<div class='state_img'><img src='css/pc/images/call_tips.png' /></div>");
	CallState.append(StateImg);
	
	var CallFriendName = $("<p class='title'>"+ contact +"</p>");
	CallState.append(CallFriendName);
	   
	if( error == com.webrtc.protocol.RTCRoapErrorType['offline']){
	     var ErrorType = $("<p>对端不在线，视频通话失败...</p>");
	     CallState.append(ErrorType);
	     console.log("The remote user '" + RemoteUserID + "' is offline!");
	}
	else if( error == com.webrtc.protocol.RTCRoapErrorType['timeout']){
	     var ErrorType = $("<p>视频请求超时...</p>");
	     CallState.append(ErrorType);
	     console.log("The remote user '" + RemoteUserID + "' is timeout!");
	}
	else if( error == com.webrtc.protocol.RTCRoapErrorType['refused']){
	     var ErrorType = $("<p>对端拒绝视频请求...</p>");
	     CallState.append(ErrorType);
	     console.log("The remote user '" + RemoteUserID + "' is refused!");
	}
	else {
	     var ErrorType = $("<p>其他错误，视频通话失败...</p>");
	     CallState.append(ErrorType);
	     console.log("The remote user '" + RemoteUserID + "'receive other error !");
	}
	
	////////加载底端操作按钮
	var CallOperation = $("<div class='call_operation'></div>");
	$(newContent).append(CallOperation);
	
	var Recall = $("<div class='call_btn call_btn_recall' onclick='createCallVideoPageBefore(\""+ contact +"\")'>重拨</div>");
	CallOperation.append(Recall);
	var CallCancel = $("<div class='call_btn call_btn_cancel' onclick='RemoveVideoErrorPage(\""+ contact +"\")'>取消</div>");
	CallOperation.append(CallCancel);

	console.log("createVideoWaitPage finish!");
}

//删除视频错误界面
var RemoveVideoErrorPage = function(contact){
	$(document.getElementById(CallVideoPrefix + contact + "ErrorPage")).remove();
}




////创建视频会话预处理
//var createCallVideoPageBefore = function(contact) {
//	console.log(contact);
//	// 与某人通话界面存在 并且正在 通话
//	
//	if (true == judgeExist(CallVideoPrefix + contact)
//			&& true == isActive(CallVideoPrefix + contact)) 
//	{   ///////////////切换为视频界面
//		console.log("before video 1");
//		showWeb(CallVideoPrefix,contact);
//		return;
//	}
//	// 与某人通话界面存在，但是并未通话
//	else if (true == judgeExist(CallVideoPrefix + contact)
//			&& false == isActive(CallVideoPrefix + contact)) {
//		// 需要更新SessionID，并调用CallVideo执行视频通话
//		console.log("before video 2");
//		var SessionID = null;
//		SessionID = guid();
//		setNewSessionID(CallVideoPrefix + contact, contact, SessionID);
//		var gRemoteUserID = EaseToWCS(contact);
//
//		Callvideo(gRemoteUserID, SessionID);
//		setActiveFlag(CallVideoPrefix + contact, "YES");
//		
//        ///////////////切换为视频界面
//		showWeb(CallVideoPrefix,contact);
//	
//		return;
//	}
//	else{
//		console.log("before video 3");
//	    var SessionID = null;
//	    SessionID = guid();
//
//	    // 与某人通话界面不存在
//	    // 先生成界面，再调用CallVideo执行视频通话
//	    createCallVideoPage(contact, SessionID);
//		
//	    var contact1=formatToEase(contact);
//	    var gRemoteUserID = EaseToWCS(contact1);
//	    Callvideo(gRemoteUserID, SessionID);
//	    setActiveFlag(CallVideoPrefix + contact, "YES");
//	}
//}
////接收方直接调用此函数，发送方先调用createCallVideoPageBefore
////创建视频会话界面
//var createCallVideoPage = function(contact, sessionid) {
//	
//	console.log(contact);
//	var SessionID = sessionid;
//
//	//jxk143@163.com -->  jxk143-163.com
//	var contact1=formatToEase(contact);
//
//	//jxk143-163.com -->  jxk143-163.com@WebRTC
//	var gRemoteUserID = EaseToWCS(contact1);
//	console.log("gRemoteUserID="+gRemoteUserID);
//
//	var gLocalUserID = com.webrtc.sigSessionConfig.username;
//	var sessionType = com.webrtc.UserSession.TYPE.P2P;
//	var moduleType = com.webrtc.UserSession.MODULE_TYPE.VIDEO;
//	
//    var Div = CallVideoPrefix + contact;
//    
//	var newContent = document.createElement("div");
//	newContent.setAttribute("id", Div);
//
//    /////////////////////////////video图像
//    var Video = $("<div class='call_video'></div>");
//    $(newContent).append(Video);
//
//	var RemoteVideo =  $("<video class='remote' id=\""
//			+ gRemoteUserID + gLocalUserID + sessionType + moduleType
//			+ "\" autoplay=\"autoplay\" ></video>");
//	Video.append(RemoteVideo);
//
//	var LocalVideo = $("<video class='local' id=\""
//			+ gLocalUserID + gRemoteUserID + sessionType + moduleType
//			+ "\" autoplay=\"autoplay\" ></video>");
//	Video.append(LocalVideo);
//	
//  	var FriendTitle = $("<p class='title' onclick=\"FriendModalFunctionArea\('"
//			+ contact+ "'\);\">" + contact + "</p>");
//	Video.append(FriendTitle);
//
//    ////////////////////////////bottombuttons
//    var bottomButtons = $("<div class='call_operation'>");
//    $(newContent).append(bottomButtons);
//	var hangupbutton = $("<div class='call_btn call_btn_hang' onclick=\"HangUpvideo\('"
//			+ gRemoteUserID + "','" + SessionID + "'\)\">挂断</div>")
//	bottomButtons.append(hangupbutton);
//
//	var toAudio = $("<div class='call_btn call_btn_audio2'>转为音频</div>");
//	bottomButtons.append(toAudio);
//
//	var toKey = $("<div class='call_btn call_btn_key_open call_btn_non'>收起键盘</div>");
//	bottomButtons.append(toKey);
//    /////////////////////////////////////////
//
//	var $activeflag = $("<input type=\"hidden\" id=\"activeflag\" value=\"NO\">");
//	var $sessionid = $("<input type=\"hidden\" id=\"sessionId\" value=\""
//			+ SessionID + "\">");
//
//	$(newContent).append($activeflag);
//	$(newContent).append($sessionid);
//
//	$("#web").append(newContent);
//	
//	createActiveList(contact,CallVideoPrefix);
//	showWeb(CallVideoPrefix,contact);
//	
//	console.log("createVideoPage finish!");
//	
//	//本端静音
//    document.getElementById(gLocalUserID+gRemoteUserID+sessionType+moduleType).muted=true;
//
//}


//发送方创建音频会话预处理
var createCallAudioPageBefore = function(contact){ 
	
	//删除上次可能存在的连接失败界面
	if($(document.getElementById(CallAudioPrefix + contact + "ErrorPage")))
		$(document.getElementById(CallAudioPrefix + contact + "ErrorPage")).remove();
	
	// 与某人通话界面存在 并且正在 通话
	if (true == judgeExist(CallAudioPrefix + contact)
			&& true == isActive(CallAudioPrefix + contact)) {
		console.log("before audio 1");
		showWeb(CallAudioPrefix,contact);
	}
	// 与某人通话界面存在，但是并未通话
	else if (true == judgeExist(CallAudioPrefix + contact)
			&& false == isActive(CallAudioPrefix + contact)) {
		// 需要更新SessionID，并调用CallAudio执行视频通话
		console.log("before audio 2");
		var SessionID = null;
		SessionID = guid();
		setNewSessionID(CallAudioPrefix + contact, contact, SessionID);
		var gRemoteUserID = EaseToWCS(contact);

		Callaudio(gRemoteUserID, SessionID);
		setActiveFlag(CallAudioPrefix + contact, "YES");
	}
	else{
	   console.log("before audio 3");
	   var SessionID = null;
	   SessionID = guid();
	   // 与某人通话界面不存在
	  
	   var contact1=formatToEase(contact);
	   var gRemoteUserID = EaseToWCS(contact1);
	   Callaudio(gRemoteUserID, SessionID);

	   createCallAudioPage(contact, SessionID);  //先hide
	   
	   setActiveFlag(CallAudioPrefix + contact, "YES");
	}
}
		
//创建正在等待对方音频回应界面		
var createCallAudioWait = function(contact, SessionID){
		
		console.log("执行callAudioWait+ contact:" + contact +"SessionID:" + SessionID);
		//jxk143@163.com -->  jxk143-163.com
		var contact1=formatToEase(contact);
		
		//jxk143-163.com -->  jxk143-163.com@WebRTC
		var gRemoteUserID = EaseToWCS(contact1);
		
		var gLocalUserID = com.webrtc.sigSessionConfig.username;
		var sessionType = com.webrtc.UserSession.TYPE.P2P;
		var moduleType = com.webrtc.UserSession.MODULE_TYPE.AUDIO;
		
		var Div = CallAudioPrefix + contact + "Wait";
		
		resetPosition();
		if(t < 0){t = 30;}
		if(l < 0){l = 60;}
		
		
		var newContent = document.createElement("div");
		newContent.setAttribute("id", Div);
		document.body.appendChild(newContent);
		
		$(newContent).attr('class', 'pop_chat_voice dialogbox');
		$(newContent).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
		$(newContent).attr('onselectstart', 'return false');//禁止复制
		$(newContent).attr('onselect', 'document.selection.empty()');//不让选择文本内容
		$(newContent).css({'z-index':count++});
		$(newContent).show();
		$(newContent).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		$(this).css({'z-index':count});
		});
		
		
		//加载标题栏
		var titleHeight=40,titleWidth=365,titleTableHeight=40,titleTableWidth=365;
		var titleDiv=document.createElement('div');		//标题Div
		$(newContent).append(titleDiv);
		$(titleDiv).css({'width':titleWidth+'px', 'height':titleHeight+'px'});
		
		var titleTable=document.createElement("table");
		titleDiv.appendChild(titleTable);
		$(titleTable).css({'width':titleTableWidth+'px', 'height':titleTableHeight+'px', 'margin':'-4px 0px'});
		
		var titleTr=document.createElement("tr");
		titleTable.appendChild(titleTr);
		
		var titleTd1=document.createElement("td");
		titleTr.appendChild(titleTd1);
		$(titleTd1).css({'width':'335px','height':'40px'});
		
		var titleTd2=document.createElement("td");
		titleTr.appendChild(titleTd2);
		$(titleTd2).css({'width':'30px','height':'40px'});
		
		
		var dragClass="VideoWait";				//设置窗口可拖拽
		$(titleTd1).attr('class', dragClass);
		dragWindow(dragClass, newContent);
		
		/////////////////加载正在等待回应内容
		var CallState = $("<div class='call_state'></div>");
		$(newContent).append(CallState);
		
		var ClosePop = $("<i class='close_pop' onclick=\"DetermineCancel\('"+ gRemoteUserID +
			"','"+ SessionID +"','audio'\)\"></i>");
		$(newContent).append(ClosePop);
		var CallState = $("<div class='call_state'></div>");
		$(newContent).append(CallState);
		
		var StateImg = $("<div class='state_img'><img src='css/pc/images/call_voice.png' /></div>");
		CallState.append(StateImg);
		
		var CallFriendName = $("<p class='title'>"+ contact +"</p><p>正在等待对方回应…</p>");
		CallState.append(CallFriendName);
		
	    //////取消按钮
	    var CallOperation = $("<div class='call_operation'><div class='call_btn call_btn_cancel' "+
	    	"onclick=\"DetermineCancel\('"+ gRemoteUserID + "','"+ SessionID +"','audio'\)\">取消</div></div>");
	    $(newContent).append(CallOperation);
	    
		console.log("createAudioWaitPage finish!");
		
}

//删除等待音频界面
var RemoveAudioWaitPage = function(contact){
	if($(document.getElementById(CallAudioPrefix + contact + "Wait")))
		$(document.getElementById(CallAudioPrefix + contact + "Wait")).remove();
	else
		console.log("AudioWaitPage doesn't exist!");
}

//主叫方主动取消音频呼叫
var CancelAudio = function(gRemoteUserID,SessionID){
	console.log("cacelAudio--remoteID:"+ gRemoteUserID +"--sessionId:"+SessionID);
	HangUpaudio(gRemoteUserID,SessionID);
	if($(document.getElementById(CallAudioPrefix + formatRechange(gRemoteUserID) + "Wait"))){
       $(document.getElementById(CallAudioPrefix + formatRechange(gRemoteUserID) + "Wait")).remove();
	}
}

//创建音频会话界面
var createCallAudioPage = function(contact, sessionid) {
          							//count为全局变量,用来决定层的堆叠顺序
	console.log("****************create Audio count*************="+count);
	
	var SessionID = sessionid;
	var contact1=formatToEase(contact);
	var gRemoteUserID = EaseToWCS(contact1);

	var gLocalUserID = com.webrtc.sigSessionConfig.username;
	var sessionType = com.webrtc.UserSession.TYPE.P2P;
	var moduleType = com.webrtc.UserSession.MODULE_TYPE.AUDIO;
	
    var AudioDivId = CallAudioPrefix + contact;
    
    
    resetPosition()
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}
    
	var newContent = document.createElement("div");
	newContent.setAttribute("id", AudioDivId);
	document.body.appendChild(newContent);
	//$(newContent).css({'width':dialogWidth+'px', 'height':dialogHeight+'px', 'background-color':'#eeee00'});
	console.log("mx----t:"+t+"---l:"+l);
	$(newContent).attr('class', 'pop_chat_voice dialogbox');
	$(newContent).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
	$(newContent).attr('onselectstart', 'return false');//禁止复制
	$(newContent).attr('onselect', 'document.selection.empty()');//不让选择文本内容
	$(newContent).css({'z-index':count++});
	$(newContent).hide();
	$(newContent).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		console.log("****************Audio end count*************="+count);
		$(this).css({'z-index':count});
	});
	
	//加载标题栏
	var titleHeight=60,titleWidth=365,titleTableHeight=40,titleTableWidth=365;
	var titleDiv=document.createElement('div');		//标题Div
	$(newContent).append(titleDiv);
	$(titleDiv).css({'width':titleWidth+'px', 'height':titleHeight+'px'});
	
	var titleTable=document.createElement("table");
	titleDiv.appendChild(titleTable);
	$(titleTable).css({'width':titleTableWidth+'px', 'height':titleTableHeight+'px', 'margin':'-4px 0px'});
	
	var titleTr=document.createElement("tr");
	titleTable.appendChild(titleTr);
	
	var titleTd1=document.createElement("td");
	titleTr.appendChild(titleTd1);
	$(titleTd1).css({'width':'335px','height':'40px','background-color':'#4196ca'});
	
	var titleTd2=document.createElement("td");
	titleTr.appendChild(titleTd2);
	$(titleTd2).css({'width':'30px','height':'40px','background-color':'#4196ca'});
	
	var FriendTitle = $("<p class='title' onclick=\"\('"
			+ contact+ "'\);\">" + contact + "</p>");
	$(titleTd1).append(FriendTitle);
	
	var CloseAudio =$("<div class='close_pop' onclick=\"HangUpaudio\('"
			+ gRemoteUserID + "','" + SessionID + "'\)\">关闭</div>");
	 $(titleTd2).append(CloseAudio);

	var titleClass=contact.replace(".","a");
	var titleClass1=titleClass.replace("@","b");
	var dragClass='drag'+titleClass1;				//设置窗口可拖拽
	$(titleTd1).attr('class', dragClass);
	dragWindow(dragClass, newContent);
	
	
	 /////////////////////////////Audio图像
	
    var AudioBox = $("<div class='call_state'></div>");
    $(newContent).append(AudioBox);

    var AudioImg = $("<div class='state_img'>"+
    	    "<img src='css/pc/images/img/portrait65_2.jpg'/></div>");

    AudioBox.append(AudioImg);

	var RemoteAudio =  $("<Audio id=\""
			+ gRemoteUserID + gLocalUserID + sessionType + moduleType
			+ "\" autoplay=\"autoplay\" ></Audio>");
	AudioBox.append(RemoteAudio);

	var LocalAudio = $("<Audio id=\""
			+ gLocalUserID + gRemoteUserID + sessionType + moduleType
			+ "\" autoplay=\"autoplay\" ></Audio>");
	AudioBox.append(LocalAudio);
	
  	var FriendTitle = $("<p class='title' onclick=\"\('"
			+ contact+ "'\);\">" + contact + "</p><p>正在通话中...</p>");
	AudioBox.append(FriendTitle);

    ////////////////////////////bottombuttons
    var bottomButtons = $("<div class='call_operation'>");
    $(newContent).append(bottomButtons);
	var hangupbutton = $("<div class='call_btn call_btn_hang' onclick=\"HangUpaudio\('"
			+ gRemoteUserID + "','" + SessionID + "'\)\">挂断</div>")
	bottomButtons.append(hangupbutton);

    /////////////////////////////////////////

	createActiveList(contact,CallAudioPrefix);
	//showWeb(CallAudioPrefix,contact);
	
	console.log("createAudioPage finish!");
	
	//本端静音
    document.getElementById(gLocalUserID+gRemoteUserID+sessionType+moduleType).muted=true;

}


//收到音频错误消息的显示界面
var createAudioErrorPage = function(RemoteUserID,error){
	
	console.log("执行callAudioErrorPage RemoteID:" + RemoteUserID +"--error:" + error);

	var gLocalUserID = com.webrtc.sigSessionConfig.username;
	var sessionType = com.webrtc.UserSession.TYPE.P2P;
	var moduleType = com.webrtc.UserSession.MODULE_TYPE.AUDIO;
	
	//contact为对方好友账户名
	var contact = formatRechange(RemoteUserID);
    var Div = CallAudioPrefix + contact + "ErrorPage";
    
    resetPosition();
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}

    
	var newContent = document.createElement("div");
	newContent.setAttribute("id", Div);
	document.body.appendChild(newContent);
	
	$(newContent).attr('class', 'pop_chat_voice dialogbox');
	$(newContent).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
	$(newContent).attr('onselectstart', 'return false');//禁止复制
	$(newContent).attr('onselect', 'document.selection.empty()');//不让选择文本内容
	$(newContent).css({'z-index':count++});
	$(newContent).show();
	$(newContent).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		$(this).css({'z-index':count});
	});
	
	
	//加载标题栏
	var titleHeight=40,titleWidth=365,titleTableHeight=40,titleTableWidth=365;
	var titleDiv=document.createElement('div');		//标题Div
	$(newContent).append(titleDiv);
	$(titleDiv).css({'width':titleWidth+'px', 'height':titleHeight+'px'});
	
	var titleTable=document.createElement("table");
	titleDiv.appendChild(titleTable);
	$(titleTable).css({'width':titleTableWidth+'px', 'height':titleTableHeight+'px', 'margin':'-4px 0px'});
	
	var titleTr=document.createElement("tr");
	titleTable.appendChild(titleTr);
	
	var titleTd1=document.createElement("td");
	titleTr.appendChild(titleTd1);
	$(titleTd1).css({'width':'335px','height':'40px'});
	
	var titleTd2=document.createElement("td");
	titleTr.appendChild(titleTd2);
	$(titleTd2).css({'width':'30px','height':'40px'});
	
	
	var dragClass="VideoWait";				//设置窗口可拖拽
	$(titleTd1).attr('class', dragClass);
	dragWindow(dragClass, newContent);
	
	////////////加载具体视频错误内容
	
	var CallState = $("<div class='call_state'></div>");
	$(newContent).append(CallState);
	
	var ClosePop = $("<i class='close_pop' onclick='RemoveAudioErrorPage(\""+ contact +"\");'></i>");
	$(newContent).append(ClosePop);
	var CallState = $("<div class='call_state'></div>");
	$(newContent).append(CallState);
	
	var StateImg = $("<div class='state_img'><img src='css/pc/images/call_tips.png' /></div>");
	CallState.append(StateImg);
	
	var CallFriendName = $("<p class='title'>"+ contact +"</p>");
	CallState.append(CallFriendName);
	   
	if( error == com.webrtc.protocol.RTCRoapErrorType['offline']){
	     var ErrorType = $("<p>对端不在线，音频通话失败...</p>");
	     CallState.append(ErrorType);
	     console.log("The remote user '" + RemoteUserID + "' is offline!");
	}
	else if( error == com.webrtc.protocol.RTCRoapErrorType['timeout']){
	     var ErrorType = $("<p>音频请求超时...</p>");
	     CallState.append(ErrorType);
	     console.log("The remote user '" + RemoteUserID + "' is timeout!");
	}
	else if( error == com.webrtc.protocol.RTCRoapErrorType['refused']){
	     var ErrorType = $("<p>对端拒绝音频请求...</p>");
	     CallState.append(ErrorType);
	     console.log("The remote user '" + RemoteUserID + "' is refused!");
	}
	else {
	     var ErrorType = $("<p>其他错误，音频通话失败...</p>");
	     CallState.append(ErrorType);
	     console.log("The remote user '" + RemoteUserID + "'receive other error !");
	}
	
	////////加载底端操作按钮
	var CallOperation = $("<div class='call_operation'></div>");
	$(newContent).append(CallOperation);
	
	var Recall = $("<div class='call_btn call_btn_recall' onclick='createCallAudioPageBefore(\""+ contact +"\")'>重拨</div>");
	CallOperation.append(Recall);
	var CallCancel = $("<div class='call_btn call_btn_cancel' onclick='RemoveAudioErrorPage(\""+ contact +"\")'>取消</div>");
	CallOperation.append(CallCancel);

	console.log("createVideoWaitPage finish!");
}

//删除音频错误界面
var RemoveAudioErrorPage = function(contact){
	$(document.getElementById(CallAudioPrefix + contact + "ErrorPage")).remove();
}






////发送方创建音频会话预处理
//var createCallAudioPageBefore = function(contact){ 
//	// 与某人通话界面存在 并且正在 通话
//	if (true == judgeExist(CallAudioPrefix + contact)
//			&& true == isActive(CallAudioPrefix + contact)) {
//		console.log("before audio 1");
//		showWeb(CallAudioPrefix,contact);
//	}
//	// 与某人通话界面存在，但是并未通话
//	else if (true == judgeExist(CallAudioPrefix + contact)
//			&& false == isActive(CallAudioPrefix + contact)) {
//		// 需要更新SessionID，并调用CallAudio执行视频通话
//		console.log("before audio 2");
//		var SessionID = null;
//		SessionID = guid();
//		setNewSessionID(CallAudioPrefix + contact, contact, SessionID);
//		var gRemoteUserID = EaseToWCS(contact);
//
//		Callaudio(gRemoteUserID, SessionID);
//		setActiveFlag(CallAudioPrefix + contact, "YES");
//	}
//	else{
//	   console.log("before audio 3");
//	   var SessionID = null;
//	   SessionID = guid();
//	   // 与某人通话界面不存在
//	   // 先生成界面，再调用CallAudio执行音频通话
//	   createCallAudioPage(contact, SessionID);
//
//	   var contact1=formatToEase(contact);
//	   var gRemoteUserID = EaseToWCS(contact1);
//	   Callaudio(gRemoteUserID, SessionID);
//	   setActiveFlag(CallAudioPrefix + contact, "YES");
//	}
//}
//
////创建音频会话界面
//var createCallAudioPage = function(contact, sessionid) {
//	var SessionID = sessionid;
//
//	var contact1=formatToEase(contact);
//	var gRemoteUserID = EaseToWCS(contact1);
//
//	var gLocalUserID = com.webrtc.sigSessionConfig.username;
//	var sessionType = com.webrtc.UserSession.TYPE.P2P;
//	var moduleType = com.webrtc.UserSession.MODULE_TYPE.AUDIO;
//	
//    var AudioDivId = CallAudioPrefix + contact;
//    
//	var newContent = document.createElement("div");
//	newContent.setAttribute("id", AudioDivId);
//
//    /////////////////////////////Audio图像
//    var AudioBox = $("<div class='call_state'></div>");
//    $(newContent).append(AudioBox);
//
//    var AudioImg = $("<div class='state_img'>"+
//    	    "<img src='css/pc/images/portrait118.png' width='118' height='118' /></div>");
//    AudioBox.append(AudioImg);
//
//	var RemoteAudio =  $("<Audio id=\""
//			+ gRemoteUserID + gLocalUserID + sessionType + moduleType
//			+ "\" autoplay=\"autoplay\" ></Audio>");
//	AudioBox.append(RemoteAudio);
//
//	var LocalAudio = $("<Audio id=\""
//			+ gLocalUserID + gRemoteUserID + sessionType + moduleType
//			+ "\" autoplay=\"autoplay\" ></Audio>");
//	AudioBox.append(LocalAudio);
//	
//  	var FriendTitle = $("<p class='title' onclick=\"FriendModalFunctionArea\('"
//			+ contact+ "'\);\">" + contact + "</p><p>正在通话中...</p>");
//	AudioBox.append(FriendTitle);
//
//    ////////////////////////////bottombuttons
//    var bottomButtons = $("<div class='call_operation'>");
//    $(newContent).append(bottomButtons);
//	var hangupbutton = $("<div class='call_btn call_btn_hang' onclick=\"HangUpaudio\('"
//			+ gRemoteUserID + "','" + SessionID + "'\)\">挂断</div>")
//	bottomButtons.append(hangupbutton);
//
//	var toAudio = $("<div class='call_btn call_btn_video2'>转为视频</div>");
//	bottomButtons.append(toAudio);
//
//	var toKey = $("<div class='call_btn call_btn_key_open'>打开键盘</div>");
//	bottomButtons.append(toKey);
//    /////////////////////////////////////////
//
//	var $activeflag = $("<input type=\"hidden\" id=\"activeflag\" value=\"NO\">");
//	var $sessionid = $("<input type=\"hidden\" id=\"sessionId\" value=\""
//			+ SessionID + "\">");
//
//	$(newContent).append($activeflag);
//	$(newContent).append($sessionid);
//
//	$("#web").append(newContent);
//	
//	createActiveList(contact,CallAudioPrefix);
//	showWeb(CallAudioPrefix,contact);
//	
//	console.log("createAudioPage finish!");
//	
//	//本端静音
//    document.getElementById(gLocalUserID+gRemoteUserID+sessionType+moduleType).muted=true;
//
//}
