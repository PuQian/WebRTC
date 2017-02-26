//function sendmsg(remotename){
//        var div=$("<div class=\"chatunit\"></div>");
//        var h=$("<h4 class=\"chat-right green\">本人"+localname+"</h4>");
//        var p=$("<p class=\"chat-right\">hello world!hello world!</p>");
//        div.append(h);
//        div.append(p);
//        $("#chatarea").append(div);
//   }
var createRecordlistLi = function(contactlistDivId,userName){
	

	var contact = $(document.getElementById(contactlistDivId));
	
	var lielem = $('<li>').attr({
		'id' : RecordPrefix+userName,
		'class' : 'ui-item ui-ignore-space'
	}).click(function() {
			chooseContactDivClick(this);
	});
	var $avater = $("<div class='my-item-left' id='avater'></div> ");
	var $image =  $("<img src='images/boy.jpg'>");
	var $span = $("<span></span>");
	$avater.append($image);
	$avater.append($span);
	var $people = $("<div class = \" my-item-right \"></div>");			
	var $p1=$("<p class = \" ui-no-wrap\"><span class =\"ui-right ui-gray\"></span></p>");
	var $p2=$("<p class = \"ui-gray\"></p>");
	$people.append($p1);
	$people.append($p2);
	
	
	var MsgDivId = MessagePrefix+userName;
	var NewFriendDivId = "newFriend";
	var $href = $("<a href =\""+"#"+MsgDivId+"\" class=\"ui-link\" onclick = \"removeRedCounter\('"+RecordPrefix+userName+"'\)\">");
	var $href_newFriend = $("<a href =\""+"#"+NewFriendDivId+"\" class=\"ui-link\" onclick = \"removeRedCounter\('"+RecordPrefix+userName+"'\)\">");
	
	if(userName!="newFriend"){
		$href.append($avater);
		$href.append($people);
		lielem.append($href);
	}
	else{
		$href_newFriend.append($avater);
		$href_newFriend.append($people);
		lielem.append($href_newFriend);
	}
	
	contact.append(lielem);
	
}

var createNewFriendlistLi = function(newfriendlistDivId,userName){
	var newfriend = $(document.getElementById(newfriendlistDivId));
	var normal_userName = formatReEase(userName);
	
	var lielem = $('<li>').attr({
		'id' : NewFriendPrefix+userName+getLoacalTimeString(),
		'class' : 'ui-item ui-ignore-space'
	}).click(function() {
			chooseContactDivClick(this);
	});
	
	var div_left = $("<div class= \"left_element\"></div>");
	var image = $("<img class=\"left_image\" src=\"images/default_avatar.jpg\">");
	var name_span = $("<span class=\"left_p\">"+normal_userName+"</span>");
	div_left.append(image);
	div_left.append(name_span);
	
	var div_cancel = $("<div class=\"right_button\"></div>");
	var button_cancel = $("<button class=\"ui-btn ui-shadow ui-corner-all cancel\" id=\"addfriendcancel_button\" name=\"cancel_button\">拒绝</button>");
	div_cancel.append(button_cancel);

	var div_confirm = $("<div class=\"right_button\"></div>");
	var button_confirm = $("<button class=\"ui-btn ui-shadow ui-corner-all confirm\" id=\"addfriendconfirm_button\" name=\"confirm_button\">同意</button>");
	div_confirm.append(button_confirm);
	
	var cancel_p =$("<p class=\"right_p hidden\" name=\"cancel_p\">已拒绝</p>");
	var confirm_p = $("<p class=\"right_p hidden\" name=\"confirm_p\">已同意</p>");

	var div_clear = $("<div style=\"clear:both\"></div>");

//	lielem.append(image);
//	lielem.append(name_span);
	lielem.append(div_left);
	lielem.append(div_cancel);
	lielem.append(div_confirm);
	lielem.append(cancel_p);
	lielem.append(confirm_p);
	var id = $(lielem).attr("id");

	button_confirm.click(function() {
	console.log("id in");
	console.log(id);
		
	//console.log(lielem);
	// 同意好友请求
	agreeAddFriend(userName);// e.from用户名
	// 反向添加对方好友
	conn.subscribe({
		to : userName,
		message : "[resp:true]"
	});
	
	console.log("confirm button click start");

	
	var li = document.getElementById(id);
	$(li).find("button").hide();
	$(li).find("[name=\"confirm_p\"]").removeClass("hidden");
	console.log("confirm button click end");
	});
	
	button_cancel.click(function() {
		rejectAddFriend(userName);// 拒绝加为好友

		var li = document.getElementById(id);
		$(li).find("button").hide();
		$(li).find("[name=\"cancel_p\"]").removeClass("hidden");
		console.log("confirm button click end");
		
	});
	

	newfriend.append(lielem);
}

