(function($)
{
    $(document).ready(function()
    {
		//用户关闭页面时调用，释放资源
		$(window).unload(function()
	    {
	    	
	    });
    });
})(jQuery);

com.interf = {
	login : function(obj){
		var Server = com.websockets[0];
		
		console.log("begin to loginwebrtc");   
		com.webrtc.sigSessionConfig.serverhost = Server;
		com.webrtc.sigSessionConfig.username = obj.Username;
		com.webrtc.sigSessionConfig.token = obj.Token;
		com.webrtc.starting();
		com.webrtc.sigSession.Login();
	    com.webrtc.app.init(obj.onNotify);
	},
	logout : function(){
		com.webrtc.sigSession.Logout();
	},
	call : function(obj){
		//WOTTSession(video/audio)
		if(!obj.isIMSCall && !obj.isMeeting){
			 var newWOTTSession = new com.webrtc.WOTTSession();			 
			 var newSessionBase = new com.webrtc.WUserSessionBase();
			 newWOTTSession.calleeName = obj.gRemoteUserID;
			 newWOTTSession.init(obj.onResponse);
			 
			 $.extend( true, newWOTTSession,newSessionBase);

			 newWOTTSession.setSessionID(obj.sessionID);

			 com.webrtc.app.AddSession(newWOTTSession);
			    
			 var configuration;
			 if(obj.isVideo){			     
				 configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.VIDEO,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
			 }
			 else if(obj.isAudio){
				 configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.AUDIO,true,true,{ "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
			 }
			 com.webrtc.app.usersessionlist[newWOTTSession.SessionID].Call(obj.gRemoteUserID,configuration);
		}
		//IMSSession(IMSVideo/IMSaudio)
		else if(obj.isIMSCall && !obj.isMeeting){
			var newWIMSSession = new com.webrtc.WIMSSession();
			var newSessionBase = new com.webrtc.WUserSessionBase();
			newWIMSSession.calleeName = obj.gRemoteUserID;
		    newWIMSSession.init(obj.onResponse);
		    
		    $.extend( true, newWIMSSession,newSessionBase);

		    newWIMSSession.setSessionID(obj.sessionID);
		    com.webrtc.app.AddSession(newWIMSSession);
		    
		    var configuration;
		    if(obj.isVideo){
		        configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO,true,true, { "urls": "turn:222.200.180.144", "url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
		    }
		    else if(obj.isAudio){
		    	configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO,true,true, {"urls": "turn:222.200.180.144",  "url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
		    }		    
		    com.webrtc.app.usersessionlist[newWIMSSession.SessionID].Call(obj.gRemoteUserID,configuration);
		    
		}
		//MeetingSession(VideoMeeting)
		else if(obj.isMeeting){
			var newWMeetingSession = new com.webrtc.WMeetingSession();
		    var newSessionBase = new com.webrtc.WUserSessionBase();

		    newWMeetingSession.calleeName = obj.gRemoteUserID;
		    newWMeetingSession.init(obj.onResponse);

		    $.extend( true, newWMeetingSession,newSessionBase);
		    newWMeetingSession.setSessionID(obj.sessionID);
		    com.webrtc.app.AddSession(newWMeetingSession);

		    //var configuration = new Conf(com.webrtc.UserSession.TYPE.MEETING,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING ,true,true, {"urls" : "stun:23.21.150.121","url" : "stun:23.21.150.121"},false);
		    var configuration = new Conf(com.webrtc.UserSession.TYPE.MEETING,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING ,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
		    
		    com.webrtc.app.usersessionlist[newWMeetingSession.SessionID].Call(obj.gRemoteUserID,configuration);
		}
	
	},
	hangup: function(obj){
		if(true == com.webrtc.app.isExistSession(obj.sessionID))
	    {
	    	//WOTTSession(video/audio)
	    	if(!obj.isIMSCall && !obj.isMeeting){
			    if(obj.isVideo)
				    com.webrtc.app.usersessionlist[obj.sessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.VIDEO);
			    else if(obj.isAudio)
				    com.webrtc.app.usersessionlist[obj.sessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.AUDIO);
			}
			//IMSSession(IMSvideo/IMSaudio)
			else if(obj.isIMSCall && !obj.isMeeting){
				if(obj.isVideo)
				    com.webrtc.app.usersessionlist[obj.essionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO);
			    else if(obj.isAudio)
				    com.webrtc.app.usersessionlist[obj.sessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO);
			}
			//MeetingVideo(VideoMeeting)
			else if(obj.isMeeting){
				com.webrtc.app.usersessionlist[obj.sessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING);
			}
	    }
	    else
	    {
	        console.log("UserSession do not exist!");
	    }

	},
	sendFile: function(obj){
		if(true == com.webrtc.app.isExistSession(obj.sessionID) 
			   && true == com.webrtc.app.usersessionlist[obj.sessionID].isExistModule(obj.sessionID))
		{   
			console.log("begin to sendFiles");
			com.webrtc.file.sendFiles(obj.gRemoteUserID,obj.sessionID);
			return;
		}

	    var newWOTTSession = new com.webrtc.WOTTSession();
		var newSessionBase = new com.webrtc.WUserSessionBase();

 	    newWOTTSession.calleeName = obj.gRemoteUserID;
		newWOTTSession.init(obj.onResponse);

		$.extend( true, newWOTTSession,newSessionBase);
		newWOTTSession.setSessionID(obj.sessionID);
		com.webrtc.app.AddSession(newWOTTSession);

		//var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE,true,true, {"urls" : "stun:23.21.150.121","url" : "stun:23.21.150.121"},true);
		var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE,true,true,{ "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},true);
			    
			    
		com.webrtc.app.usersessionlist[newWOTTSession.SessionID].Call(obj.gRemoteUserID,configuration);
	},
	hangupFile: function(obj){
		if(true == com.webrtc.app.isExistSession(obj.sessionID))
		{
			com.webrtc.app.usersessionlist[SessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.FILE);
		}
		else
		{
		    console.log("UserSession do not exist!");
		}
	}
	
};

var OnLoginSuccess = function(){
    console.log("user login success!");
    var contents = "user login success! 用户登录成功";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents});
    //alert("user login success!");
    //checkIfStartArtiTimer();
};

var OnLoginFail = function(){
    console.log("user login fail!");
    var contents = "user login fail! 服务器已断开连接";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents});
};

var OnLogoutFinish = function(){
    console.log("user logout finish");
      var contents = "user logout finish 可能在别处登录";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents});
};

