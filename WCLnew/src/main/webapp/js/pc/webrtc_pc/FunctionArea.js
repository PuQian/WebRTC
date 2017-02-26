var WebPhone = function(element){
	
	toggleListMenu("recent_calls","rtc_menu",element);//高亮这个菜单项
	if(getWebPhoneDiv()!=null){
		if(document.getElementById(WebPhonePrefix + "PhoneAudioing")){
			showWeb(WebPhonePrefix,"PhoneAudioing");
		}
		else if(document.getElementById(WebPhonePrefix + "PhoneVideoing")){
			showWeb(WebPhonePrefix,"PhoneVideoing");
		}
		else{
		      showWeb(WebPhonePrefix,"Phone");
		}
		return;
	}
	var newContent = $("<div id='WebPhonePhone'></div>");
	var CallInput = $("<div class='call_input'></div>");
	newContent.append(CallInput);
	
	var InputLeft = $("<div class='call_add_mail'>加入通讯录</div>");
	CallInput.append(InputLeft);
	var InputCenter = $("<input name='PhoneInput' type='text' class='call_input_num' placeholder='输入号码'/>");
	CallInput.append(InputCenter);
	var InputRight = $("<div class='call_minus_num' onclick='DeletePhoneInput();'>退位</div>");
	CallInput.append(InputRight);

	
	var number = $("<div class='call_num'><ul>"+
		"<li onclick='InsertPhoneInput(\"1\");'>1</li>"+
        "<li onclick='InsertPhoneInput(\"2\");'>2</li>"+
        "<li onclick='InsertPhoneInput(\"3\");'>3</li>"+
        "<li onclick='InsertPhoneInput(\"4\");'>4</li>"+
        "<li onclick='InsertPhoneInput(\"5\");'>5</li>"+
        "<li onclick='InsertPhoneInput(\"6\");'>6</li>"+
        "<li onclick='InsertPhoneInput(\"7\");'>7</li>"+
        "<li onclick='InsertPhoneInput(\"8\");'>8</li>"+
        "<li onclick='InsertPhoneInput(\"9\");'>9</li>"+
        "<li>*</li>"+
        "<li onclick='InsertPhoneInput(\"0\");'>0</li>"+
        "<li>#</li></ul></div>");
	newContent.append(number);
	
	var CallOperation = $("<div class='call_operation'>"+
	    "<div class='call_btn call_btn_mail'>通讯录</div>"+
//	    "<div class='call_btn call_btn_audio' onclick='WebPhoneStartAudio()'>发起音频</div>"+
//	    "<div class='call_btn call_btn_video' onclick='WebPhoneStartVideo()'>发起视频</div></div>
	    "<div class='call_btn call_btn_audio' onclick='WebPhoneAudioing()'>发起音频</div>"+
	    "<div class='call_btn call_btn_video' onclick='WebPhoneVideoing()'>发起视频</div></div>");
	newContent.append(CallOperation);

	$("#web").append(newContent);
	showWeb(WebPhonePrefix,"Phone");
}
//正在进行音频Web会话
var WebPhoneAudioing = function(){
	var telephoneNum = $("input[name='PhoneInput']").val();
	var telephoneNumSuffix = telephoneNum + "@open-ims.com";
	
	var gLocalUserID = com.webrtc.sigSessionConfig.username;
	
	//在前端判断该会话是否存在
	//if(false == isLabelExist(telephoneNum,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO))
	//{
	     //console.log("imsvideolabel for "+telephoneNum+"is not exist!");
	     console.log("we new a SessionID");
	     SessionID = guid();
	     console.log(SessionID);
	    
	     //createIMSVideoLabel(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO,SessionID);
	     
     //}
	 //else{
	 //    console.log("imsvideolabel for "+RemoteID+"is exist!");
	 //    SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.IMS+com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO)).find('.SESSIONFLAG').html();
	// }       
	
	//创建正在等待对方回应界面
	var newContent = $("<div id='"+WebPhonePrefix+"PhoneAudioing'></div>");
	var CallState = $("<div class='call_state'></div>");
	newContent.append(CallState);	
	
	var CallStateImg = $("<div class='state_img'><img src='css/pc/images/portrait118.png' width='118' height='118'/></div>");
	CallState.append(CallStateImg);
	var CallPhoneNumber = $("<p class='title'>"+telephoneNum+"</p><p>正在通话中...</p>");
	CallState.append(CallPhoneNumber);

	var RemoteAudio =  $("<Audio id=\""
	        + telephoneNumSuffix + gLocalUserID + "IMS" + "imsaudio"
	        + "\" autoplay=\"autoplay\" ></Audio>");
	newContent.append(RemoteAudio);

    var LocalAudio = $("<Audio id=\""
	        + gLocalUserID + telephoneNumSuffix + "IMS" + "imsaudio"
	        + "\" autoplay=\"autoplay\" ></Audio>");
    newContent.append(LocalAudio);
    
    ////////////////////////////bottombuttons
    var bottomButtons = $("<div class='call_operation'>");
    $(newContent).append(bottomButtons);
	var hangupbutton = $("<div class='call_btn call_btn_hang' onclick=\"HangUpIMSaudio\('"
			+ telephoneNumSuffix + "','" + SessionID + "'\)\">挂断</div>")
	bottomButtons.append(hangupbutton);

	var toAudio = $("<div class='call_btn call_btn_video2'>转为视频</div>");
	bottomButtons.append(toAudio);

	var toKey = $("<div class='call_btn call_btn_key_open'>打开键盘</div>");
	bottomButtons.append(toKey);
    /////////////////////////////////////////

	var $activeflag = $("<input type=\"hidden\" id=\"activeflag\" value=\"NO\">");
	var $sessionid = $("<input type=\"hidden\" id=\"sessionId\" value=\""
			+ SessionID + "\">");

	$(newContent).append($activeflag);
	$(newContent).append($sessionid);
	
	$("#web").append(newContent);
	showWeb(WebPhonePrefix,"PhoneAudioing");
	
	console.log("createAudioing finish!");
	
	//本端静音
    document.getElementById(gLocalUserID+telephoneNumSuffix+"IMS" + "imsaudio").muted=true;
	CallIMSaudio(telephoneNumSuffix,SessionID);
	
}

