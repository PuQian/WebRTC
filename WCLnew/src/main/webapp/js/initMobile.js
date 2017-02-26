var VIDEO_URL;
var LOGOUT_FLAG=false;
//填写IM的一些回调函数,待替换
$(document).ready(function(){
//	//视频相关-------------------------------------------------
//	//连接建立成功的回调函数
//	com.webrtc.onConnectionOpened = function(){
//		$("#socketconnected").val("true");
//		var  tipContent = "websocket连接建立成功！可以支持音视频会话";
//		fillTipBox('success',tipContent);
//	}
//	
//	//连接建立失败的回调函数
//	com.webrtc.onConnectionError = function(){
//		$("#socketconnected").val("false");
//		var  tipContent = "websocket连接建立失败！";
//		fillTipBox('error',tipContent);
//	};
//	
//	//由前端实现，提供用户选择功能，用户接受请求则调用accept()，用户拒绝则调用refuse()
//	
//	com.webrtc.onResponse= function(mediaType,originID){
//		if(mediaType == "video")
//		{
//			if(!confirm("同意视频通话请求？")){			
//				
//				com.webrtc.refuse(originID);
//				return ;
//			}else{			
//				com.webrtc.mobileInterfaceShow(mediaType, originID);	
//				return 	;	
//			}	
//		}
//		else if(mediaType == "audio")
//		{
//			if(!confirm("同意音频通话请求？")){			
//				com.webrtc.refuse(originID);
//				return ;
//			}else{			
//				com.webrtc.mobileInterfaceShow(mediaType, originID);
//				return ;		
//			}			
//		}
//		else
//		{		  
//			console.log(originID);
//
//			$("#tempvalue").attr("value",originID);
//			$("#receiveselectchange").click();
//			 
//		}
//		
//	}
//	
//	//自动跳转到会话页面
//	com.webrtc.handleMobileJSP = function(originID){
//	
//		var remoteUser=originID;
//		var formatID;
//		
//		var srcId=[];
//		srcId=remoteUser.split('@');     // 
//		
//		
//		if (srcId[1]=="WebRTC") 
//		{//WebRTC用户 ，会话页面已经存在，不用新生成
//			formatID=formatOfferID(originID);
//		}
//				
//		else if (srcId[1]=="open-ims.com" ||srcId[1] == "gd.ctcims.cn" ) 
//		{//IMS 用户，会话页面可能存在，也可能不存在
//			
//			formatID=originID;
//			if(document.getElementById("CallPage"+formatID)==null)
//			{
//				recordTempListCookie(formatID);
//				showTempFriendListOfIMS();
//				
//				$("imshtmlIMSId").val("");	
//				
//			}
//			
//		}
//
//		else
//		{  
//			//目前  else 里 对应的会议
//			formatID=originID;
//			if(document.getElementById("CallPage"+formatID)==null)
//			{  
//				recordTempListCookieForMeeting(formatID);
//				showTempFriendListOfMeeting();
//				$("meetinghtmlIMSId").val("");
//			}	    	
//	    }	
//				
//		
//		//跳转页面
//		if(document.getElementById("CallPage"+formatID))
//			{			 
//			console.log("call page exist");
//			addChatJSP(formatID);
//			console.log("finish addChatJSP");
//			}
//		else
//			{
//			console.log("call page don't exist,have problem!!!");
//			}		
//			
//	}
//	
//
//	com.webrtc.mobileInterfaceShow = function(remoteMediaType, originID)
//	{
//		
//		var remoteUser = originID;
//		console.log("in initMobile.js remoteUser="+ remoteUser);
//
//		var srcId=[];
//		srcId=remoteUser.split('@');     // 
//		
//		
//		
//		
//		var localmedia;
//		var remotemedia;
//		
//		if (srcId[1]=="WebRTC") { //WebRTC 用户
//			
//			localmedia="localmedia"+formatOfferID(originID);
//			remotemedia="remotemedia"+formatOfferID(originID);
//			
//	
//      }else if (srcId[1]=="open-ims.com" ||srcId[1] == "gd.ctcims.cn"){ //IMS
//    	  
//    		localmedia="localmedia"+originID;
//			remotemedia="remotemedia"+originID;
//    	    	
//      }
//      else{  //目前  else 里 对应的会议
//    	  localmedia="localmedia"+originID;
//		  remotemedia="remotemedia"+originID;
//		  if(remoteMediaType==null) remoteMediaType="video";
//    	
//      }	
//		
//		this.gPeerConnections[originID].gLocalMediaLabel=localmedia;
//		this.gPeerConnections[originID].gRemoteMediaLabel=remotemedia;
//		com.webrtc.accept(remoteMediaType, originID);
//	}
//	
//	
//	
//	
//	//媒体流连通失败的回调函数
//	com.webrtc.onCallFailed = function(errCode){
//		/* 1 ：对端拒绝请求；
//           2 ：对端不在线；
//           3 ：请求超时（现在设的是120s，如果对方没有接受请求会触发超时）；
//           4 ：会话冲突，对方正在会话中；
//           5 ：获取本地媒体流失败；
//           6 ：其他错误；
//         */	
//		if(errCode == this.Session.SESSION_ERROR["refused"]){
//			alert('媒体流连通失败:对端拒绝请求');
//			console.log("User refused!");
//		} else if(errCode == this.Session.SESSION_ERROR["offline"]){
//			alert('媒体流连通失败:对端不在线或对方的浏览器不支持webrtc多媒体会话');
//			console.log("User offline!");
//		} else if(errCode == this.Session.SESSION_ERROR["timeout"]){
//			alert('媒体流连通失败:请求超时');
//			console.log("Session timeout!");
//		} else if(errCode == this.Session.SESSION_ERROR["conflict"]){
//			alert('媒体流连通失败:会话冲突，对方正在会话中');
//			console.log("Session conflict!");
//		} else if(errCode == this.Session.SESSION_ERROR["local-stream-failed"]){
//			alert('媒体流连通失败:获取本地媒体流失败');
//			console.log("Local-stream-failed error!");
//		} else if(errCode == this.Session.SESSION_ERROR["remote-stream-failed"]){
//			alert('媒体流连通失败:获取远端媒体流失败');
//			console.log("Remote-stream-failed error!");
//		} else if(errCode == this.Session.SESSION_ERROR["other"]){
//			alert('媒体流连通失败:其他错误');
//			console.log("Other error!");
//		}
//		$(document).trigger('close.facebox');
//	}
//	
//	//媒体流连通成功的回调函数
//	com.webrtc.onCallActive = function(originID){
//       console.log("in com.webrtc.onCallActive   initMobile.js");
//      
//     //  var remoteUser = com.webrtc.gPeerConnections[originID].gRemoteUserID;
//      
//		var remoteUser = originID;
//		var srcId=[];
//		srcId=remoteUser.split('@'); 
//		console.log("in initMobile.js remoteUser="+ remoteUser);
//
//		if (srcId[1]=="WebRTC") { //WebRTC 用户
//			
//			//需要将 jxk143-163.com@WebRTC --->  jxk143@163.com
//			var remoteUserNameOriginal=formatRechange(originID);
//			
//			console.log("Webrtc onCallActive remoteUserNameOriginal="+remoteUserNameOriginal);
//			var remoteUserNameformatted =changeString(remoteUserNameOriginal);
//			
//			  $("#contentmessage"+remoteUserNameformatted).hide();
//			  $("#contentvideo"+remoteUserNameformatted).show();
//	
//			  $("#call"+remoteUserNameformatted+" span span").html("挂断");
//			  $("#call"+remoteUserNameformatted).attr("onclick","phoneHangup('"+remoteUserNameOriginal+"');");
//		
//      
//				var remoteUserNameOriginal = formatRechange(originID);
//				changeW(remoteUserNameOriginal);
//				attachMediaStream(
//					com.webrtc.gPeerConnections[originID].gRemoteMediaLabel,
//						com.webrtc.gPeerConnections[originID].gRemoteStream);
//		
//		
//		
//		
//		}else if (srcId[1]=="open-ims.com" ||srcId[1] == "gd.ctcims.cn"){
//    	  
//    	
//    	  //originID 不需要转换 本身就是 alice@open-ims.com
//			var remoteUserNameOriginal=originID;
//			
//			console.log("IMS onCallActive remoteUserNameOriginal="+remoteUserNameOriginal);
//			var remoteUserNameformatted =changeString(remoteUserNameOriginal);
//			
//		//	  $("#contentmessage"+remoteUserNameformatted).hide();
//			  $("#contentvideo"+remoteUserNameformatted).show();
//	
//			  $("#call"+remoteUserNameformatted+" span span").html("挂断");
//			  $("#call"+remoteUserNameformatted).attr("onclick","imsphoneHangup('"+remoteUserNameOriginal+"');");
//    	  		
//				var remoteUserNameOriginal = originID;
//				changeW(remoteUserNameOriginal);
//				attachMediaStream(
//						com.webrtc.gPeerConnections[originID].gRemoteMediaLabel,
//						com.webrtc.gPeerConnections[originID].gRemoteStream);
//		
//		
//		
//		}
//      else{  //目前  else 里 对应的会议
//    	  
//    	  //originID 不需要转换 本身就是  123456
//			var remoteUserNameOriginal=originID;
//			
//			console.log("Meeting onCallActive remoteUserNameOriginal="+remoteUserNameOriginal);
//			var remoteUserNameformatted =changeString(remoteUserNameOriginal);
//			
//		//	  $("#contentmessage"+remoteUserNameformatted).hide();
//			  $("#contentvideo"+remoteUserNameformatted).show();
//	
//			  $("#call"+remoteUserNameformatted+" span span").html("挂断");
//			  $("#call"+remoteUserNameformatted).attr("onclick","imsmeetingHangup('"+remoteUserNameOriginal+"');");
//			  
//				var remoteUserNameOriginal = originID;
//				changeW(remoteUserNameOriginal);
//				attachMediaStream(
//						com.webrtc.gPeerConnections[originID].gRemoteMediaLabel,
//						com.webrtc.gPeerConnections[originID].gRemoteStream);
//      
//      }
//		
//		
//		
//	}
//	
//	// 远端挂断会话的回调函数
//	com.webrtc.onRemoteHangUp = function(originID) {
//				
//		var srcId=[];
//		srcId=originID.split('@');
//		
//		if(srcId[1]=="open-ims.com" || srcId[1]== "gd.ctcims.cn"){ 
//			
//			imsbtnHangup(originID);	
//		}
//		else if (srcId[1]=="WebRTC")
//		{
//			btnHangup(formatRechange(originID));
//		}
//		else
//		{  //目前else指的是 会议
//			imsmeetingbtnHangup(originID);			
//		}
//	}
//	
//	//视频流不通或错误时，界面回调函数
//	com.webrtc.recoverinterface=function(originID)
//	{
//		
//		var srcId=[];
//		srcId=originID.split('@');
//		
//		if(srcId[1]=="open-ims.com" || srcId[1]== "gd.ctcims.cn"){ 
//			
//			imsbtnHangup(originID);	
//		}
//		else if (srcId[1]=="WebRTC")
//		{
//			btnHangup(formatRechange(originID));
//		}
//		else
//		{  //目前else指的是 会议
//			imsmeetingbtnHangup(originID);			
//		}
//		
//	}
//	
//	//会话切换 主叫的视频弹出函数 音频
//	com.webrtc.startChangeView = function(originID)
//	{
//		var userID=formatRechange(originID);
//		
//		//var divID=emailToUserId(userID);
//		
//		//startFriendDialog(divID,'undefined');
//		//beginVideo(userID,divID);
//		
//		//跳转页面
//		if(document.getElementById("CallPage"+userID))
//			{			 
//			console.log("call page exist");
//			addChatJSP(userID);
//			console.log("finish addChatJSP");
//			}
//		else
//			{
//			console.log("call page don't exist,have problem!!!");
//			}		
//		
//		
//		phoneCall(userID);
//		
//		
//		
//	}
	
	
//	
//	//IM相关--------------------------------------------------
//	//获取好友列表
//	com.xmpp.onRoster = function(user_list) {
//		for(var i=0;  i<user_list.length; i++){
//			console.log("group:"+user_list[i].group_name+user_list[i].is_root+user_list[i].group_member);
//			for(var j = 0; j < user_list[i].group_member.length; j++){
//				var test = {
//							userName:user_list[i].group_member[j].email_id,
//							userId:user_list[i].group_member[j].name,
//							status:user_list[i].group_member[j].status
//							};
//			
//				console.log("test:"+test);
//				
//		
//				var userid=test.userName;
//				console.log("userid="+userid);
//				//var username=userid.split("@","1");
//				var username=userid;
//				var status=test.status;
//				if($(document.getElementById("CallPage"+username)).length==0){
//				
//				var li_1="<li onclick=\"getname('"+username+"')\"><a id='"+username+"' href='" + '#CallPage' + username + "'>"+username+"</a></li>";
//				var objListView = document.getElementById("aa");
////				objListView.innerHTML = "";    //清空ListView原本的内容
//				$("#aa").append(li_1);
//				
//				$('#e1').page();
//				
//				$('#aa').listview('refresh');  
//				
//				
//		    	 createCallJSP(username);
//				}
//	          
//			}
//		}
//		$("input[data-type='search']").attr("placeholder","过滤");
//		$("#img1").hide();
//		  $("#aa").listview('refresh'); 
//		  
//		
///*		$("#addlistgb").unbind();
//		$('#addlistgb').click(function(){ShowAddListOnRoster()});
//		
//		
//	
//		
//		console.log("userlist:"+user_list);	
//		$("#realfriend").html('');
//		if (user_list.length > 0 && $('#myfriendgb').hasClass('selected')) {
//			var markExistFriend = false;
//			for(var i=0; i<user_list.length; i++){
//				var groupName = user_list[i].group_name;
//				var is_root = user_list[i].is_root;
//				var group_member = user_list[i].group_member;
//				var groupMember = [];
//				//记录是否有好友
//				if( group_member.length > 0 ){
//					markExistFriend = true;
//				}
//				for(var j = 0; j < group_member.length; j++){
//								
//					groupMember[j] = {
//							userName:group_member[j].email_id,
//							userId:group_member[j].name,
//							status:group_member[j].status
//							};
//				}
//				showGroup(groupName, groupMember,is_root);
//			}
//			$(".webwidget_vertical_menu_temp").webwidget_vertical_menu();
//			$(".webwidget_vertical_menu_temp").removeClass('webwidget_vertical_menu_temp').addClass('webwidget_vertical_menu');
//			$('a[rel=facebox]').facebox();
//			$('a[rel=facebox]').attr('rel','faceboxready');
//			$('#friendadd').removeClass('hidden');
//			//没有好友的提醒
//			if(!markExistFriend){
//				var tipContent = "您还没有好友，赶紧添加吧";
//				fillTipBox('success',tipContent);
//			}
//		}
//		$("#addlistgb").unbind();
//		$('#addlistgb').click(function(){showAddListFn()});
//		
//		$("#myroomgb").unbind();
//		$('#myroomgb').click(function(){showRoomListFn()});
//*/		
//		//$('#addlistgb').attr('onclick','showAddListFn()');
//	};
//	
//	
////创建不存在的聊天室	
//com.xmpp.onRoomNotExist = function(room_list){
//	
//	var roomName= room_list.roomJID.split('@')[0];
////	showRoom(roomName);
//	
//}
//
//
////显示聊天室列表	
//com.xmpp.onRoomJoined = function(room_list) {
//
//			var roomName = room_list.roomJID.split('@')[0];
//			console.log("roomname:");
//			console.log(roomName);
//			
//			
//			
//			console.log("lll");
////			var htmlInside = [];
//			var li_1="<li onclick=\"getname('"+roomName+"')\"><a href=\"roomchat\">"+roomName+"</a></li>";
////				var objListView = document.getElementById("dd");
////				objListView.innerHTML = "";    //清空ListView原本的内容
////				var htmlInsideSum = htmlInside.join("");
//			$("#dd").append(li_1);
//			$("#img4").hide();
//
//			 $("#dd").listview('refresh'); 
//			       
//
//		console.log("dada");
//					
//
//	};
//		
//	//改变状态：在线、离线、离开
//	com.xmpp.onPresenceStatusChanged = function(data) {
//		var divId = emailToUserId(data.email_id);
//		if(divId != undefined){
//			if($('#'+divId+' div:first').find('.status').attr('src') == "images/onlinemessage.gif" || $('#'+divId+' div:first').find('.status').attr('src') == "images/offlinemessage.gif"){
//				data.status = data.status + "message.gif";
//			}
//			$('#'+divId+' div:first').html('<img class=\'status leftfloat rightmargin_5\' src=\'images/'+data.status+'.gif\' /> <div class=\'leftfloat\'> '+data.email_id.split('/')[0])+'</div>';
//			$('#talking'+divId+' div:first').html('<img class=\'status leftfloat rightmargin_5\' src=\'images/'+data.status+'.gif\' /> <div class=\'leftfloat\'>  '+data.email_id.split('/')[0])+'</div>';
//			//添加会话窗口的在线状态
//			$("#chat"+divId+' .drag'+divId).html('<img class=\'status\' src=\'images/'+data.status+'.gif\' />  '+data.email_id.split('/')[0]);
//		}
//		console.log('jid === ' + data.email_id + ' status === ' + data.status);
//		
//		if(data.status == "offline" && data.email_id == com.user.email_id)
//		{
//			com.xmpp.connection.send($pres());
//		}
//	};
//	//查找好友(添加好友前的查找功能)结果的回调函数，显示在某个服务器上查询好友的结果，返回值是一个由Object组成的数组
//	//其中Object包括email_id，name，jid和email四个属性，其中email_id和name为主要属性
//	com.xmpp.onSearchFriendResult = function(friendList){
//		if(friendList.length > 0 ){
//			for(var i=0; i<friendList.length; i++){
//				var userid=friendList[i].email_id;
//				var username=userid.split("@","1");
//				var li_1="<li onclick=\"getfriendname('"+userid+"')\"><a href=\"\">"+username+"</a></li>";
//				$("#bb").append(li_1);	
//			}
//			}else{
//				$("#bb").html('没有匹配的用户，请重新查询');
//					
//			}
//			$("#img2").hide();
//		
//			$("#bb").listview('refresh'); 
//			
//		//手机版搜索好友回调显示//////房间搜索也是这个回调函数但是需要改动显示在cc下面啊！	
//	}
//	//有好友email_id想订阅你的状态，需要弹框等待用户确定
//	com.xmpp.onPresenceSubscribe = function(email_id){
//		var username=email_id.split("@","1");
//		if(window.confirm(username+"请求添加您为好友")){
//	        //alert("确定");
//			acceptApplyFriend(email_id);
//	     }else{
//	        //alert("取消");
//	    	 refuseApplyFriend(email_id);
//	     }
//	}
//	com.xmpp.onPresenceUnsubscribe = function (email_id){
//		console.log(email_id);
//		var username=email_id;
//		console.log("aaa");
//		var deleteone =$(document.getElementById("CallPage"+username));
//		if(deleteone.length>0){
//			console.log("bbb");
//			var deleteli = $(document.getElementById(username)).parent().parent().parent();
//			deleteli.remove();
//	        $('#e1').page();
//			
//			$('#aa').listview('refresh');  
//			deleteone.remove();
//			console.log("ccc");
//		}
//		alert(email_id+'已经和您解除好友关系');
//	}
//	com.xmpp.onAddFriendSucceed = function(email_id){
//		//var username=email_id.split("@","1");
//		//fillTipBox('success','添加好友'+username+"成功");
//	//	var li_2="<li onclick=\"getname('"+email_id+"')\" data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-theme=\"c\" class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-corner-top ui-btn-up-c\"><div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\"><a href=\"h1.html\" class=\"ui-link-inherit\">"+username+"</a></div><span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\"></span></div><input type=\"hidden\" id=\"hide\" value=\"\"></li>";  	
//    //    $("#aa").append(li_2);
//    //    $("#aa").listview('refresh'); 
////        console.log("add friend!!!!");
////        var username=email_id;
////    	if($(document.getElementById("CallPage"+username)).length==0){
////			
////			var li_1="<li onclick=\"getname('"+username+"')\"><a id='"+username+"' href='" + '#CallPage' + username + "'>"+username+"</a></li>";
////			var objListView = document.getElementById("aa");
//////			objListView.innerHTML = "";    //清空ListView原本的内容
////			$("#aa").append(li_1);
////			
////			$('#e1').page();
////			
////			$('#aa').listview('refresh');  
////			
////			
////	    	 createCallJSP(username);
////	    	 alert("添加好友成功！");
////			}
////    	else
////    	{
////    		//alert("你们已经是好友了！");
////    		}
//	}
//	com.xmpp.onPresenceDenySubscribe = function(email_id){
//		fillTipBox('success',email_id+'拒绝了你的好友申请');
//	
//	}
//	//手机端收到好友消息
//	com.xmpp.onChatMessage = function(data) {
//		console.log("onChatMessage...");
//	
//		var email_id=data.email_id;
//	
//		var $NAME = $(document.getElementById('contentmessage'+ email_id));
//		$NAME.append('<div class=\'leftalign blueletter strong padding5\'>' + email_id+ '</div>');
//		$NAME.append('<div class=\'lefttalign padding5\'>' + data.message + '</div>');
//		console.log('Receive message from ' + data.email_id + ': ' + data.message);
//		
//		var $MESSAGE = $(document.getElementById('contentmessage'+ email_id));
//		var $VIDEO = $(document.getElementById('contentvideo'+ email_id));
//		$MESSAGE.show();
//		$VIDEO.hide();
//		console.log("change message and video inferface");
//	
//		
//		var $username = $(document.getElementById(email_id));
//
//		$username.click();
//		
//	};
//	
//	
//	
//	//手机端收到群聊消息的回调函数
//
//	com.xmpp.onRoomChatMessage = function(data){  
//	   	
//		
//		var myemail = $('.pub_banner').attr("user");
//		var	namechange = myemail.replace('@', '9');
//		var	namechanged = namechange.replace('.','0');
//		if ( myemail === data.nickname ){
//			$('#name'+namechanged).remove();
//			$('#sending'+namechanged).remove();
//			$("#c2").append('<div class=\'leftalign strong blueletter padding5\'>' + data.nickname + '</div>');
//			$("#c2").append('<div class=\'leftalign padding5\'>' + data.roomMessage + '</div>');
//		}else{
//			$("#c2").append('<div class=\'rightalign strong blueletter padding5\'>' + data.nickname + '</div>');
//		    $("#c2").append('<div class=\'rightalign padding5\'>' + data.roomMessage + '</div>');
//		    console.log('Receive message from ' + data.nickname + ': ' + data.roomMessage);
//
//		}
//	};
//	
//	//连接成功
//	com.xmpp.onConnected = function() {		
//		var username = $('.pub_banner').attr("user");
//		console.log('Connected');
//		VIDEO_URL = com.xmpp.getWebSocketUrl();
//		if(com.webrtc.getMediaSupport() == true){
//          console.log("flag test");
//			$("#browersupport").val("true");
//			//连接webrtc视频---------------------
//			//webrtc设置本地用户名
//			com.webrtc.setLocalUserID(formatChange(username));
//			//webrtc视频创建连接
//			com.webrtc.connect(VIDEO_URL);
//		}else{
//			var  tipContent = "您的浏览器不支持音视频通话，请更换chrome_dev浏览器！";
//			fillTipBox('error',tipContent);
//			$("#browersupport").val("false");
//		}
//	};
//	
//	//连接失败
//	com.xmpp.onConnectFail = function() {
//		console.log('Connect failed');
//	};
//	
//	//连接鉴权失败
//	com.xmpp.onConnectAuthFail = function() {
//		console.log('Auth failed because your JID or Password is wrong');
//	};
//	
//	//断开连接
//	com.xmpp.onDisconnected = function() {
//	//	logout();
//		console.log('xmpp disconnected!!!!!!!!!!!!!!!!!!!!!');
//		if(LOGOUT_FLAG == true)
//		{
//			logout1();
//		}
//		else
//		{
//			var username = $('.pub_banner').attr("user");
//			var oauthToken = $('.pub_banner').attr("userid");
//			com.xmpp.initialize(username, oauthToken);
//		}
//	};
	
//	//从顶栏拿到userEmail，然后连接IM
//	$('#myfriendgb').click(function(){showFriendListFn();});
//	$('#addlistgb').click(function(){ShowAddListOnRoster();});
//	
//	$('#myroomgb').click(function(){ShowRoomListOnAddr();});

	var username = $('.pub_banner').attr("user");
	console.log(username);
	VIDEO_URL = com.websockets[0];
	console.log(VIDEO_URL);
	if(com.webrtc.getMediaSupport() == true){
		loginwebrtc();
	}else{
		//不支持webrtc API
	}
	
	//连接环信
	//手机端连接  immobile.js 中 connectToEase
	connectToEase();
});

