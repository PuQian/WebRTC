// 返回聊天功能区id
var getContactChatDiv = function(chatFriendId) {//MessagePrefix="Msg";
	return document.getElementById(MessagePrefix + chatFriendId);
};

//// 更改联系人聊天窗口div并创建活动list
//var chooseContactDivClick = function(chatFriendId) {
//	var contentDiv = getContactChatDiv(chatFriendId);
//
//	if (contentDiv==null) { //不存在
//		var newContent = createContactChatDiv(chatFriendId);
//		document.getElementById("web").appendChild(newContent);
//    	createActiveList(chatFriendId,MessagePrefix); // 新建活动会话
//	} 
//	showWeb(MessagePrefix,chatFriendId);
//};

// 删除聊天会话界面
var hideChatDiv = function(chatFriendId) {
	//隐藏当前窗口（对于删除好友或群组有用）
	document.getElementById(globalCur).setAttribute("style","display:none;");
	
	chatBox = document.getElementById(MessagePrefix + chatFriendId);
	if(chatBox != null) chatBox.remove();//删除对话框
	activeItem = getActiveList(chatFriendId,MessagePrefix);
	if(activeItem != null) activeItem.remove();//删除会话列表对应项
	
	//查询当前是否还存在聊天（群组或好友）界面
	$.each($("#web").children("div"),function(){
		var WebDivId = $(this).attr("id");
		if(WebDivId.substr(0,3) == MessagePrefix){   //好友聊天界面
			//FriendId:webrtc1@163.com
			//WebDivId:Msgjwebrtc1@163.com
			var FriendId = WebDivId.substr(3);
			var type = MessagePrefix;
			chooseShowDivType(FriendId,type);
			return false;
		}
		else if(WebDivId.substr(0,6) == GroupPrefix){ //存在群组聊天界面
			//FriendId:group1+32135243213216543213(GroupId)
			//WebDivId:Group+group1+134079258417955440
			var FriendId = WebDivId.substr(6);
			var type = GroupPrefix;
			chooseShowDivType(FriendId,type);
			return false;
		}
		//没有聊天界面,显示主页
		//当前高亮的菜单恢复原样	
		normalizeSelectedListMenuElement("recent_calls");
		normalizeSelectedListMenuElement("rtc_menu");		
		//固定，高亮主页
		$('.rtc_menu ul li').eq(0).addClass('on');		
		document.getElementById("home").setAttribute("style","display:block;");
		globalCur="home";
	});
};

// 清空聊天界面
var clearScreen = function(chatFriendId) {
	$(document.getElementById(chatFriendId + "front")).html("");
};


//新建聊天功能区界面
var createContactChatDiv = function(chatFriendId){
	var Div = MessagePrefix + chatFriendId;
	
	var newContent = document.createElement("div");
	newContent.setAttribute("id", Div);

	var chatHead = $("<div class=\"chat_head\"><h2 onclick=\"FriendModalFunctionArea\('"+ chatFriendId+ "'\);\">"+ chatFriendId +"</h2></div>");
	$(newContent).append(chatHead);

    /*************对话框头部***************************************/ 
	var chatHeadRight = $("<div class=\"chat_head_operation\">"+ 
		                  "<ul><li class='operation_close' onclick=\"hideChatDiv\('"+ chatFriendId+ "'\);\">关闭</li>"+
                          "<li class='operation_video' onclick=\"createCallVideoPageBefore\('"+ chatFriendId+ "'\);\">发起视频</li>"+
                          "<li class='operation_audio' onclick=\"createCallAudioPageBefore\('"+ chatFriendId+ "'\);\">发起音频</li>"+
                          //"</ul></div>");
                          "<li class='operation_file'><input type='file' id='files"+ chatFriendId +"' "+
                          "name='files[]' onchange=\"CallFilesBefore(this,this.files,'"+ chatFriendId +"');\" multiple /></li></ul></div>");
						  //"<li class='operation_file'>传送文件</li></ul></div>");
	$(chatHead).append(chatHeadRight);

	/** ****************对话框内容*********************************/
	var chatListBox = $("<div id=\"" + chatFriendId + "front\" class='chat_list_box'></div>");
    $(newContent).append(chatListBox);
   
    var inputChatBox = $("<div class='input_chat_box'>");
    $(newContent).append(inputChatBox);

    var inputTextArea = $("<textarea id=\"" + chatFriendId
			          + "message\" name='' cols='' rows='' class='input_text' onkeydown='checkEnterDown(\""+chatFriendId+"\")'></textarea>");
    $(inputChatBox).append(inputTextArea);

    var inputFace = $("<div class='input_chat_edit'>"+
 //                "<ul class='input_chat_edit_l'><li class='icon_history'>查看历史对话</li>"+
    		"<ul class='input_chat_edit_l'><li class='icon_history' onclick='createMyChatHistory(\""+ chatFriendId +"\")'></li></ul>"+
//                  "<li class='icon_face'>选择表情</li>"+
//                  "<li class='icon_font_size'>文字大小</li>"+
//                  "<li class='icon_color'>文字颜色</li></ul>"+
                  "<div class='input_chat_edit_r'>"+
                  "<input id=\""+chatFriendId+"sendBtn\" type='button' onclick=\"sendText\('"+ 
                  	chatFriendId + "'\);\" value='发送' class='send_out btn_blue'/></div></div>");
    $(inputChatBox).append(inputFace);
    
//    // 获取对端uid
//    requestUid(chatFriendId);

	return newContent;
};