//正在进行视频Web会话
var WebPhoneVideoing = function(){
	var telephoneNum = $("input[name='PhoneInput']").val();
	var telephoneNumSuffix = telephoneNum + "@open-ims.com";
	
	var gLocalUserID = com.webrtc.sigSessionConfig.username;
	
	//在前端判断该会话是否存在
	//if(false == isLabelExist(telephoneNum,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO))
	//{
	     //console.log("imsvideolabel for "+telephoneNum+"is not exist!");
	     console.log("we new a SessionID");
	     SessionID = guid();
	     console.log(SessionID);
	    
	     //createIMSVideoLabel(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO,SessionID);
	     
     //}
	 //else{
	 //    console.log("imsvideolabel for "+RemoteID+"is exist!");
	 //    SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.IMS+com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO)).find('.SESSIONFLAG').html();
	// }       
	
	//创建正在等待对方回应界面
	var newContent = $("<div id='"+WebPhonePrefix+"PhoneVideoing'></div>");
	var CallState = $("<div class='call_state'></div>");
	newContent.append(CallState);	
	
	var CallStateImg = $("<div class='state_img'><img src='css/pc/images/call_video.png' width='118' height='118'/></div>");
	CallState.append(CallStateImg);
	var CallPhoneNumber = $("<p class='title'>"+telephoneNum+"</p><p>正在通话中...</p>");
	CallState.append(CallPhoneNumber);

	var RemoteVideo =  $("<Video id=\""
	        + telephoneNumSuffix + gLocalUserID + "IMS" + "imsvideo"
	        + "\" autoplay=\"autoplay\" style='display:none;'></Video>");
	CallState.append(RemoteVideo);

    var LocalVideo = $("<Video id=\""
	        + gLocalUserID + telephoneNumSuffix + "IMS" + "imsvideo"
	        + "\" autoplay=\"autoplay\" style='display:none;'></Video>");
    CallState.append(LocalVideo);
    
    ////////////////////////////bottombuttons
    var bottomButtons = $("<div class='call_operation'>");
    $(newContent).append(bottomButtons);
	var hangupbutton = $("<div class='call_btn call_btn_hang' onclick=\"HangUpIMSaudio\('"
			+ telephoneNumSuffix + "','" + SessionID + "'\)\">挂断</div>")
	bottomButtons.append(hangupbutton);

	var toAudio = $("<div class='call_btn call_btn_audio2'>转为音频</div>");
	bottomButtons.append(toAudio);

	var toKey = $("<div class='call_btn call_btn_key_open'>打开键盘</div>");
	bottomButtons.append(toKey);
    /////////////////////////////////////////

	var $activeflag = $("<input type=\"hidden\" id=\"activeflag\" value=\"NO\">");
	var $sessionid = $("<input type=\"hidden\" id=\"sessionId\" value=\""
			+ SessionID + "\">");

	$(newContent).append($activeflag);
	$(newContent).append($sessionid);
	
	$("#web").append(newContent);
	showWeb(WebPhonePrefix,"PhoneVideoing");
	
	console.log("createVideoing finish!");
	
	//本端静音
    document.getElementById(gLocalUserID+telephoneNumSuffix+"IMS" + "imsvideo").muted=true;
	CallIMSvideo(telephoneNumSuffix,SessionID);
	
}
////处理Web电话开启视频
//var WebPhoneStartVideo = function(){
//	var chatFriendId = $("input[name='PhoneInput']").val();
//	createCallVideoPageBefore(chatFriendId);
//}
//
////处理Web电话开启音频
//var WebPhoneStartAudio = function(){
//	var chatFriendId = $("input[name='PhoneInput']").val();
//		
//	createCallAudioPageBefore(chatFriendId);
//}