//开始视频通话的方法
function beginVideo(remoteUserNameOriginal, remoteUserId){
 var remoteUserName = formatChange(remoteUserNameOriginal);

   console.log(remoteUserNameOriginal+'      '+remoteUserName);


	if(com.webrtc.gRemoteUserID == null){
		var localUserName = $('.pub_banner').attr("user"), localUserId = $('.pub_banner').attr("userId");
		var remoteMedia = 'video' + remoteUserId, localMedia = 'video' + localUserId + '_' + remoteUserId;
		var operationId = 'operation' + localUserId + '_' + remoteUserId;
		$('#'+operationId+' .video').removeClass('hidden').attr('src', 'images/videoing.png');
		$('#'+operationId+' .audio').addClass('hidden');
		$('#'+operationId+' .hang').removeClass('hidden');
		$('#'+remoteUserId).dblclick();
		com.webrtc.setMediaDisplayLabel(localMedia, remoteMedia);
		com.webrtc.setRemoteUserID(remoteUserName);
		var tipContent = "向"+remoteUserName+"发起呼叫...";
		fillTipBox('success',tipContent);
		
		
		com.webrtc.call("video");
	}else{
		alert('同时只能发起一个多媒体会话！');
	}
}

//开始音频通话的方法
function beginAudio(remoteUserName, remoteUserId){
	var remoteUserName = formatChange(remoteUserNameOriginal);	
	if(com.webrtc.gRemoteUserID == null){
		var localUserName = $('.pub_banner').attr("user"), localUserId = $('.pub_banner').attr("userId");
		var remoteMedia = 'video' + remoteUserId, localMedia = 'video' + localUserId;
		var operationId = 'operation' + localUserId + '_' + remoteUserId;
		$('#'+operationId+' .audio').removeClass('hidden').attr('src', 'images/audioing.png');
		$('#'+operationId+' .video').addClass('hidden');
		$('#'+operationId+' .hang').removeClass('hidden');
		$('#'+remoteUserId).dblclick();
		com.webrtc.setMediaDisplayLabel(localMedia, remoteMedia);
		com.webrtc.setRemoteUserID(remoteUserName);
		var tipContent = "向"+remoteUserName+"发起呼叫...";
		fillTipBox('success',tipContent);
		com.webrtc.call(true, false);
	}else{
		alert('同时只能发起一个多媒体会话！');
	}
}