var createFriendInfoPage=function(friendname){	
	if(true == judgeExist(InfoPrefix+friendname)){
		return;
	}
	
    console.log("start to createFriendInfoPage");
    
	var name = formatReEase(friendname);

    
    var page=$("<div data-role=\"page\" id="+InfoPrefix+friendname+">");
    var top_bar=$("<div class=\"ui-top-bar\"></div>");
    var js_active=$(" <div class=\"js-active\"></div>");
    var title_left=$("<div class=\"title-left floatleft\"></div>");
    var title_p=$("<p class=\"titlep inline-block position\">好友信息</p>");
    var title_a=$("<a  href=\"#friendhtml\"></a>");
    var span1=$("<span class=\"ion-ios-arrow-back  title-left-icon\"></span>");
    var span2 = $("<span class=\" title-left-p\">返回</span>");
    var title_right_a=$("<a onclick=\"CreateDeleteFriend\('"+name+"'\)\" href=\"#"+deletefriendPrefix+name+"\"></a>");
    var title_right_p = $("<p class=\"titlerightp\">更多</p>");
    
    
    title_a.append(span1);
    title_a.append(span2);
    title_left.append(title_a);
    title_right_a.append(title_right_p); 
    js_active.append(title_left);
    js_active.append(title_p);
    js_active.append(title_right_a);
    top_bar.append(js_active);

    var page_content=$("<div class=\"ui-page-content\"></div>");
    var infoposition=$("<div class=\"infoposition\"></div>");
    var img=$("<img src=\"images/default_avatar.jpg\">");
    var content_p=$("<p>"+name+"</p>");

    infoposition.append(img);
    infoposition.append(content_p);

    var funcposition=$("<div class=\"funcposition\"></div>");
    var btn_msg=$("<a onclick = \"createMsgPage\('"+friendname+"'\)\" href=\""+"#"+MessagePrefix+friendname+"\" ><input type=\"button\" value=\"消息\" /></a>");
    var btn_audio=$("<a onclick = \"createCallAudioPageBefore\('"+friendname+"'\)\"  href=\""+"#"+CallAudioPrefix+friendname+"\"><input type=\"button\" value=\"音频\" /></a>");
    var btn_video=$("<a onclick = \"createCallVideoPageBefore\('"+friendname+"'\)\"  href=\""+"#"+CallVideoPrefix+friendname+"\"><input type=\"button\" value=\"视频\" /></a>");
    funcposition.append(btn_msg);
    funcposition.append(btn_audio);
    funcposition.append(btn_video);
    page_content.append(infoposition);
    page_content.append(funcposition);

    page.append(top_bar);
    page.append(page_content);

    console.log("end to createFriendInfoPage");
  
    var bodyHTML = $("body");
    bodyHTML.append(page);
}

