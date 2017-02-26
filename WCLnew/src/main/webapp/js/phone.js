function getname(name){	
  $("#hide").val(name);	
}

function getroomname(name){	
	  $("#hideroom").val(name);
}

function phonesendMsg(jid, content){
	com.xmpp.sendChatMessage(jid, content);
	var myemail = $('.pub_banner').attr("user");
	
	var $NAME = $(document.getElementById('contentmessage'+ jid));
	$NAME.append('<div class=\'leftalign orangeletter strong padding5\'>' + myemail + '</div>');
	$NAME.append('<div class=\'lefttalign padding5\'>' + content + '</div>');
	
	$NAME.show();
	
	var $CALL = $(document.getElementById('contentvideo'+ jid));
	
	$CALL.hide();
	
}

//function phoneCall(remoteUserNameOriginal){
//	
//    changeW(remoteUserNameOriginal);
//    var remoteuser = formatChange(remoteUserNameOriginal);
//	console.log("reomteuser=" + remoteuser);
//
//	var localmedia = "localmedia" + remoteUserNameOriginal;
//	var remotemedia = "remotemedia" + remoteUserNameOriginal;
//	com.webrtc.setMediaDisplayLabel(localmedia, remotemedia);
//	com.webrtc.setRemoteUserID(remoteuser);
//
//	com.webrtc.call("video","DTLS");
//	
//	var remoteUserNameformatted = changeString(remoteUserNameOriginal);
//	$("#contentmessage" + remoteUserNameformatted).hide();
//	$("#contentvideo" + remoteUserNameformatted).show();
//	
//	$("#call" + remoteUserNameformatted + " span span").html("挂断");
//	$("#call" + remoteUserNameformatted).attr("onclick",
//			"phoneHangup('" + remoteUserNameOriginal + "');");
//	
//
//}
	
	
function phoneCall2(remoteUserNameOriginal,type){
	
    changeW(remoteUserNameOriginal);
    var remoteuser = formatChange(remoteUserNameOriginal);
	console.log("reomteuser=" + remoteuser);

	var localmedia = "localmedia" + remoteUserNameOriginal;
	var remotemedia = "remotemedia" + remoteUserNameOriginal;
	com.webrtc.setMediaDisplayLabel(localmedia, remotemedia);
	com.webrtc.setRemoteUserID(remoteuser);

	com.webrtc.call(type,"DTLS");
	
	var remoteUserNameformatted = changeString(remoteUserNameOriginal);
	$("#contentmessage" + remoteUserNameformatted).hide();
	$("#contentvideo" + remoteUserNameformatted).show();
	
	$("#call" + remoteUserNameformatted + " span span").html("挂断");
	$("#call" + remoteUserNameformatted).attr("onclick",
			"phoneHangup('" + remoteUserNameOriginal + "');");
	

}

//function imsCall(remoteUser){  
//	console.log("imscall...");  
//	changeIMSW(remoteUser);
//
//	var localmedia = "localmedia" + remoteUser;
//	var remotemedia = "remotemedia" + remoteUser;
//	com.webrtc.setMediaDisplayLabel(localmedia, remotemedia);
//	com.webrtc.setRemoteUserID(remoteUser);
//
//	com.webrtc.call("video","SDES");
//	var remoteUserNameformatted = changeString(remoteUser);
//
//	$("#contentvideo" + remoteUserNameformatted).show();
//
//	
//
//	$("#call" + remoteUserNameformatted + " span span").html("挂断");
//	$("#call" + remoteUserNameformatted).attr("onclick",
//			"imsphoneHangup('" + remoteUser + "');");
//
//}

