//IM服务器的地址
var IM_URL = "http://mysparkweb.free4lab.com/http-bind/";
var VIDEO_URL = "http://mysparkweb.free4lab.com/http-bind:8888";
//填写IM的一些回调函数,待替换
$(document).ready(function(){
	//视频相关-------------------------------------------------
	//WebSocket连接建立成功后的回调函数，可进行后续的音视频会话操作
	com.webrtc.onConnectionOpened = function(){
		console.log("WebSocket连接建立成功");
	}
	//WebSocket连接断开的回调函数
	com.webrtc.onConnectionError= function(){
		console.log("WebSocket Connection Error!!!");
	}
	//音视频通话建立成功后的回调函数
	com.webrtc.onCallActive= function(){
		$("#hangupBtn").attr('disabled',false);
	}
	//由前端实现，提供用户选择功能，用户接受请求则调用accept()，用户拒绝则调用refuse()
	com.webrtc.onResponse= function(){
		if(confirm("是否接受视频请求？")){
			com.webrtc.accept();
		}else{
			com.webrtc.refuse();
		}
	}
	//音视频通话建立失败后的回调函数， 1表示对端拒绝请求，2表示对端不在线，3表示请求超时（现在设的是120s，如果对方没有接受请求会触发超时），4表示会话冲突，对方正在会话中，5表示获取本地媒体流失败，6表示其他错误
	com.webrtc.onCallFailed= function(errCode){
		switch(errCode){
			case 1:
				alert("对端拒绝请求");
				break;
			case 2:
				alert("对端不在线");
				break;
			case 3:
				alert("请求超时");
				break;
			case 4:
				alert("会话冲突，对方正在会话中");
				break;
			case 5:
				alert("获取本地媒体流失败");
				break;
			case 6:
				alert("其他错误");
				break;
		}
	}
	//远端用户主动挂断的回调函数
	com.webrtc.onRemoteHangUpfunction = function(){
		alert("对方挂断了视频");
	}
	
	//IM相关--------------------------------------------------
	//前端的函数，用来渲染好友列表
	function showFriendList(user_list){
		var htmlContent = "";
		for(var i=0; i< user_list.length;i++){
			htmlContent += "=========================";
			htmlContent += "groupName = "+ user_list[i].group_name;
			htmlContent += " is_root = "+ user_list[i].is_root;
			htmlContent += "<br/>";
			var groupMember = user_list[i].group_member;
			for(var j = 0; j < groupMember.length; j++){
				htmlContent += " groupMember[i].email_id = "+groupMember[j].email_id;
				htmlContent += " groupMember[i].name = "+groupMember[j].name;
				htmlContent += " groupMember[i].group = "+groupMember[j].group;
				htmlContent += "<br/>";
			}
			htmlContent += "<br/>";
		}
		$("#friendList").html(htmlContent);
	}
	//每当好友列表有更新时，就会调用的回调函数
	//参数user_list={[(Number)group_id, (String)group_name, (Boolean)is_root, (Array(Object))group_member],...}
	com.xmpp.onRoster = function(user_list) {
		showFriendList(user_list);
	};
	//连接xmpp成功后的回调函数
	com.xmpp.onConnected = function() {
		var username = $('.pub_banner').attr("user");
		//连接webrtc视频---------------------
		//设置本地用户名
		com.webrtc.setLocalUserID(username);
		//webrtc视频创建连接
		com.webrtc.connect(WEBRTC_URL);
		
		//获取好友列表并渲染--------------------
		var user_list = com.xmpp.getRosterWithGroup();
		showFriendList(user_list);
	}
	//某好友的状态发生改变，其中user是一个Object对象，其属性包括email_id和status，其中status的内容包括online，offline和away
	com.xmpp.onPresenceStatusChanged = function(user){
		var htmlContent = "email="+user.email_id+",status="+user.status;
		$("#publicResult").html(htmlContent);
	}
	//即时消息到来时的回调函数，其中msg是一个Object对象，其属性包括email_id和message
	com.xmpp.onChatMessage = function(msg){
		var msg = $("#receivedMessage").html();
		msg += "<br/>"+msg;
		$("#receivedMessage").html(msg);
	}
	//从顶栏拿到userEmail，然后连接IM
	var username = $('.pub_banner').attr("user");
	var oauthToken = $('.pub_banner').attr("oauthToken");
	//测试例子
	//username = 'liujingtong@webrtc';
	//oauthToken = '123456';
	com.xmpp.initialize(username, oauthToken);
});
//-----------------------------------------------
//好友类
//-----------------------------------------------
//显示好友列表
function showFriends(){
	var user_list  = com.xmpp.getRosterWithGroup();
	var htmlContent = "";
	for(var i=0; i< user_list.length;i++){
		htmlContent += "=========================";
		htmlContent += "groupName = "+ user_list[i].group_name;
		htmlContent += "is_root = "+ user_list[i].is_root;
		htmlContent += "<br/>";
		var groupMember = user_list[i].group_member;
		for(var j = 0; j < groupMember.length; j++){
			htmlContent += "groupMember[i].email_id = "+groupMember[j].email_id;
			htmlContent += "groupMember[i].name = "+groupMember[j].name;
			htmlContent += "groupMember[i].group = "+groupMember[j].group;
			htmlContent += "<br/>";
		}
		htmlContent += "<br/>";
	}
	$("#friendList").html(htmlContent);
}
//添加好友
function addFriend(withgroup){
	if(withgroup == '1'){
		//add with group
		var friend_info={
				'email_id':$("#friendEmail").val() ||'qiepei001@gmail.com',
				'name':'',
				'group':$("#groupName").val() || '我的好友'
		};
	}else{
		//add without group
		var friend_info={
				'email_id':$("#friendEmail").val() ||'qiepei001@gmail.com',
				'name':'',
				'group':''
		};
	}	
	com.xmpp.addFriend(friend_info); //自带刷新列表
}
//删除好友
function deleteFriend(){
	var email_id = $("#delfriendEmail").val() ||'qiepei001@gmail.com';
	com.xmpp.deleteFriend(email_id);//自带刷新列表
}
//编辑好友
function editFriend(){
	//目前对于好友的编辑只有“分组信息”的编辑
	var email_id = $("#editfriendEmail").val() ||'qiepei001@gmail.com';
	//改变用户所属的分组，如果新的分组不存在，则新建一个分组
	var new_group_name = $("#editgroupNewName").val();
	//改变用户所属的分组，如果新的分组存在
	//var new_group_name_2 = '我的好友';
	com.xmpp.moveFriendToOtherGroup(email_id, new_group_name);//自带刷新列表
}
//获取单个好友的信息
function getItemInfoFriend(){
	var email_id = $("#getfriendEmail").val() ||'qiepei001@gmail.com';
	//获取好友列表，以Array(Object)的方式返回，Object包含email_id，name和group属性
	var item_list = com.xmpp.getRoster();
	//遍历好友列表，如果找到了，就返回该好友的object，若没有找到，返回undefined
	for(var i=0; i<item_list.length; i++){
		if(item_list[i].email_id == email_id){
			var htmlContent = "Info="+email_id+",group="+group+",name="+name;
			$("#publicResult").html(htmlContent);
			return item_list[i];
		}
	}
	return undefined;
}
//搜索好友
function searchFriend(){
	var key = $("#searchKey").val() || 'qiepei';
	//获取好友列表，以Array(Object)的方式返回，Object包含email_id，name和group属性
	var item_list = com.xmpp.getRoster();
	var searchResult=[];
	var htmlContent ="";
	//遍历好友列表，如果找到了，就返回该好友的object，若没有找到，返回undefined
	for(var i=0; i<item_list.length; i++){
		if(item_list[i].email_id.indexOf(key) != -1){
			htmlContent += "Info="+email_id+",group="+group+",name="+name+"<br/>";			
			searchResult.push(item_list[i]);
		}
	}
	$("#publicResult").html(htmlContent);
	return searchResult;
}
//-----------------------------------------------
//分组类
//-----------------------------------------------
//通过分组名称删除分组，分组中原先的好友全部移动到根组
function deleteGroup(){
	var groupName=$("#totalGroupDelName").val();
	com.xmpp.deleteGroupByName(groupName);
}
//分组重命名，同时会将属于旧群组的好友移动到新分组（具体实现时应该是新建立了分组）
function renameGroup(){
	var old_group_name = $("#totalGroupOldName").val();
	var new_group_name=$("#totalGroupNewName").val();
	com.xmpp.renameGroup(old_group_name,new_group_name);
}
//获取好友分组组列表，以Array(String)的方式返回
function showGroups(){
	var groupList = com.xmpp.getGroupList();
	var htmlContent = "";
	for(var i=0; i<groupList.length; i++){
		htmlContent += groupList[i]+"<br/>";
	}
	$("#publicResult").html(htmlContent);
}
//-----------------------------------------------
//及时通信类
//-----------------------------------------------
//发送即时消息，目标用户为email_id，内容为content
function sendMessage(){
	var message = $("#sendMessage").val();
	var email_id= $("#friendEmail").val() ||'qiepei001@gmail.com';
	com.xmpp.sendChatMessage(email_id,message);
}
//-----------------------------------------------
//视频聊天类
//-----------------------------------------------
//发起连接
function contectToFriend(){
	//设置本地和被叫端媒体播放的标签ID（video标签）
	com.webrtc.setMediaDisplayLabel('local_media', 'remote_media');
	
	//设置被叫端用户标识(email_id)
	var friendEmail = $("#webrtcFriendEmail").val();
	com.webrtc.setRemoteUserID(friendEmail);
	//向在setRemoteUserId()函数中设置好的被叫端用户发起音视频通话请求，其中hasAudio表示是否需要音频流，hasVideo表示是否需要视频流
	com.webrtc.call(true, true);
}
//挂断视频
function hangup(){
	//挂断电话，getCallStatus()为1时才可以调用
	com.webrtc.hangUp();	
}