//登录
var loginwebrtc = function(){
	
	var username = formatChange($('.pub_banner').attr("user"));
	var token =	$('.pub_banner').attr("thirdpartytoken");

    var obj = {
    	Username: username,
    	Token: token,
    	onNotify: onNotify,
    	onLoginSuccess: OnLoginSuccess,
    	onLoginFail: OnLoginFail
    };
    com.interf.login(obj);
    
    console.log("end to loginwebrtc");
};
//登出
var logoutwebrtc = function(){
	var obj = {
		onLogoutFinish: OnLogoutFinish
	};
	com.interf.logout();

};


var deleteSelectedLabel = function(RemoteID,sessionType,moduleType){
    var gRemoteUserID = RemoteID;
    //var gLocaleUserID=com.webrtc.sigSessionConfig.username;
    
    var friendname = WCSToEase(RemoteID);
    console.log(moduleType);
    if(moduleType=="video"){
    	console.log("deleteSelected Video Label");

    	setActiveFlag(CallVideoPrefix+friendname,"NO");
        
    	var normal_friendname=formatReEase(friendname);    	
    	closeContactVideoDivList(normal_friendname);
    	
    }
    if(moduleType=="audio"){
    	console.log("deleteSelected Audio Label");

    	setActiveFlag(CallAudioPrefix+friendname,"NO");
    	
    	var normal_friendname=formatReEase(friendname);
    	closeContactAudioDivList(normal_friendname);

    }
    if(moduleType=="videomeeting"){
    	closeVideoMeetingDiv(gRemoteUserID);
    	console.log("关闭视频会议界面");
    }
    if(moduleType=="audiomeeting"){
    	closeAudioMeetingDiv(gRemoteUserID);
    }
    else if(moduleType=="imsvideo"){
    	closeIMSVideoDiv(gRemoteUserID);
    	console.log("关闭IMS视频界面");
    }
    else if(moduleType=="imsaudio"){
    	closeIMSAudioDiv(gRemoteUserID);
    	console.log("关闭IMS音频界面");
    }
};