function imsCall2(remoteUser,type){  
	console.log("imscall...");  
	changeIMSW(remoteUser);

	var localmedia = "localmedia" + remoteUser;
	var remotemedia = "remotemedia" + remoteUser;
	com.webrtc.setMediaDisplayLabel(localmedia, remotemedia);
	com.webrtc.setRemoteUserID(remoteUser);

	com.webrtc.call(type,"SDES");
	var remoteUserNameformatted = changeString(remoteUser);

	$("#contentvideo" + remoteUserNameformatted).show();

	

	$("#call" + remoteUserNameformatted + " span span").html("挂断");
	$("#call" + remoteUserNameformatted).attr("onclick",
			"imsphoneHangup('" + remoteUser + "');");

}

//function imsmeetingCall(remoteUser){  
//	console.log("imsmeetingcall...");   
//	changeIMSW(remoteUser);
//
//	var localmedia = "";
//	var remotemedia = "remotemedia" + remoteUser;
//	com.webrtc.setMediaDisplayLabel(localmedia, remotemedia);
//	com.webrtc.setRemoteUserID(remoteUser);
//
//	com.webrtc.call("video","DTLS");
//	var remoteUserNameformatted = changeString(remoteUser);
//
//	$("#contentvideo" + remoteUserNameformatted).show();
//
//	
//
//	$("#call" + remoteUserNameformatted + " span span").html("挂断");
//	$("#call" + remoteUserNameformatted).attr("onclick",
//			"imsmeetingHangup('" + remoteUser + "');");
//
//}

function imsmeetingCall2(remoteUser,type){  
	console.log("imsmeetingcall...");   
	changeIMSW(remoteUser);

	var localmedia = "";
	var remotemedia = "remotemedia" + remoteUser;
	com.webrtc.setMediaDisplayLabel(localmedia, remotemedia);
	com.webrtc.setRemoteUserID(remoteUser);

	com.webrtc.call(type,"DTLS");
	var remoteUserNameformatted = changeString(remoteUser);

	$("#contentvideo" + remoteUserNameformatted).show();

	

	$("#call" + remoteUserNameformatted + " span span").html("挂断");
	$("#call" + remoteUserNameformatted).attr("onclick",
			"imsmeetingHangup('" + remoteUser + "');");

}




function beforeMeetingCalling(remoteUser)
{

	console.log(remoteUser);
	if(remoteUser.length != 0){
		
		//写入cookie
		recordTempListCookieForMeeting(remoteUser);
		showTempFriendListOfMeeting();
		
		$("meetinghtmlIMSId").val("");
		
		var $username = $(document.getElementById(remoteUser));

		$username.click();
		
		var $CALL=$(document.getElementById('call'+remoteUser));
		
		$CALL.click();
		
					

		}
	else {
		$("meetinghtmlIMSId").val("");
		alert("会议号不能为空，请重新输入！");
	}

}

function beforeIMSCalling(remoteuser)
{
	
		console.log(remoteuser);
	
		if(remoteuser.length != 0){
		       var remoteUser=remoteuser;
			//写入cookie
			recordTempListCookie(remoteUser);
			showTempFriendListOfIMS();
			
			$("imshtmlIMSId").val("");
			
			var $username = $(document.getElementById(remoteUser));

			$username.click();
			
			var $CALL=$(document.getElementById('call'+remoteUser));
			
			$CALL.click();
			
						

			}
		else {
			$("imshtmlIMSId").val("");
			alert("IP电话不能为空，请重新输入！");
		}
	
}



function phoneHangup(remoteUserNameOriginal) {

	var remoteuser = formatChange(remoteUserNameOriginal);
	console.log("phonehangup remoteuser=" + remoteuser);
	com.webrtc.hangUp(remoteuser);
	btnHangup(remoteUserNameOriginal);

}

function btnHangup(remoteUserNameOriginal) {

	console.log("remoteUserNameOriginal1=" + remoteUserNameOriginal);
	remoteUserNameOriginal = changeString(remoteUserNameOriginal);

	console.log("remoteUserNameOriginal2=" + remoteUserNameOriginal);
	$("#contentvideo" + remoteUserNameOriginal).hide();
	$("#contentmessage" + remoteUserNameOriginal).show();
	$("#call" + remoteUserNameOriginal + " span span").html("CALL");
	$("#call" + remoteUserNameOriginal).attr("onclick",
			"phoneCall('" + remoteUserNameOriginal + "')");
	
	

	
}