var CreateDeleteFriend=function(name){
	console.log("lalala");
	var Imname = formatToEase(name);
    console.log("start CreateDeleteFriend");
    var page=$("<div data-role=\"page\" id="+deletefriendPrefix+name+"></div>");
    var top_bar=$("<div class=\"ui-top-bar\"></div>");
    var js_active=$(" <div class=\"js-active\"></div>");
    var title_left=$("<div class=\"title-left floatleft\"></div>");
    var a_href=$("<a href=\"#friendhtml\"></div>");
    var icon_arrow_back=$("<span class=\"ion-ios-arrow-back  title-left-icon\"></span>");
    var title_left_p=$("<span class=\"title-left-p\">返回</span>");
    a_href.append(icon_arrow_back);
    a_href.append(title_left_p);
    title_left.append(a_href);

    var titlep=$("<p class=\"titlep marginright inline-block\">更多</p>");

    js_active.append(title_left);
    js_active.append(titlep);
    top_bar.append(js_active);

    var page_content=$("<div class=\"ui-page-content\"></div>"); 
    var infoposition=$("<div class=\"infoposition\"></div>");
    var img=$("<img src=\"images/default_avatar.jpg\">");
    var content_p=$("<p>"+name+"</p>");

    infoposition.append(img);
    infoposition.append(content_p);

    var funcposition=$("<div class=\"funcposition\"></div>");   
    var btm_addfriend=$("<input type=\"button\" value=\"删除好友\" onclick=\"directDelFriend('"+Imname+"'\)\">");

    funcposition.append(btm_addfriend);
    page_content.append(infoposition);
    page_content.append(funcposition);

    page.append(top_bar);
    page.append(page_content);

    var bodyHTML = $("body");
    bodyHTML.append(page);
    console.log("end CreateDeleteFriend");
}
var addRecordMsg = function(contactlistDivId,userName,data){
	
	var name = formatReEase(userName);
	
	var contactLi = document.getElementById(contactlistDivId);
	console.log(contactLi);
	if (contactLi == null) {
		console.log(userName);
		//如果对话界面没有这个人的选项，就创建对话界面对于这个人的选项
		createRecordlistLi("recordlist",userName);
	}
	contactLi = $(document.getElementById(contactlistDivId));
	
	var $p1 = $(contactLi.find(".my-item-right").children("p")[0]);
	var $p2 = $(contactLi.find(".my-item-right").children("p")[1]);
	$p1.empty();
	$p2.empty();
	$Time = $("<span class =\"ui-right ui-gray\">"+getLoacalTimeString()+"</span>");	
	$p1.html(name);
	$p1.append($Time);
	$p2.html(data);
	
	
}


var removeRedCounter = function(contactlistDivId){
	var contactLi = $(document.getElementById(contactlistDivId));
	var badgespan = $(contactLi).find(".ui-red-counter");
	badgespan.addClass("no-visible");
	badgespan.html("");
	
}

var judgeHasClass = function(divId,Class){
	var $divId = $(document.getElementById(divId));
	return $divId.hasClass(Class);
}

var judgeExist = function(divId){
	var test  = document.getElementById(divId);
	if(test){
		return true;
	}
	else{
		return false;
	}
}

var isActive =function(divId){
	var $test = $(document.getElementById(divId));
	
	if("YES" == $test.find("#activeflag").attr("value")){
		return true;
	}
	if("NO" == $test.find("#activeflag").attr("value")){
		return false;
	}
	console.log("do not know the value of active ? ");
	return false;
	
}

var setNewSessionID = function(divId,friendname,SessionId){
	var $test = $(document.getElementById(divId));
	
	$test.find("#sessionId").attr("value",SessionId);
	
	var $change=$test.find("[name=\"hangup\"]");
	var gRemoteUserID = EaseToWCS(friendname);
	$change.attr("onclick","HangUpvideo\('"+gRemoteUserID+"','"+SessionId+"'\)");
	
}

var setActiveFlag = function(divId,flag){
	var $test = $(document.getElementById(divId));
	
	$test.find("#activeflag").attr("value",flag);
}



var createCallVideoPageBefore = function(contact){
	console.log("contact:"+contact);
	//与某人通话界面存在 并且正在 通话
	console.log('createCallVideoBefore!');
	if(true == judgeExist(CallVideoPrefix+contact) && true == isActive(CallVideoPrefix+contact)){
		//不做任何事情，直接超级链接跳转到通话界面即可
		console.log("test video 1");
		return;
	}
	//与某人通话界面存在，但是并未通话
	if(true == judgeExist(CallVideoPrefix+contact) &&  false == isActive(CallVideoPrefix+contact)){
		//需要更新SessionID，并调用CallVideo执行视频通话
		console.log("test video 2");
		var SessionID= null;
		SessionID= guid();
		setNewSessionID(CallVideoPrefix+contact,contact,SessionID);
		var gRemoteUserID = EaseToWCS(contact);
		
	
		Callvideo(gRemoteUserID,SessionID);
		setActiveFlag(CallVideoPrefix+contact,"YES");
		return;
	}
	var SessionID= null;
	SessionID= guid();
	
	//与某人通话界面不存在
	//先生成界面，再调用CallVideo执行视频通话
	createCallVideoPage(contact,SessionID);
	
	var gRemoteUserID = EaseToWCS(contact);
	console.log(gRemoteUserID);
	Callvideo(gRemoteUserID,SessionID);
	setActiveFlag(CallVideoPrefix+contact,"YES");
}