//发起音视频通话
var Callvideo = function(gRemoteUserID,SessionID)
{
    var obj = {
    	gRemoteUserID: gRemoteUserID,
    	sessionID: SessionID,
    	isAudio: false,
    	isVideo: true,
    	isIMSCall: false,
    	isMeeting: false,
    	onResponse: onResponse
    };
    com.interf.call(obj);
};

var Callaudio = function(gRemoteUserID,SessionID)
{
	var obj = {
	    gRemoteUserID: gRemoteUserID,
	    sessionID: SessionID,
	    isAudio: true,
	    isVideo: false,
	    isIMSCall: false,
	    isMeeting: false,
	    onResponse: onResponse
	};
	com.interf.call(obj);
};

var CallIMSvideo = function(gRemoteUserID,SessionID)
{
	var obj = {
	    gRemoteUserID: gRemoteUserID,
	    sessionID: SessionID,
	    isAudio: false,
	    isVideo: true,
	    isIMSCall: true,
	    isMeeting: false,
	    onResponse: onResponse
	};
	com.interf.call(obj);
};

var CallIMSaudio = function(gRemoteUserID,SessionID)
{
	var obj = {
		gRemoteUserID: gRemoteUserID,
		sessionID: SessionID,
		isAudio: true,
		isVideo: false,
		isIMSCall: true,
		isMeeting: false,
		onResponse: onResponse
	};
	com.interf.call(obj);
    
};


var CallMeetingVideo = function(roomId,SessionID){
	console.log("CallMeetingVideo-------roomId"+roomId+"SessionID"+SessionID);
	var obj = {
		gRemoteUserID: roomId,
		sessionID: SessionID,
		isAudio: false,
		isVideo: false,
		isIMSCall: false,
		isMeeting: true,
		onResponse: onResponse
	};
	com.interf.call(obj);
	
   
};

//挂断音视频通话
var HangUpvideo = function(gRemoteUserID,SessionID)
{
	var obj = {
		gRemoteUserID: gRemoteUserID,
		sessionID: SessionID,
		isAudio: false,
		isVideo: true,
		isIMSCall: false,
		isMeeting: false
	};
	com.interf.hangup(obj);
    
};

var HangUpaudio = function(gRemoteUserID,SessionID)
{
	var obj = {
		gRemoteUserID: gRemoteUserID,
		sessionID: SessionID,
		isAudio: true,
		isVideo: false,
		isIMSCall: false,
		isMeeting: false
	};
	com.interf.hangup(obj);
};

var HangUpIMSvideo = function(gRemoteUserID,SessionID)
{
	var obj = {
		gRemoteUserID: gRemoteUserID,
		sessionID: SessionID,
		isAudio: false,
		isVideo: true,
		isIMSCall: true,
		isMeeting: false
	};
	com.interf.hangup(obj);
};

var HangUpIMSaudio = function(gRemoteUserID,SessionID)
{
	var obj = {
		gRemoteUserID: gRemoteUserID,
		sessionID: SessionID,
		isAudio: true,
		isVideo: false,
		isIMSCall: true,
		isMeeting: false
	};
	com.interf.hangup(obj);
};