function imsphoneHangup(remoteuser) {
	com.webrtc.hangUp(remoteuser);
	imsbtnHangup(remoteuser);
}

function imsbtnHangup(remoteUser){
	console.log("remoteUser=" + remoteUser);
	remoteUserNameOriginal = changeString(remoteUser);


	$("#contentvideo" + remoteUserNameOriginal).hide();

	$("#call" + remoteUserNameOriginal + " span span").html("CALL");
	$("#call" + remoteUserNameOriginal).attr("onclick",
			"imsCall('" + remoteUserNameOriginal + "')");
}

function imsmeetingHangup(remoteuser) {
	console.log("imsmeetingHangup remoteUser=" + remoteuser);
	com.webrtc.hangUp(remoteuser);
	imsmeetingbtnHangup(remoteuser);
}

function imsmeetingbtnHangup(remoteUser){
	console.log("imsmeetingbtnHangup remoteUser=" + remoteUser);
	remoteUserNameOriginal = changeString(remoteUser);


	$("#contentvideo" + remoteUserNameOriginal).hide();

	$("#call" + remoteUserNameOriginal + " span span").html("CALL");
	$("#call" + remoteUserNameOriginal).attr("onclick",
			"imsmeetingCall('" + remoteUserNameOriginal + "')");
}

//change code by guoxun
function changeW(name) { 

	//name =changeString(name);

	console.log("name=" + name);
	var w = document.body.clientWidth;

	var h = document.body.clientHeight
			- document.getElementById("header" + name).offsetHeight
			- document.getElementById("footer" + name).offsetHeight;
	var h2 = h / 3;

	name = changeString(name);
	
//	console.log("isCustomerInMobile="+isCustomerInMobile(name));
	
	$("#remotemedia" + name).css("width", w);

		$("#remotemedia" + name).css({
			//     "background-color":"#FF0000",
			"position" : "absolute",
			//  "top": "50px",
			"left" : "0px",
			"border" : "2px solid blue",
			"display" : "block",
			"z-index" : "99"
		});

		$("#localmedia" + name).css("width", w / 5);
		$("#localmedia" + name).css({
			//        "background-color":"#00FF00",
			"position" : "absolute",
			//"top": document.getElementById("h1header").offsetHeight+2*h/3,
			"right" : "0px",
			"border" : "2px solid red",
			"display" : "block",
			"z-index" : "100"
		});
		
		

}

function changeIMSW(name){ //要改

	//name =changeString(name);

	console.log("name=" + name);
	var w = document.body.clientWidth;

	var h = document.body.clientHeight
			- document.getElementById("header" + name).offsetHeight
			- document.getElementById("footer" + name).offsetHeight;
	var h2 = h / 3;

	name = changeString(name);
	
//	console.log("isCustomerInMobile="+isCustomerInMobile(name));
	
	$("#remotemedia" + name).css("width", w);

		$("#remotemedia" + name).css({
			//     "background-color":"#FF0000",
			"position" : "absolute",
			//  "top": "50px",
			"left" : "0px",
			"border" : "2px solid blue",
			"display" : "block",
			"z-index" : "99"
		});

		$("#localmedia" + name).css("width", w / 5);
		$("#localmedia" + name).css({
			//        "background-color":"#00FF00",
			"position" : "absolute",
			//"top": document.getElementById("h1header").offsetHeight+2*h/3,
			"right" : "0px",
			"border" : "2px solid red",
			"display" : "block",
			"z-index" : "100"
		});
		
		
		console.log("finish changeimsw!!");
 
}


