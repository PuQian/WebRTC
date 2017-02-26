var globalCur="home";
$('#list_friend').hide();
$('#list_group').hide();
$('#list_contact').hide();

//// 模态框中选择联系人，创建聊天窗口
//var FindFriend = function() {
//	var chatFriendId = $("#myModalLabel").text();
//	chooseContactDivClick(chatFriendId);
//};

//隐藏显示我的好友分组（目前唯一的分组）
var showListFriendUL = function(){
	 var Classi = $("#list_friend").children("h2").children("i").attr("class");
	 if (Classi == "ul_open") {// 隐藏分组
		    $("#list_friend").children("h2").children("i").attr("class","ul_close");
		    $("#list_friend_UL").attr("style","display:none;");
		 }
	 if(Classi == "ul_close"){//显示分组
	    	 $("#list_friend").children("h2").children("i").attr("class","ul_open");
	    	 $("#list_friend_UL").attr("style","display:block;");
	     }
};

//创建聊天窗口（右栏右键调用），变更传参(参数为朋友名字)
var chooseContactDivClickBefore = function(chatFriendId){
	var contentDiv = getContactChatDiv(chatFriendId);
	
	if (contentDiv==null) { //不存在
		console.log("pq-----当前聊天界面不存在，新建,globalCur"+globalCur);
		var newContent = createContactChatDiv(chatFriendId);
		document.getElementById("web").appendChild(newContent);
    	createActiveList(chatFriendId,MessagePrefix); // 新建活动会话
    	
    	// 获取对端uid(2016-10)
    	requestUid(chatFriendId);
	} 
	if(globalCur!=null){
		   document.getElementById(globalCur).setAttribute("style","display:none;");
		}
	//normalizeSelectedListElement("rtc_menu");
	document.getElementById(MessagePrefix + chatFriendId).setAttribute("style","display:block;");
	globalCur=MessagePrefix + chatFriendId;
	console.log("当前公共区域：globalCur="+globalCur);
	toggleListMenu("rtc_menu","recent_calls",document.getElementById(chatFriendId+MessagePrefix+"activelist"));//高亮最近联系人列表
};

// 更改联系人聊天窗口div并创建活动list
var chooseContactDivClick = function(li) {
	var chatFriendId = $(li).attr("name");
	console.log("执行chooseContact函数");
	console.log(chatFriendId);
	if (chatFriendId.indexOf(GroupPrefix) >= 0) //chatFriendId=Group+134160751114846652;
	{
		var pattern = GroupPrefix;
		console.log("去除前缀前，chatFriendId="+chatFriendId);
		chatFriendId = chatFriendId.replace(new RegExp(pattern), "");//chatFriendId=134160751114846652;
		chatFriendId = chatFriendId.replace("+","");
		var chatFriendIdPlus=chatFriendId;
		console.log("去除前缀后，chatFriendId="+chatFriendId);
		//var contactLi = document.getElementById(groupFlagMark+chatFriendId);//group--134160751114846652
		var liMark=groupFlagMark+chatFriendId;
		var contactLi = $("#list_group_UL #"+liMark);
		var contactName = $(contactLi).attr("displayname"); //test2;
		chatFriendIdandName =contactName+"+"+chatFriendId;//test2+134160751114846652;
	
		var contentDiv = getGroupContactChatDiv(chatFriendIdandName);
		if (contentDiv==null) 
		{ //不存在
			console.log("接收方接收群组消息，新建群组聊天窗口，参数一：chatFriendId="+chatFriendId+",参数二：contactName="+contactName);
			var newContent = createGroupChatDiv(chatFriendIdandName,contactName);
			document.getElementById("web").appendChild(newContent);
	    	createActiveList(contactName,GroupPrefix,chatFriendIdandName); // 新建活动会话
		} 
		else //存在但globalCur并不是它，让顶部消息数量减去左侧活动列表该项的消息数量，表征已查阅了这么多条的信息
		{
			subNumInHeadTips(chatFriendIdandName,GroupPrefix); //顶部减去sub
			clearNumInActiveListItem(chatFriendIdandName, GroupPrefix);//自身清空不显示
		}
		
		if(globalCur!=null)
		{
			document.getElementById(globalCur).setAttribute("style","display:none;");
		}
		console.log("最终chatFriendId="+chatFriendId);
		console.log("接收方接收群组消息，群组聊天窗口存在，参数一：contactName="+contactName+", 参数二：chatFriendIdPlus="+chatFriendIdPlus);
		globalCur=GroupPrefix+contactName+"+"+chatFriendIdPlus;
		curRoomId=chatFriendIdPlus;
		console.log("收到群组消息出现窗口：curRoomId="+curRoomId);
		document.getElementById(globalCur).setAttribute("style","display:block;");
		console.log("群组当前公共区域：globalCur="+globalCur);
		
	}
	else
	{
		var contentDiv = getContactChatDiv(chatFriendId);
		
		if (contentDiv==null) 
		{ //不存在
			console.log("pq-----当前聊天界面不存在，新建,globalCur"+globalCur);
			var newContent = createContactChatDiv(chatFriendId);
			document.getElementById("web").appendChild(newContent);
	    	createActiveList(chatFriendId,MessagePrefix); // 新建活动会话
	    	
	    	// 获取对端uid(2016-10)
	    	requestUid(chatFriendId);
		} 
		else //存在但globalCur并不是它，让顶部消息数量减去左侧活动列表该项的消息数量，表征已查阅了这么多条的信息
		{
			subNumInHeadTips(chatFriendId,MessagePrefix); //顶部减去sub
			clearNumInActiveListItem(chatFriendId, MessagePrefix);//自身清空不显示
		}
		
		if(globalCur!=null)
		{
			document.getElementById(globalCur).setAttribute("style","display:none;");
		}
		
		document.getElementById(MessagePrefix + chatFriendId).setAttribute("style","display:block;");
		globalCur=MessagePrefix + chatFriendId;
		console.log("当前公共区域：globalCur="+globalCur);
	}
	
	toggleListMenu("rtc_menu","recent_calls",document.getElementById(chatFriendId+MessagePrefix+"activelist"));//高亮最近联系人列表
	
};