var HangUpMeetingvideo = function(gRemoteUserID,SessionID)
{
	var obj = {
		gRemoteUserID: gRemoteUserID,
		sessionID: SessionID,
		isAudio: false,
		isVideo: false,
		isIMSCall: false,
		isMeeting: true
	};
	com.interf.hangup(obj);
};

//SendFileRequestBefore 调用，请求被叫允许打开数据通道，对方同意后会传输文件（与Callvideo）
var SendFileRequest = function(gRemoteUserID,SessionID)
{
    
    var obj = {
    	gRemoteUserID: gRemoteUserID,
    	sessionID: SessionID,
    	onResponse: onResponse
    };
    com.interf.sendFile(obj);

};



var HangUpfile = function(gRemoteUserID,SessionID)
{
	com.interf.hangupFile({
		gRemoteUserID: gRemoteUserID,
		sessionID: SessionID
	});
};




var onNotify = function(message)
{
    console.log("onNotify!!!");
    var msg = JSON.parse(message.data);
    var SessionID = msg.sessionID;
    var remoteID = msg.from;


    //console.log(SessionID);
    console.log(remoteID);

    if(typeof sessionID == 'undefined'){
        SessionID = msg.roap.offerSessionId;
    }

    console.log(SessionID);
    console.log("msg.roap.type="+msg.roap.type);

    if(msg.roap.type === com.webrtc.protocol.RTCRoapType['offer']){
        console.log("is offer");
       
        if(false == com.webrtc.app.isExistSession(SessionID)){
            

            var SessionType = msg.sessionType;
            var ModuleType = msg.moduleType;

            console.log(SessionType);
            console.log(ModuleType);

            //如果没有SessionType，可根据 RemoteID的后缀来判断
            if(typeof SessionType == 'undefined'){
                SessionType = setSessionType(remoteID);
            }
            //如果没有ModuleType，可根据sdp消息来判断
            if(typeof ModuleType == 'undefined'){
                var sdpString = new String(JSON.stringify(msg.roap.sdp)+ " ");
                ModuleType = setModuleType(sdpString);
            }

            console.log(SessionType);
            console.log(ModuleType);
            




            var newUserSession = null;


            if(SessionType == com.webrtc.UserSession.TYPE.P2P && ModuleType == com.webrtc.UserSession.MODULE_TYPE.VIDEO)
            {
                    console.log("Receive Video!");
                    
                    //此处先确保生成某个人的info页面，再确保生成某个人的视频通话界面
                    var friendname = WCSToEase(remoteID);
                    var normalfriendname = formatReEase(friendname);
           
                    createCallVideoPage(normalfriendname,SessionID);
                    console.log("create videolabel finish!");
                    setActiveFlag(CallVideoPrefix+normalfriendname,"YES");

                    newUserSession = new com.webrtc.WOTTSession(); 
            }
            else if(SessionType == com.webrtc.UserSession.TYPE.P2P && ModuleType == com.webrtc.UserSession.MODULE_TYPE.AUDIO)
            {

            	 console.log("begin to create audiolabel!");
                 
                 //此处先确保生成某个人的info页面，再确保生成某个人的音频通话界面
                 var friendname = WCSToEase(remoteID);
                 var normalfriendname = formatReEase(friendname);
        
                 createCallAudioPage(normalfriendname,SessionID);
                 console.log("create audiolabel finish!");
                 setActiveFlag(CallVideoPrefix+normalfriendname,"YES");

                 newUserSession = new com.webrtc.WOTTSession(); 

            }
            else if(SessionType == com.webrtc.UserSession.TYPE.P2P && ModuleType == com.webrtc.UserSession.MODULE_TYPE.FILE)
            {
                    console.log("begin to create filelabel!");
                    newUserSession = new com.webrtc.WOTTSession();
            }  
            else if(SessionType == com.webrtc.UserSession.TYPE.IMS && ModuleType == com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO)
            {
                    createIMSVideoLabel(remoteID,SessionType,ModuleType,SessionID);
                    newUserSession = new com.webrtc.WIMSSession();
            }
            else if(SessionType == com.webrtc.UserSession.TYPE.IMS && ModuleType == com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO)
            {
                    createIMSAudioLabel(remoteID,SessionType,ModuleType,SessionID);
                    newUserSession = new com.webrtc.WIMSSession();
            }
            else{
                console.log("other sessiontype :" + SessionType + "or other moduletype :" + ModuleType);
            }

            var newSessionBase = new com.webrtc.WUserSessionBase();

            newUserSession.calleeName = remoteID;
            newUserSession.init(onResponse);

            $.extend( true, newUserSession,newSessionBase);

            newUserSession.setSessionID(SessionID);

            console.log("set usersession to sessionlist");
            com.webrtc.app.AddSession(newUserSession);
        }
    }

    if(true == com.webrtc.app.isExistSession(SessionID)){
        com.webrtc.app.usersessionlist[SessionID].HandleMessage(message);
    }
    else{
        console.log("abandon");
        console.log(message);
    }    
};