function searchfriend(friendId){
	
	if(friendId != ""){	
		var objListView = document.getElementById("bb");
		objListView.innerHTML = "";    //清空ListView原本的内容
		$("#img2").show();
		com.xmpp.searchFriendsOnServer(friendId);
	}else{
		
		alert("请输入用户名")
	}
	
	
}

function startsearch(){
	var friendId=$("#textinput8").val();
	searchfriend(friendId);
	
	
}


function getfriendname(userid){
	
	if(window.confirm('添加该用户为好友吗？')){
        //alert("确定");
		checkBeforeAddFriend(userid);
     }else{
        //alert("取消");
        return false;
        
    }	
	
}
function getfriendnamedelete(userid){
	
	if(window.confirm('删除该好友吗？')){
        //alert("确定");
		deleteFriendFn(userid);
     }else{
        //alert("取消");
        return false;
        
    }	
	
}



function mobileaddfriend()
{	
	var addfriend = $(document.getElementById("friendname"));
	var emailname=addfriend.attr("value");
	if(emailname == null || emailname == "" )
		{
			alert("好友不能为空！");
			addfriend.attr("value","");
		}
	else
		{
		getfriendname(emailname);
		}
}


function mobiledeletefriend()
{	
	var addfriend = $(document.getElementById("friendname"));
	var emailname=addfriend.attr("value");
	if(emailname == null || emailname == "" )
		{
			alert("好友不能为空！");
			addfriend.attr("value","");
		}
	else
		{
		getfriendnamedelete(emailname);
		}
}

function checkBeforeAddFriend(userid){
	
	
	var checkResult = userid;
	if( checkResult ){
		var username = $('.pub_banner').attr("user");
		if(-1 != username.indexOf(checkResult)){
			alert("不能添加自己为好友哦，请重新选择。");
			return false;
		}else{
			var isMyFriend = com.xmpp.isFriendInRoster(checkResult);
			//是否已经在我的好友列表中
			if(isMyFriend){
				alert("该用户已在您的好友列表中了，请选择其他好友。");
				return false;
			}else{
				//分别获取好友id和所选择的群组
				var friendId = checkResult;			
				
				var friend_info={
						'email_id':friendId,
						'name':'',
						'group':'',
				};
				console.log("friend_info.name="+friend_info.name);
				com.xmpp.addFriend(friend_info); //自带刷新列表
				alert("已发送了好友申请，待对方确认");
			}
		}		
	}else{
		alert("您还没有选择要添加的好友。");
		return false;
	}
}

function deleteFriendFn(friendId){
	
		var groupName = com.roster.getFriendGroup(friendId);
	    var user = com.user.getBareJid();
	    var destination = com.util.emailToJid(friendId);
	    
	    if(groupName == "黑名单"){
	    	deletePacketFilterRule(destination, user);
	    	deletePacketFilterRule(user, destination);
	    }else{
	    	deletePacketFilterRule(user, destination);
	    }
	    
		var username=friendId;
		console.log("aaa");
		var deleteone =$(document.getElementById("CallPage"+username));
		if(deleteone.length>0){
			console.log("bbb");
			var deleteli = $(document.getElementById(username)).parent().parent().parent();
			deleteli.remove();
	        $('#e1').page();
			
			$('#aa').listview('refresh');  
			deleteone.remove();
			console.log("ccc");
		}
	    
		//调用删除好友的接口
		com.xmpp.deleteFriend(friendId);//自带刷新列表
		alert("删除好友成功");
}

function acceptApplyFriend(email_id){

	
	//同意对方添加自己为好友
	com.xmpp.approveSubscribeById(email_id);
	
	//分别获取好友id和所选择的群组		
		
	var friend_info={
			'email_id':email_id,
			'name':'',
			'group':"",
	};
	console.log("friend_info.name="+friend_info.name);
	com.xmpp.approveAddFriend(friend_info); //自带刷新列表	
	
}