//拨号回显添加文本框函数
var InsertPhoneInput = function(string){
	var CurContent = $("input[name='PhoneInput']").val();
	$("input[name='PhoneInput']").val(CurContent + string);
}
//拨号回显删除文本框函数
var DeletePhoneInput = function(){
	var CurContent = $("input[name='PhoneInput']").val();
	var NewContent = CurContent.substring(0,CurContent.length-1);
	$("input[name='PhoneInput']").val(NewContent);
}
//删除IMS视频会话界面
var closeIMSVideoDiv = function(){
	var contentDiv = document.getElementById(WebPhonePrefix + "PhoneVideoing");
    console.log("关闭功能区IMS视频界面");
	$(contentDiv).remove();
	globalCur = "WebPhonePhone";
	showWeb(WebPhonePrefix,"Phone");
}

//删除IMS音频会话界面
var closeIMSAudioDiv = function(){
	var contentDiv = document.getElementById(WebPhonePrefix + "PhoneAudioing");
    console.log("关闭功能区IMS音频界面");
	$(contentDiv).remove();
	globalCur = "WebPhonePhone";
	showWeb(WebPhonePrefix,"Phone");
}
//返回Web电话功能区id
var getWebPhoneDiv = function() {
	return document.getElementById(WebPhonePrefix + "Phone");
};

//返回主页
var backHome = function(element){
	
	toggleListMenu("recent_calls","rtc_menu",element);//高亮这个菜单项
	if(globalCur!=null){
		   document.getElementById(globalCur).setAttribute("style","display:none;");
	}
	document.getElementById("home").setAttribute("style","display:block;");
	globalCur="home";
}

//$("#onFriend").mousedown(
//		function(e) {
//			if (3 == e.which) { //右键按下
//				document.oncontextmenu = function() {
//					return false;
//				}
//				$("#RrightOnFriend").hide();
//				$("#RrightOnGroup").hide();
//				$("#RrightOnContact").hide();
//				
//				$("#RrightOnFriend").attr(
//						"style",
//						"display: block; top:" + e.pageY + "px; left:"
//								+ e.pageX + "px;");
//				$("#RrightOnFriend").show();
//			}
//});
//
//$("body").click(function(e) {
//	$("#RrightOnFriend").hide();
//});

////右栏我的好友分组右键菜单
$("#friendh2").mousedown(
		function(e) {
			if (3 == e.which) { //右键按下
				document.oncontextmenu = function() {
					return false;
				}
				/////////隐藏页面所有右键操作弹出的菜单
				//$("#RrightOnFriend").hide();
				$("#RrightOnGroup").hide();
				$("#RrightOnContact").hide();
				//隐藏我的分组弹出菜单以及每个好友弹出菜单
				$(document.body).children("div[class='friend_pop_operation']").hide();
				
				var RightClick = document.getElementById("Rightfriendh2");
				
				$(RightClick).attr(
						"style",
						"display: block; position:absolute; z-index:100; top:" + e.pageY + "px; left:"
								+ e.pageX + "px;");
				$(RightClick).show();
			}
			$("body").click(function(e) {
				$(RightClick).hide();
			});
});

////右栏群组右键菜单
$("#onGroup").mousedown(
		function(e) {
			if (3 == e.which) { //右键按下
				document.oncontextmenu = function() {
					return false;
				}
				//$("#RrightOnFriend").hide();
				$("#RrightOnGroup").hide();
				$("#RrightOnContact").hide();
				
				$("#RrightOnGroup").attr(
						"style",
						"display: block; top:" + e.pageY + "px; left:"
								+ e.pageX + "px;");
				$("#RrightOnGroup").show();
			}
});

$("body").click(function(e) {
	$("#RrightOnGroup").hide();
});

////右栏联系人右键菜单
$("#onContact").mousedown(
		function(e) {
			if (3 == e.which) { //右键按下
				document.oncontextmenu = function() {
					return false;
				}
				//$("#RrightOnFriend").hide();
				$("#RrightOnGroup").hide();
				$("#RrightOnContact").hide();
				
				$("#RrightOnContact").attr(
						"style",
						"display: block; top:" + e.pageY + "px; left:"
								+ e.pageX + "px;");
				$("#RrightOnContact").show();
			}
});

$("body").click(function(e) {
	$("#RrightOnContact").hide();
});

//切换normalizedMenuClass菜单为普通样式，highlightedMenuClass菜单为高亮样式
var toggleListMenu = function(normalizedMenuClass,highlightedMenuClass,element)
{
	//当前高亮的菜单恢复原样	
	normalizeSelectedListMenuElement(normalizedMenuClass);
	normalizeSelectedListMenuElement(highlightedMenuClass);
	
	//高亮当前
	highlightSelectedListMenuElement(highlightedMenuClass,element);
}

//恢复菜单项为普通样子
var normalizeSelectedListMenuElement = function(normalizedMenuClass)
{
	lists = $('.'+normalizedMenuClass+' ul li');
	lists.removeClass('on');
}

//高亮的菜单项
var highlightSelectedListMenuElement = function(highlightedMenuClass,element)
{
	lists = $('.'+highlightedMenuClass+' ul li');
	li_index = $(element).index();
	lists.eq(li_index).addClass('on');
}
//document.oncontextmenu = function() {
//	return false;
//}