///如果没有sessionType，可根据remoteID的后缀来判断SessionType
var setSessionType=function(RemoteID){
    console.log("begin to set SessionType");
    //后缀为"@gd.ctcims.com"
    if(RemoteID.indexOf(com.webrtc.DOMAIN.IMSGZDX)>=0){
        console.log("it is GZDX ims");
        return com.webrtc.UserSession.TYPE.IMS;
    }
    //后缀为"@open-ims.com"
    else if(RemoteID.indexOf(com.webrtc.DOMAIN.IMSBUPT)>=0){
        console.log("it is BUPT ims");
        return com.webrtc.UserSession.TYPE.IMS;
    }
    else{
        console.log("can not set SessionType for RemoteID:"+RemoteID);
        return null;
    }
};

///如果Roap中没有moduleType，可根据sdp中的信息得到moduleType
var setModuleType = function(sdpString)
{  
    console.log("begin to set ModuleType");

    if(sdpString.indexOf("video") != -1)        
    {
        console.log("it is video");
        return com.webrtc.UserSession.MODULE_TYPE.VIDEO;
    }       
    else if(sdpString.indexOf("audio") != -1) 
    {
        console.log("it is audio");
        return com.webrtc.UserSession.MODULE_TYPE.AUDIO;
    }
    else
    {
        console.log("can not set ModuleType for sdpSting:"+sdpString);
        return null;         
    }
};

var onResponse = function(remoteID,sessionType,moduleType,sessionID){

        console.log(remoteID+sessionType+moduleType);
        var str = null;
        var type = null;
        if (moduleType == "video")
        {
            str = "视频通话";
        }
        else if (moduleType == "audio")
        {
            str = "音频通话";
        }
        else if(moduleType == "file")
        {
           str ="文件传输";
        }
        else if (moduleType == "audiomeeting")
        {
            str = "会议音频通话";
        }
         else if (moduleType == "videomeeting")
        {
            str = "会议视频通话";
        }       
        else if (moduleType == "imsaudio")
        {
            str = "IMS音频通话";
        }
         else if (moduleType == "imsvideo")
        {
            str = "IMS视频通话";
        }




        if(sessionType == "P2P")
        {
            type="P2P";
        }
        else if(sessionType == "IMS")
        {
            type="IMS";
        }
        else if(sessionType == "MEETING")
        {
            type="MEETING";
        }

        var content = "同意来自" + remoteID + "的" + "类型为"+type+"的"+str + "请求？";

    $.tipModal('confirm', 'warning', content, 
        function(result) {
        console.log('warning callback: ' + result);
        if(result == false){ //拒绝
            if(com.webrtc.app.usersessionlist[sessionID] != null && com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID] !=null)
            {   
                com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID].setupRefuse();
                com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID]=null;
            
                com.webrtc.DeleteUserSession(sessionID);
            }
        }
        else{  //同意
            if(com.webrtc.app.usersessionlist[sessionID] != null && com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID] !=null)
            {
                com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID].setupAccept();
            }
        }
    }
    );
};