function refuseApplyFriend(email_id){
	
	com.xmpp.denySubscribeById(email_id);
	
}

function deletefriend(){
	var friendId=$("#hide").val();
	
	
	if( friendId && friendId!="" && confirm("是否确认删除该好友？") ){
		
		//调用删除好友的接口
		com.xmpp.deleteFriend(friendId);//自带刷新列表
		alert('删除好友成功');
	}
	
}
//显示群成员
function showroomlist(){
	var roomnamejid=$("#hide").val();
	var roomjidAdded="@conference.webrtc";
	var roomJID=roomnamejid+roomjidAdded;
	var roommemberlist = new Array();
	var roommemberlist = com.groupChat.getRoomMemberList(roomJID);
	var roomlistside = [];
    for(var i=0; i<roommemberlist.length; i++){
    	roomlistside[i] ="<li onclick=\"\"><a href=\"\">"+roommemberlist[i].jid+"</a></li>";   
    }
  var roomlistsum = roomlistside.join("");
  console.log(roomlistsum);
  $("#ff").append(roomlistsum);
	$("#img5").hide(); 
	
}

//离开房间
function leaveroom(){
	
	var roomnamejid=$("#hide").val();
	var roomjidAdded="@conference.webrtc";
	var roomJID=roomnamejid+roomjidAdded;
	com.xmpp.leaveRoom(roomJID);
	console.log(roomJID);
   for(var i=1;i<com.rooms.length;i++){
		
		console.log(com.rooms[i].roomJID);
		var roomName=com.rooms[i].roomJID.split('@')[0];
	}

	alert("离开聊天室成功");
	
}


//搜索房间
function startsearchroom(){
	
	var roomId=$("#textinput11").val();
	searchroom(roomId);
	var roomJId = trim($("#"+roomId).val());
	com.xmpp.searchRoomsOnServer(roomJId);
	//回调显示搜索出来的room还木有写哦哦~~~
	
	
}



function searchroom(roomId){
	
	if(roomId != ""){	
		var objListView = document.getElementById("cc");
		objListView.innerHTML = "";    //清空ListView原本的内容
		$("#img9").show();
		com.xmpp.searchFriendsOnServer(friendId);
	}else{
		
		alert("请输入聊天室")
	}
}



//格式转化，去掉“@”换成“-”，并在后面加“@WebRTC”	
function formatChange(original){
	return original.split("@")[0]+'-'+original.split("@")[1]+"@WebRTC";
}
//格式转换，去掉“@WebRTC”，“-”换成“@”
function formatRechange(original){
	return original.split('@')[0].replace('-','@');
}

//add code by guoxun
function addChatJSP(original)
{
	
	
	getname(original);
	var username=original;
	
	var $username = $(document.getElementById(username));

	$username.click();
		
}

//add code by guoxun
function formatOfferID(original)
{
	return original.split('@')[0].replace('-','@');
}
function phonesendingMsg(name)
{
	var $content = $(document.getElementById('inputtxt'+ name));	
	phonesendMsg(name,$content.val());
	$content.val("");
}
function phoneToggle(name)
{
	var $MESSAGE = $(document.getElementById('contentmessage'+ name));
	var $VIDEO = $(document.getElementById('contentvideo'+ name));
	$MESSAGE.toggle();
	$VIDEO.toggle();
	
}

function changeString(dragClass) {
	var dragClassAfter = "";
	for (var i = 0; i < dragClass.length; i++) {
		if ((dragClass[i] >= "0" && dragClass[i] <= "9")
				|| (dragClass[i] >= "a" && dragClass[i] <= "z")
				|| (dragClass[i] >= "A" && dragClass[i] <= "Z")) {
			dragClassAfter += dragClass[i];

		} else {
			dragClassAfter += "\\";
			dragClassAfter += dragClass[i];
		}

	}

	dragClass = dragClassAfter;

	return dragClass;
}