function endVideo(remoteUserName, remoteUserId){
	if(remoteUserName == com.webrtc.gRemoteUserID){
		$('.video').attr('src','images/video.png');
		$('.audio').attr('src','images/voice.png');
		com.webrtc.hangUp();
		$("#tipbox").tipbox  ({
	        content: '会话已结束',
	        autoclose: true,
	        hasclose: false
		});
	}
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
//点击“我的群组”，分组显示  by chenyan
//存储联系人名字
//function showFriendListOnAddr(){
//	alert('群组列表正在加载中，请在加载成功后再切换到好友列表！');
//}
//
//function ShowAddListOnRoster(){
//	alert('好友列表正在加载中，请在加载成功后再切换到通讯录！');
//}
//
//var roomNameList = [];
//var roomGroupnameList= [];//存储联系人群组名字的数组

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


function showAddListFn(){
	$("#myfriendgb").unbind();
	$('#myfriendgb').click(function(){showFriendListOnAddr();});
	
	$("#myroomgb").unbind();//移除myroomgb的事件
	$('#myroomgb').click(function(){showRoomListRoster();});
	
	//隐藏好友类表的内容
	showFriendFrame('addlist');		
	contactGroupnameList=[];
	$.ajax({
		type:"post",
		url:"platform/getContactlistByGroup",
		data:{},
		dataType:"json",
		success:function(data){
			$("#realcontact").html('');
			console.log(data);
			var j=0;
			var s=0;
			var groupContactlist=data.groupContactlist;
			
			if(groupContactlist.length==0){
				$("#frloading").hide();
				//$("#searchcontact").hide();//隐藏搜索框
				fillTipBox("success","亲，你还没有联系人呢!赶快添加联系人吧！");
				$("#realcontact").html('<div class="redletter bigsize">您还没有联系人，点击下方的图标即可添加联系人!</div>');
			}else{
				//如果只有根组，且为空，提示用户没有联系人.
				if(groupContactlist.length==1&&groupContactlist[0].groupName=="我的联系人"&&groupContactlist[0].groupMembers.length==0){
					$("#frloading").hide();
					//$("#searchcontact").hide();//隐藏搜索框
					fillTipBox("success","亲，你还没有联系人呢!赶快添加联系人吧！");
					var groupName=groupContactlist[0].groupName;
					var groupMember = [];
					
					showContactGroup(groupName, groupMember);//调用
					//$("#friendcontent").append('<div class="redletter bigsize">您还没有联系人，点击下方的图标即可添加联系人!</div>');
				}
				else{
				for(var i=0;i<groupContactlist.length;i++){
					var groupName=groupContactlist[i].groupName;
					//群组名字
					
					contactGroupnameList[s++]=groupContactlist[i].groupName;
					//console.log("the group name: "+groupContactlist[i].groupName);
					var groupMember = [];
						for(var k=0; k<groupContactlist[i].groupMembers.length;k++){
							
							groupMember[k] = {					
									userId:groupContactlist[i].groupMembers[k].friendId,
									userName:groupContactlist[i].groupMembers[k].nickname,
									
									qq:groupContactlist[i].groupMembers[k].qq,
									phone:groupContactlist[i].groupMembers[k].phone,
									email:groupContactlist[i].groupMembers[k].email,
									webrtc:groupContactlist[i].groupMembers[k].webrtc
									};
							//联系人
							contactNameList[j++]={					
									userId:groupContactlist[i].groupMembers[k].friendId,
									userName:groupContactlist[i].groupMembers[k].nickname
							};
							
						}
						showContactGroup(groupName, groupMember);//调用
					}
				console.log("group name:"+contactGroupnameList);//
				}
			}
			showFriendList();
			$('a[rel=facebox]').facebox();
			$('a[rel=facebox]').attr('rel','faceboxready');
			$(".webwidget_vertical_menu_temp").webwidget_vertical_menu();
			$(".webwidget_vertical_menu_temp").removeClass('webwidget_vertical_menu_temp').addClass('webwidget_vertical_menu');
			$('#addContact').removeClass('hidden');
		}
	});
	$("#myfriendgb").unbind();
	$('#myfriendgb').click(function(){showFriendListFn();});
	$("#myroomgb").unbind();
	$('#myroomgb').click(function(){showRoomListFn();});
}

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
		var fUserId = friendList[i].name.split('@')[0].replace('#','_').replace('.','_');
		console.log(fUserId+','+userId);
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

//在father 页面 找到 href 为 child 的 元素，并点击此href
function turnToHref(father,child)
{
	console.log("turn to href");
	console.log("father="+father);
	console.log("child="+child);
	var $test = $(document.getElementById(father));
	
	var $href = $test.find("[href=\""+'#'+child+"\"]");
	$href.click();
		
}




//格式转化，去掉“@”换成“-”，并在后面加“@WebRTC”	
// eg: jxk143@163.com -->  jxk143-163.com@WebRTC
function formatChange(original){
	return original.split("@")[0]+'-'+original.split("@")[1]+"@WebRTC";
}
//格式转换，去掉“@WebRTC”，“-”换成“@”
//// eg: jxk143-163.com@WebRTC -->  jxk143@163.com
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