//更改群组聊天窗口div并创建活动list
var chooseGroupDivClick = function(li) {
	//var chatGroupId = li.id;

	var chatGroupRoomId = $(li).attr("roomId");
	var chatGroupName = $(li).attr("displayname");
	var chatGroupId = chatGroupName+'+'+chatGroupRoomId;
	console.log("chatGroupId="+chatGroupId);
	if ($(li).attr("type") == 'groupchat'
		&& ('true' != $(li).attr("joined"))) {
	conn.join({
		roomId : $(li).attr("roomId")
	});
	$(li).attr("joined", "true");
	curRoomId = $(li).attr("roomId");
	
	}
	var contentDiv = getGroupContactChatDiv(chatGroupId);

	if (contentDiv==null) { //不存在
		var newContent = createGroupChatDiv(chatGroupId,chatGroupName);
		document.getElementById("web").appendChild(newContent);
    	createActiveList(chatGroupName,GroupPrefix,chatGroupId); // 新建活动会话
	} 

	if(globalCur!=null){
	   document.getElementById(globalCur).setAttribute("style","display:none;");
	}
	curRoomId=chatGroupRoomId;
	console.log("点击群组出现窗口：curRoomId="+curRoomId);
	document.getElementById(GroupPrefix + chatGroupId).setAttribute("style","display:block;");
	globalCur=GroupPrefix + chatGroupId;
};