//判断显示聊天内容函数
var addMessageMsg = function(MsgDivId, userName, remoteUserName,data) {

	var MsgPage = $(document.getElementById(MsgDivId));
	var myName = formatReEase(curUserId);//我的名字
	var remoteName =myName+","+formatReEase(remoteUserName);//对方的名字
	var showName=formatReEase(userName);//消息框中显示的名字
	var myDate=new Date();
//	var month=myDate.getMonth()+1;
//	var day=month+"-"+myDate.getDate();
//	var date=myDate.toLocaleString();//获取当前日期和时间
	var day_array = [];
	day_array[0]=myDate.getFullYear();
	day_array[1]=myDate.getMonth()+1;
	day_array[2]=myDate.getDate();
	day_array[3]=myDate.getHours();
	day_array[4]=myDate.getMinutes();
	day_array[5]=myDate.getSeconds();
	
	localStorage.setItem(remoteName,day_array);
	indexstore.store({from:remoteName,to:showName,id:day_array,type:"text",data:data},function(e){console.log(e);});
	
	if (curUserId == userName) 
	{
		// 本端发出去的消息，放在右边;
		createOneMessageOnRight(MsgDivId, userName,remoteUserName, data);
	} else 
	{
		// 对端发送来的消息,放在左边;
		createOneMessageOnLeft(MsgDivId, userName, data);
	}
}

/*//显示对端聊天内容
var createOneMessageOnLeft = function(MsgDivId, to, data) {

	var name = formatReEase(to);
    console.log("puqian2222:"+name);
    
	var LeftChat = $("<div class='chat_you'></div>");
    var LeftChatImg = $("<div class='img_li'>"+
        "<img src='css/pc/images/img/portrait65_1.jpg' width='65' height='65'/></div>");
	var LeftChatMessage = $("<div class='img_text'><div class='text_box'>"+
			"<i></i><p>"+ data +"</p></div></div>");
	
	$(LeftChat).append(LeftChatImg);
	$(LeftChat).append(LeftChatMessage);
	
	var haha = document.getElementById(name + "front");
	console.log("left---------" + haha);
	$(haha).append(LeftChat);
    //div1.innerHTML = name + " " + date();

	console.log("addMessage to MsgPage on left finish!");
}

//显示本端聊天内容
var createOneMessageOnRight = function(MsgDivId, userName,remoteUserName, data) {
	var name = formatReEase(remoteUserName);
	
  	var rightChat = $("<div class='chat_me'></div>");
    var rightChatImg = $("<div class='img_li'>"+
        "<img src='css/pc/images/img/portrait65_2.jpg' width='65' height='65'/></div>");
	var rightChatMessage = $("<div class='img_text'><div class='text_box'>"+
			"<i></i><p>"+ data +"</p></div></div>");
	
	$(rightChat).append(rightChatImg);
	$(rightChat).append(rightChatMessage);
	
	var haha = document.getElementById(name + "front");
	$(haha).append(rightChat);
    //div1.innerHTML = name + " " + date();

	console.log("addMessage to MsgPage on right finish!");
}*/


//聊天信息回显，发送按钮触发 !!!!!目前没有用到此函数
var Talk = function(chatFriendId) {
	var div1 = document.createElement("div");
	div1.innerHTML = date();
	document.getElementById(chatFriendId + "front").appendChild(div1);

	// var message1=$("#"+chatFriendId+"message").val();
	var message1 = document.getElementById(chatFriendId + "message");
	// var message1=document.getElementById(chatFriendId+"message").val();
	var div2 = document.createElement("div");
	div2.innerHTML = $(message1).val();
	document.getElementById(chatFriendId + "front").appendChild(div2);

	// $("#"+chatFriendId+"message").val("");
	$(document.getElementById(chatFriendId + "message")).val("");
};

//检测发送消息时是否输入enter键，若是则触发sendText发送消息
var checkEnterDown = function(chatTargetId)
{
    //按回车自动发送
	event = window.event;
	if(event.keyCode == 13)
	{
		event.preventDefault(); //禁止默认回车事件
	    event.stopPropagation();
	    $(document.getElementById(chatTargetId+"sendBtn")).click();
	}
}