var createCallVideoPage = function(contact,sessionid){
	if(true == judgeExist(CallVideoPrefix+contact))
	{	console.log("test video 3");
		setNewSessionID(CallVideoPrefix+contact,contact,sessionid);
		return;
	}

	
	console.log("test video 4");

	
	var SessionID= sessionid;
	
	var gRemoteUserID = EaseToWCS(contact);
	var name = formatReEase(contact);
	
	var gLocalUserID=com.webrtc.sigSessionConfig.username;
	var sessionType=com.webrtc.UserSession.TYPE.P2P;
	var moduleType=com.webrtc.UserSession.MODULE_TYPE.VIDEO;
	
	var VideoDivId=CallVideoPrefix+contact;

	var $div = $("<div data-role=\"page\" id=\""+VideoDivId+"\" data-url =\""+VideoDivId+"\"></div>");
	var $top=$("<div class=\"ui-top-bar\"></div>");
	var $divjs = $("<div class=\"js-active\"></div>");
	var $div0 = $("<div class=\"title-left floatleft\"><a href=\""+"#"+InfoPrefix+contact+"\"><span class=\"ion-ios-arrow-back  title-left-icon\"></span><span class=\" title-left-p\">返回</span></a></div>");
	var $div1 = $("<div class=\"p-center-title\"></div>");
//	var $p1 =  $("<p class=\"titlep p-titeltop\">视频</p>");
//	var $p2 =  $("<p class=\"p-titlebottom\">"+name+"</p>");
	
	var $p2 =  $("<p class=\"titlep inline-block\">"+name+"</p>");
	var $button = $("<button type=\"button\" name= \"hangup\" value=\"挂断\" onclick=\"HangUpvideo\('"+gRemoteUserID+"','"+SessionID+"'\)\">挂断</button>");   
	
	//$div1.append($p1);
	$div1.append($p2);
	$div1.append($button);
	$divjs.append($div0);
	$divjs.append($div1);
	$top.append($divjs);
	$div.append($top);
	
	var $content=$("<div class=\"ui-page-content\"></div>");
	var $remotevideo =  $("<div class=\"remoteposition\"><video id=\"" +gRemoteUserID+gLocalUserID+sessionType+moduleType+"\" autoplay=\"autoplay\" ></video></div>");
	var $localvideo = $("<div class=\"localposition\"><video id=\"" +gLocalUserID+gRemoteUserID+sessionType+moduleType+"\" autoplay=\"autoplay\" ></video></div>");
	
	$content.append($localvideo);
	$content.append($remotevideo);
	
	var $activeflag =$("<input type=\"hidden\" id=\"activeflag\" value=\"NO\">");
	var $sessionid =$("<input type=\"hidden\" id=\"sessionId\" value=\""+SessionID+"\">");
	
	$content.append($activeflag);
	$content.append($sessionid);
	
	$div.append($content);

	
	var $body = $("body");
	
	$body.append($div);
	//本端静音
    document.getElementById(gLocalUserID+gRemoteUserID+sessionType+moduleType).muted=true;

	console.log("createVideoPage finish!");

}

var createCallAudioPageBefore = function(contact){
	//与某人通话界面存在 并且正在 通话
	console.log('createCallAudioBefore!');
	if(true == judgeExist(CallAudioPrefix+contact) && true == isActive(CallAudioPrefix+contact)){
		//不做任何事情，直接超级链接跳转到通话界面即可
		console.log("test audio 1");
		return;
	}
	//与某人通话界面存在，但是并未通话
	if(true == judgeExist(CallAudioPrefix+contact) &&  false == isActive(CallAudioPrefix+contact)){
		//需要更新SessionID，并调用CallVideo执行视频通话
		console.log("test audio 2");
		var SessionID= null;
		SessionID= guid();
		setNewSessionID(CallAudioPrefix+contact,contact,SessionID);
		var gRemoteUserID = EaseToWCS(contact);
		
	
		Callaudio(gRemoteUserID,SessionID);
		setActiveFlag(CallAudioPrefix+contact,"YES");
		return;
	}
	var SessionID= null;
	SessionID= guid();
	
	//与某人通话界面不存在
	//先生成界面，再调用CallVideo执行视频通话
	createCallAudioPage(contact,SessionID);
	
	var gRemoteUserID = EaseToWCS(contact);
	Callaudio(gRemoteUserID,SessionID);
	setActiveFlag(CallAudioPrefix+contact,"YES");
}