var chooseContactGroupDivClick = function(chatFriendId) {

	if (chatFriendId.indexOf(GroupPrefix) >= 0) {//chatFriendId=Group+134160751114846652;
		var pattern = GroupPrefix;
		console.log("去除前缀前，chatFriendId="+chatFriendId);
		chatFriendId = chatFriendId.replace(new RegExp(pattern), "");//chatFriendId=134160751114846652;
		chatFriendId = chatFriendId.replace("+","");
		var chatFriendIdPlus=chatFriendId;
		console.log("去除前缀后，chatFriendId="+chatFriendId);
		//var contactLi = document.getElementById(groupFlagMark+chatFriendId);//group--134160751114846652
		var liMark=groupFlagMark+chatFriendId;
		var contactLi = $("#list_group_UL #"+liMark);
		var contactName = $(contactLi).attr("displayname"); //test2;
		chatFriendIdandName =contactName+"+"+chatFriendId;//test2+134160751114846652;
	
		var contentDiv = getGroupContactChatDiv(chatFriendIdandName);
		if (contentDiv==null) { //不存在
			console.log("接收方接收群组消息，新建群组聊天窗口，参数一：chatFriendId="+chatFriendId+",参数二：contactName="+contactName);
			chatFriendId=contactName+"+"+chatFriendId;
			var newContent = createGroupChatDiv(chatFriendId,contactName);
			document.getElementById("web").appendChild(newContent);
	    	createActiveList(contactName,GroupPrefix,chatFriendId); // 新建活动会话
		} 
		if(globalCur!=null)
		{
			document.getElementById(globalCur).setAttribute("style","display:none;");
		}
		console.log("最终chatFriendId="+chatFriendId);
		console.log("接收方接收群组消息，群组聊天窗口存在，参数一：contactName="+contactName+", 参数二：chatFriendIdPlus="+chatFriendIdPlus);
		globalCur=GroupPrefix+contactName+"+"+chatFriendIdPlus;
		curRoomId=chatFriendIdPlus;
		console.log("收到群组消息出现窗口：curRoomId="+curRoomId);
		document.getElementById(globalCur).setAttribute("style","display:block;");
		console.log("群组当前公共区域：globalCur="+globalCur);
		
//			  var group_member_li = $("#"+curRoomId+"group_member ul").find("li");
//			  var group_member_length=$("#"+curRoomId+"group_member ul").find("li").length;
//			  if(group_member_length>0)
//			  {$(group_member_li).remove();
//			  }
//			  startFindRoomMember(curRoomId);
		
	}
	else
	{
		var contentDiv = getContactChatDiv(chatFriendId);
			
		if (contentDiv == null) //不存在
		{
			console.log("pq-----当前聊天界面不存在，新建,globalCur"+globalCur); 
			var newContent = createContactChatDiv(chatFriendId);
			document.getElementById("web").appendChild(newContent);
	    	createActiveList(chatFriendId,MessagePrefix); // 新建活动会话
	    	
	    	// 获取对端uid(2016-10)
	    	requestUid(chatFriendId);
		} 
		if(globalCur!=null)
		{
			document.getElementById(globalCur).setAttribute("style","display:none;");
		}
		
		document.getElementById(MessagePrefix + chatFriendId).setAttribute("style","display:block;");
		globalCur=MessagePrefix + chatFriendId;
		console.log("当前公共区域：globalCur="+globalCur);
	}
	
};

//更改群组聊天窗口div并创建活动list
var chooseGroupDivClick = function(li) {
	//var chatGroupId = li.id;

	var chatGroupRoomId = $(li).attr("roomId");//chatGroupRoomId=134079258417955440
	var chatGroupName = $(li).attr("displayname");//chatGroupName=group1
	var chatGroupId = chatGroupName+'+'+chatGroupRoomId;//chatGroupId=group1+134079258417955440
	console.log("chatGroupId="+chatGroupId);//chatGroupId=group1+134079258417955440
	if ($(li).attr("type") == 'groupchat'
		&& ('true' != $(li).attr("joined"))) {
	conn.join({
		roomId : $(li).attr("roomId")
	});
	$(li).attr("joined", "true");
	curRoomId = $(li).attr("roomId");
	
	}

	var contentDiv = getGroupContactChatDiv(chatGroupId);
	if (contentDiv==null) //不存在
	{
		var newContent = createGroupChatDiv(chatGroupId,chatGroupName);
		document.getElementById("web").appendChild(newContent);
    	createActiveList(chatGroupName,GroupPrefix,chatGroupId); // 新建活动会话
	} 
	else //存在但globalCur并不是它，让顶部消息数量减去左侧活动列表该项的消息数量，表征已查阅了这么多条的信息
	{
		subNumInHeadTips(chatGroupId,GroupPrefix); //顶部减去sub
		clearNumInActiveListItem(chatGroupId, GroupPrefix);//自身清空不显示
	}

	if(globalCur!=null)
	{
	   document.getElementById(globalCur).setAttribute("style","display:none;");
	}
	curRoomId=chatGroupRoomId;
	console.log("点击群组出现窗口：curRoomId="+curRoomId);
	
	document.getElementById(GroupPrefix + chatGroupId).setAttribute("style","display:block;");
	globalCur=GroupPrefix + chatGroupId;
	
	toggleListMenu("rtc_menu","recent_calls",document.getElementById(chatGroupName+GroupPrefix+chatGroupId+"activelist"));//高亮最近联系人列表
};