var createCallAudioPage = function(contact,sessionid){
	if(true == judgeExist(CallAudioPrefix+contact))
	{	console.log("test audio 3");
		setNewSessionID(CallAudioPrefix+contact,contact,sessionid);
		return;
	}

	console.log("test audio 4");

	var SessionID= sessionid;
	
	var gRemoteUserID = EaseToWCS(contact);
	var name = formatReEase(contact);
	
	var gLocalUserID=com.webrtc.sigSessionConfig.username;
	var sessionType=com.webrtc.UserSession.TYPE.P2P;
	var moduleType=com.webrtc.UserSession.MODULE_TYPE.AUDIO;
	
	var AudioDivId=CallAudioPrefix+contact;

	var $div = $("<div data-role=\"page\" id=\""+AudioDivId+"\" data-url =\""+AudioDivId+"\"></div>");
	var $top=$("<div class=\"ui-top-bar\"></div>");
	var $divjs = $("<div class=\"js-active\"></div>");
	var $div0 = $("<div class=\"title-left floatleft\"><a href=\""+"#"+InfoPrefix+contact+"\"><span class=\"ion-ios-arrow-back  title-left-icon\"></span><span class=\" title-left-p\">返回</span></a></div>");
	var $div1 = $("<div class=\"p-center-title\"></div>");
//	var $p1 =  $("<p class=\"titlep p-titeltop\">视频</p>");
//	var $p2 =  $("<p class=\"p-titlebottom\">"+name+"</p>");
	
	var $p2 =  $("<p class=\"titlep inline-block\">"+name+"</p>");
	var $button = $("<button type=\"button\" name= \"hangup\" value=\"挂断\" onclick=\"HangUpaudio\('"+gRemoteUserID+"','"+SessionID+"'\)\">挂断</button>");   
	
	//$div1.append($p1);
	$div1.append($p2);
	$div1.append($button);
	$divjs.append($div0);
	$divjs.append($div1);
	$top.append($divjs);
	$div.append($top);
	
	var $content=$("<div class=\"ui-page-content\"></div>");
	var $remoteaudio =  $("<div class=\"remoteposition\"><video id=\"" +gRemoteUserID+gLocalUserID+sessionType+moduleType+"\" autoplay=\"autoplay\" ></video></div>");
	var $localaudio = $("<div class=\"localposition\"><video id=\"" +gLocalUserID+gRemoteUserID+sessionType+moduleType+"\" autoplay=\"autoplay\" ></video></div>");
	
	$content.append($localaudio);
	$content.append($remoteaudio);
	
	var $activeflag =$("<input type=\"hidden\" id=\"activeflag\" value=\"NO\">");
	var $sessionid =$("<input type=\"hidden\" id=\"sessionId\" value=\""+SessionID+"\">");
	
	$content.append($activeflag);
	$content.append($sessionid);
	
	$div.append($content);

	
	var $body = $("body");
	
	$body.append($div);
	 //本端静音
    document.getElementById(gLocalUserID+gRemoteUserID+sessionType+moduleType).muted=true;

	console.log("createAudioPage finish!");

}