//删除群组会话界面
var hideGroupChatDiv = function(chatGroupId) {
    //正常关闭群聊界面 charGroupId = group1+134079258417955440
	//退出群组时关闭群聊界面 charGroupId = 134079258417955440
	//隐藏当前窗口
	document.getElementById(globalCur).setAttribute("style","display:none;");
	//关闭群聊界面
	if(chatGroupId.indexOf("+")>=0){
		getGroupContactChatDiv(chatGroupId).remove();//删除对话框
		getActiveList(chatGroupId,GroupPrefix).remove();//删除会话列表对应项
	}
	//退出群组
	else{
	    if($('div[id *= '+ chatGroupId +']'))  //删除对话框
		   $('div[id *= ' + chatGroupId +']').remove();
	    if($('li[id *= '+ chatGroupId +']'))
	       $('li[id *= '+ chatGroupId +']').remove();//删除会话列表对应项
	}
	
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

/*// 清空聊天界面
var clearScreen = function(chatFriendId) {
	$(document.getElementById(chatFriendId + "front")).html("");
};
*/

////新建群组聊天功能区界面
//var createGroupChatDiv = function(chatGroupId,chatGroupName) {
//	//chatGroupId=group2+134162422649848308
//	var Div = GroupPrefix + chatGroupId;//Group+group1+134079258417955440
//	var roomId = chatGroupId.split("+")[1];//134162422649848308
//	console.log("In createGroupChatDiv,Div="+Div);
//	
//	var newContent = document.createElement("div");
//	newContent.setAttribute("id", Div);
//
//	var panel1 = $("<div class=\"panel panel-default\"></div>");
//	$(newContent).append(panel1);
//	/** ****************panel-heading**************************** */
//	var head = $("<div class=\"panel-heading\"><a class=\"btn btn-default\""
//			   + "onclick=\";\">"+ chatGroupName+ "</a><a class=\"btn btn-default\""
//			   + "onclick=\";\">群组ID:"+ roomId+ "</a></div>");
//	panel1.append(head);// 对话框div
//
//	/** ****************panel-body**************************** */
//	var body1 = $("<div class=\"panel-body\"></div>");
//	panel1.append(body1);
//
//	// var div4=$("<div id=\""+chatGroupName+"front\" style=\"height:18em;
//	// overflow:auto;\">");
//	var div4 = $("<div id=\"" + Div
//			+ "front\" style=\"height:18em; overflow:auto;\"></div>");
//
//	body1.append(div4);
//
//	/** *******字体图标开始********* */
//	var IconFont1 = $("<p></p><a class=\"btn btn-default\"><span class=\"glyphicon glyphicon-font\"></span></a>");
//	var IconFont2 = $("<a class=\"btn btn-default\"><span class=\"glyphicon glyphicon-film\"></span></a>");
//	var IconFont3 = $("<a class=\"btn btn-default\" title=\"清屏\" onclick=\"clearScreen\('"
//			+ Div
//			+ "'\);\">"
//			+ "<span class=\"glyphicon glyphicon-trash\"></span></a>");
//	body1.append(IconFont1);
//	body1.append(IconFont2);
//	body1.append(IconFont3);
//	/** ***********字体图标结束********** */
//
//	var textarea1 = $("<p></p><textarea id=\"" + Div
//			+ "message\" style=\"width:100%; height:15%;\"></textarea>");
//	body1.append(textarea1);
//
//	var send = $("<div class=\"panel-footer\"><div class=\"row\">"
//			+ "<div class=\"col-sm-1\">"
//			+ "<button class=\"btn btn-default\" onclick=\"sendText\('"+ Div + "'\);\">发送</button>" 
//			+ "</div>"
//			+ "<div class=\"col-sm-1\">" 
//			+ "<button class=\"btn btn-default\" onclick=\"hideGroupChatDiv\('"+ Div+ "'\);\">关闭</button>"
//			+ "</div></div></div>");
//	panel1.append(send);
//
//	return newContent;
//};

//新建群组聊天功能区界面
var createGroupChatDiv = function(chatGroupId,chatGroupName) {
	//chatGroupId=group2+134162422649848308
	var Div = GroupPrefix + chatGroupId;//Group+group1+134079258417955440
	var roomId = chatGroupId.split("+")[1];//134162422649848308
	console.log("In createGroupChatDiv,Div="+Div);
	
	var newContent = document.createElement("div");
	newContent.setAttribute("id", Div);

	/**** head ****/
	var chat_head = $("<div class=\"chat_head\"></div>");
	var group_name = $("<h2>"+chatGroupName+"</h2>");
	var group_operation = $("<div class=\"chat_head_operation\"></div>");
	var group_operations = $("<ul><li class=\"operation_close\" onclick=\"hideGroupChatDiv\('"+ chatGroupId+ "'\);\">关闭</li><li class=\"operation_exit\">退出群聊</li><li class=\"operation_set\">设置</li><li class=\"operation_add\">邀请好友</li><li class=\"operation_file\">传送文件</li></ul>");

	$(group_operation).append(group_operations);
	$(chat_head).append(group_name);
	$(chat_head).append(group_operation);
	/**** head end ****/

	/**** center ****/
	var chat_box = $("<div id="+Div+"front class=\"chat_list_box group_chat_box\"></div>");
	/**** center end ****/
	
	/**** group_contraction****/
	var group_toggle = $("<div id="+roomId+"group_toggle class=\"group_contraction\" name="+Div+"front groupId="+roomId+">收缩右侧群成员列表</div>").click(function() {
		changeClass(this);});
	var group_member = $("<div id="+roomId+"group_member class=\"group_member hidden\"></div>");
	var group_member_head = $("<h3>群成员</h3>");
	var group_member_ul = $("<ul></ul>");
	$(group_member).append(group_member_head);
	$(group_member).append(group_member_ul);
	
	/**** group_contraction end****/
	
	/**** bottom ****/
	var input_box = $("<div  class=\"input_chat_box\"></div>");
	var textarea = $("<textarea id="+Div+"message name=\"\" cols=\"\" rows=\"\" class=\"input_text\" onkeydown='checkEnterDown(\""+Div+"\")'></textarea>");	var input_edit = $("<div class=\"input_chat_edit\"></div>");
//	var input_edit_l = $("<ul class=\"input_chat_edit_l\"> <li class=\"icon_history\">查看历史对话</li><li class=\"icon_face\">选择表情</li><li class=\"icon_font_size\">文字大小</li><li class=\"icon_color\">文字颜色</li></ul>");
	var input_edit_r = $("<div class=\"input_chat_edit_r\"><input id=\""+Div+"sendBtn\" type=\"button\" value=\"发送\" onclick=\"sendText\('"+ Div + "'\)\" class=\"send_out btn_blue\"/></div>");

//	$(input_edit).append(input_edit_l);
	$(input_edit).append(input_edit_r);

	$(input_box).append(textarea);
	$(input_box).append(input_edit);
	/**** bottom end ****/
	
	$(newContent).append(chat_head);
	$(newContent).append(chat_box);
	$(newContent).append(group_toggle);
	$(newContent).append(group_member);
	$(newContent).append(input_box);
	return newContent;
};

function changeClass(group_toggle){
		  var chat_box_id = $(group_toggle).attr("name");
		  var roomId = $(group_toggle).attr("groupId");
		  console.log(chat_box_id);//Group+group1+134079258417955440front
		  console.log(roomId);//134079258417955440
		  
		  var chat_box = document.getElementById(chat_box_id);
		  if($(chat_box).hasClass("group_chat_box")){
			  $(chat_box).removeClass("group_chat_box");
			  $(chat_box).addClass("group_chat_box2");
		  }else{
			  $(chat_box).removeClass("group_chat_box2");
			  $(chat_box).addClass("group_chat_box");
		  }
		
		  if($(group_toggle).hasClass("group_contraction")){
			  var group_member_li = $("#"+roomId+"group_member ul").find("li");
			  var group_member_length=$("#"+roomId+"group_member ul").find("li").length;
			  if(group_member_length>0)
				  {$(group_member_li).remove();
				  }
				  startFindRoomMember(curRoomId);
			  
			  $(group_toggle).removeClass("group_contraction");
			  $(group_toggle).addClass("group_retract");
			  $("#"+roomId+"group_member").removeClass("hidden");
		  }else{
			  $(group_toggle).removeClass("group_retract");
			  $(group_toggle).addClass("group_contraction");
			  $("#"+roomId+"group_member").addClass("hidden");
		  }
	};

////发送方回显自己的消息：addMessageMsg,MsgDivId=Group+test2+134160751114846652,who=webrtc1-163.com,Imcontact=Group+test2+134160751114846652,message=tt
//var addMessageMsg = function(MsgDivId, userName, remoteUserName,data) {
//	
//	var MsgPage = $(document.getElementById(MsgDivId));
//	console.log("curUserId=" + curUserId);
//	console.log("userName=" + userName);
//	console.log("data="+data);
//	// var ImuserName = formatToEase
//	if (curUserId == userName) {
//		// 本端发出去的消息，放在右边;
//		createOneMessageOnRight(MsgDivId, userName,remoteUserName, data);
//	} else {
//		// 对端发送来的消息,放在左边;
//		createOneMessageOnLeft(MsgDivId, userName, data);
//	}
//}
var addGroupMessageMsg = function(MsgDivId, userName, remoteUserName,data) {

	var MsgPage = $(document.getElementById(MsgDivId));
	console.log("curUserId=" + curUserId);
	console.log("userName=" + userName);
	console.log("data="+data);
	// var ImuserName = formatToEase
	if (curUserId == userName) 
	{
		// 本端发出去的消息，放在右边;
		createOneMessageOnRight(MsgDivId, userName,remoteUserName, data);
	} 
	else 
	{
		// 对端发送来的消息,放在左边;
		createOneMessageOnLeft(MsgDivId, userName, data);
	}
};
var createOneMessageOnLeft = function(MsgDivId, userName, data) {

	var name = formatReEase(userName);
	console.log("对方name="+name);
	var LeftChat = $("<div class='chat_you'></div>");
	if(MsgDivId.indexOf(GroupPrefix)>=0){
		name=MsgDivId;
		console.log("group,对方name="+name);
		
	
	    var LeftChatImg = $("<div class='img_li'>"+
	        "<img src='css/pc/images/img/portrait65_1.jpg' width='65' height='65'/></div>");
		/*var LeftChatMessage = $("<div class='img_text'><div class='text_box'>"+
				"<i></i><p>"+ data +"</p></div></div>");*/
		
		/*var div1 = document.createElement("div");
		div1.setAttribute("class", "Receive-MessageName");
		
		div1.innerHTML = formatReEase(userName) + " " + date();*/
		
		//document.getElementById(name + "front").appendChild(LeftChat);
		$(LeftChat).append(LeftChatImg);
//		curRoomId=MsgDivId.split("+")[2];
//		console.log("群组当前curRoomId="+curRoomId);
	}
	else{
	    var LeftChatImg = $("<div class='img_li'>"+
	        "<img src='css/pc/images/img/portrait65_1.jpg' width='65' height='65'/></div>");
		/*var div1 = document.createElement("div");
		div1.setAttribute("class", "Receive-MessageName");
		div1.innerHTML = name + " " + date();*/
		//document.getElementById(name + "front").appendChild(div1);
		
		$(LeftChat).append(LeftChatImg);
	}

	var LeftChatMessage = $("<div class='img_text'><div class='text_box'>"+
			"<i></i><p>"+ data +"</p></div></div>");
	
	$(LeftChat).append(LeftChatMessage);
	
	/*var div2 = document.createElement("div");
	div2.setAttribute("class", "Receive-MessageContent");
	div2.innerHTML = data;
	document.getElementById(name + "front").appendChild(div2);*/
	var front = $(document.getElementById(name + "front"));
	front.append(LeftChat);
	front.scrollTop(front[0].scrollHeight); //滑动条置底
	console.log("addMessage to MsgPage on left finish!");
};

var createOneMessageOnRight = function(MsgDivId, userName,remoteUserName, data) {
	var name = formatReEase(userName);
	var remoteName =formatReEase(remoteUserName);
	console.log("addMessage to MsgPage on right start!");
//	var div1 = document.createElement("div");
//	div1.setAttribute("class", "Send-MessageName");
//	div1.innerHTML = name + " " + date();
//	$(document.getElementById(name + "front")).append(div1);
//	var div2 = document.createElement("div");
//	div2.setAttribute("class", "Send-MessageContent");
//	div2.innerHTML = "222";
//	document.getElementById(name + "front").appendChild(div2);
	var rightChat = $("<div class='chat_me'></div>");
    var rightChatImg = $("<div class='img_li'>"+
        "<img src='css/pc/images/img/portrait65_2.jpg' width='65' height='65'/></div>");
	var rightChatMessage = $("<div class='img_text'><div class='text_box'>"+
			"<i></i><p>"+ data +"</p></div></div>");
	
	$(rightChat).append(rightChatImg);
	$(rightChat).append(rightChatMessage);
	
	//var ReceiveMessageName = $("<div class=\"Send-MessageName\">"+name + " " +date()+"</div>");
	//var ReceiveMessageContent = $("<div class=\"Send-MessageContent\">"+data+"</div>");
	var front =$(document.getElementById(remoteName + "front"));
	front.append(rightChat);
	front.scrollTop(front[0].scrollHeight); //滑动条置底
	//front.append(ReceiveMessageName);
	//front.append(ReceiveMessageContent);
	console.log("addMessage to MsgPage on right finish!");
};

// 返回聊天功能区id
var getContactChatDiv = function(chatFriendId) {//MessagePrefix="Msg";
	return document.getElementById(MessagePrefix + chatFriendId);
};
//返回群组聊天功能区id
var getGroupContactChatDiv = function(chatFriendId) {//chatGroupId=group1+134079258417955440 //GroupPrefix="Group+";
	return document.getElementById(GroupPrefix + chatFriendId);//GroupPrefix + chatFriendId=Group+group1+134079258417955440
};

// 显示右端好友列表
var FindFriendList = function() {
	document.getElementById("onFriend").setAttribute("class","on");
	document.getElementById("onGroup").removeAttribute("class");
	document.getElementById("onContact").removeAttribute("class");
	$('#list_friend').show();
	$('#list_group').hide();
	$('#list_contact').hide();
	
	///////////写入弹出的我的分组右键菜单
	var RightClickMenu = $("<div id='Rightfriendh2' style='display:none;' class='friend_pop_operation'></div>");
	 $(document.body).append(RightClickMenu);
	
	var MenuUL = $("<ul></ul>");
	RightClickMenu.append(MenuUL);
	var MenuList1 = $("<li onclick='showAddFriend()'>添加好友</li>");
	MenuUL.append(MenuList1);
	var MenuList2 = $("<li onclick=\"showDelFriend()\">删除好友</li>");
	MenuUL.append(MenuList2);
};

//显示右端群组列表
var FindGroupList = function() {
	document.getElementById("onGroup").setAttribute("class","on");
	document.getElementById("onContact").removeAttribute("class");
	document.getElementById("onFriend").removeAttribute("class");
	$('#list_friend').hide();
	$('#list_group').show();
	$('#list_contact').hide();
};


//// 右端好友列表触发模态框，右端li的'name'为好友姓名
//var FriendModal = function(li) {
//	var friendId=$(li).attr("name");
//	$("#myModalLabel").text(friendId);
//	$("#myModal").modal("show");
//};

//// 聊天界面head触发模态框，FriendId为好友名字
//var FriendModalFunctionArea = function(friendId) {
//	$("#myModalLabel").text(friendId);
//	$("#myModal").modal("show");
//};

//var date = function() {
//	var now = new Date();
//	var year = now.getFullYear();
//	var month = now.getMonth() + 1;
//	var day = now.getDate();
//
//	var hh = now.getHours();
//	var mm = now.getMinutes();
//	var ss = now.getSeconds();
//
//	var clock = year + "-";
//
//	if (month < 10)  clock += "0";
//	clock += month + "-";
//
//	if (day < 10)    clock += "0";
//	clock += day + " ";
//
//	if (hh < 10)     clock += "0";
//	clock += hh + ":";
//
//	if (mm < 10)     clock += '0';
//	clock += mm + ":";
//
//	if (ss < 10)     clock += '0';
//	clock += ss;
//
//	return (clock);
//
//};