var createMsgPage = function(contact){
	
	if(true == judgeExist(MessagePrefix+contact)){
		return;
	}
	var MsgDivId=MessagePrefix+contact;
	
	var name = formatReEase(contact);
	
	var $div = $("<div data-role=\"page\" id=\""+MsgDivId+"\" data-url =\""+MsgDivId+"\"></div>");
	var $top=$("<div class=\"ui-top-bar\"></div>");
	var $divjs = $("<div class=\"js-active\"></div>");
	var $div1 = $("<div class=\"title-left floatleft\"><a href=\"#msghome\"><span class=\"ion-ios-arrow-back  title-left-icon\"></span><span class=\" title-left-p\">消息</span></a></div>");
	var $p =  $("<p class=\"titlep inline-block\">"+name+"</p>");
	var $div2 = $("<div class=\"title-right floatright\"><a href=\"#audiohome\"><span class=\"ion-mic-a title-right-icon \"></span></a><a href=\"#videohome\"><span class=\"ion-ios-videocam  title-right-icon\"></span></a></div>");   
	$divjs.append($div1);
	$divjs.append($p);
	$divjs.append($div2);
	$top.append($divjs);
	$div.append($top);
	var $content=$("<div class=\"ui-page-content\" id=\"chatarea\"></div>");
	var $foot =  $("<div class=\"ui-bottom-bar grey\" role=\"toolbar\"><input type=\"text\" class=\"bottominput\" id=\"msginput\"><button class=\"sendmsgbutton\" onclick=\"sendText('"+contact+"')\">发送</button></div>");
	
	$div.append($content);
	$div.append($foot);
	
	var $body = $("body");
	
	$body.append($div);
	
	console.log("createMsgPage finish!");
}

var addMessageMsg = function(MsgDivId,userName,data){
	
	var MsgPage = $(document.getElementById(MsgDivId));
	if (curUserId == userName) {
		//本端发出去的消息，放在右边;
		createOneMessageOnRight(MsgDivId,userName,data);
	} else {
		//对端发送来的消息,放在左边;
		createOneMessageOnLeft(MsgDivId,userName,data);
	}
}

var createOneMessageOnLeft = function(MsgDivId,userName,data){
	 
	var name =  formatReEase(userName);
	
	var chatunit$ = $("<div class =\"chatunit\"></div>");
	var h4$ = $("<h4 class = \"chat-left orange\">"+name+"</h4>");
	var p$ = $("<p class = \"chat-left\">"+data+"</p>");
	
	chatunit$.append(h4$);
	chatunit$.append(p$);
	
	var MsgPage = $(document.getElementById(MsgDivId));
	
	var chatarea$ = MsgPage.find("#chatarea");
	chatarea$.append(chatunit$);
	console.log("addMessage to MsgPage finish!");
}
var createOneMessageOnRight = function(MsgDivId,userName,data){
	var name =  formatReEase(userName);
	
	var chatunit$ = $("<div class =\"chatunit\"></div>");
	var h4$ = $("<h4 class = \"chat-right green\">"+name+"</h4>");
	var p$ = $("<p class = \"chat-right\">"+data+"</p>");
	
	chatunit$.append(h4$);
	chatunit$.append(p$);
	
	var MsgPage = $(document.getElementById(MsgDivId));
	
	var chatarea$ = MsgPage.find("#chatarea");
	chatarea$.append(chatunit$);
	console.log("addMessage to MsgPage finish!");
}

var createMeHome=function(myname){
	
	console.log("begin to createMeHome");
	
	var name=formatReEase(myname);
	
    var top_bar=$("#mehome .ui-top-bar");
    var js_active=$(" <div class=\"js-active\"></div>");
    var top_p=$("<p class=\"titlep\">我</p>");
    js_active.append(top_p);
    top_bar.append(js_active);

    var page_content=$("#mehome .ui-page-content"); 
    
    var infoposition=$("<div class=\"infoposition\"></div>");
    var img=$("<img src=\"images/default_avatar.jpg\">");
    var content_p=$("<p>"+name+"</p>");

    infoposition.append(img);
    infoposition.append(content_p);


    var funcposition=$("<div class=\"funcposition\"></div>");   
    var btm_logout=$("<input type=\"button\" value=\"退出\" onclick=\"logout1()\">");

    funcposition.append(btm_logout);
    

    page_content.append(infoposition);
    page_content.append(funcposition);

    console.log("end to createMeHome");
}

var test = function(){
	console.log("aa");
}

$(document).ready(function(){
   $('#groupone > ul').hide();

//
//    $(".myloginimgleft").click(function()
//    { 
//        $(this).attr('src',$(this).attr('src')=='images/check_on.jpg'?'images/check_off.jpg':'images/check_on.jpg');
//    });
//    $(".myloginimgright").click(function()
//    { 
//        $(this).attr('src',$(this).attr('src')=='images/check_on.jpg'?'images/check_off.jpg':'images/check_on.jpg');
//    });

    $("#groupone #click").click(function(){
        $('#groupone #rightordown').toggleClass("ion-arrow-right-b");
      
        $('#groupone > ul').toggle();
    });
    

});