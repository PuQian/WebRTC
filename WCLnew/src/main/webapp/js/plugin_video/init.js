if(typeof com == "undefined"){
    com = {};
}



com.webrtc = {
	app : null ,
	sigSession : null ,
	
	starting : function(){

		if(this.app == null){
			this.app = new com.webrtc.WAppBase();
		}

		if(this.sigSession == null){
			this.sigSession = new com.webrtc.WSigSessionBase();


    		$(this.sigSession).bind(com.webrtc.SigSessionEvents.LoginSuccess,OnLoginSuccess);
    		$(this.sigSession).bind(com.webrtc.SigSessionEvents.LoginFail,OnLoginFail);
   			$(this.sigSession).bind(com.webrtc.SigSessionEvents.LogoutFinish,OnLogoutFinish);
		}


	},

	DeleteUserSession:function(SessionID){

		com.webrtc.app.RemoveSession(SessionID);
	},
	
	getMediaSupport : function(){
		if(typeof navigator.webkitGetUserMedia == 'undefined' && (typeof navigator.mozGetUserMedia == 'undefined' || typeof mozRTCPeerConnection == 'undefined')){
			return false;
		} else{
			return true;
		}
	},
	//发送文件前端显示调用函数
	sendingfile:function(FileName,pre,iter,allchunkIDslength,RemoteID,SessionID){
		console.log(FileName+ " " + pre+ " " +iter+ " " +allchunkIDslength);
		//更新发送文件进度条
        SendUpdateProgressbar(FileName,pre,iter,allchunkIDslength,RemoteID);
	},
	//接受文件前端显示调用函数
	receivingfile:function(FileName,numOfVerifiedChunks,numOfChunks,RemoteID,SessionID)
	{
		console.log(FileName+ " " +numOfVerifiedChunks+ " " +numOfChunks);
		if(numOfVerifiedChunks == 1){
		    //新建文件传输对话框
		    showFileWindow(RemoteID);
		    //向文件传输对话框添加文件名及进度条
		    addReceivePerFile(FileName,RemoteID);
		}
		//更新接收文件进度条
		ReceiveUpdateProgressbar(FileName,numOfVerifiedChunks,numOfChunks,RemoteID);
	},
	//发送完毕前端显示调用函数
	sendfilefinish:function(FileName,RemoteID,SessionID)
	{
		console.log(FileName+ " send finish!");
		removeFile(FileName,RemoteID);
		//发送方发送完毕后拆除连接
		//HangUpfile(RemoteID,SessionID);
  
	},
	//接受完毕前端显示调用函数
	receivefilefinish:function(FileName,RemoteID,SessionID)
	{
		console.log(FileName+ " receive finish!");
		console.log(RemoteID+SessionID);
		removeFile(FileName,RemoteID);
	},
	
	//收到对端拒绝接受文件
	cancelsending: function(FileName,RemoteID,SessionID){
		console.log(FileName+ " do not need to send");
		console.log(RemoteID+SessionID);

		//前端提示用户
		contents = formatRechange(RemoteID)+"拒绝接收文件"+FileName;
		$.fillTipBox({type:'danger', icon:'glyphicon-alert', content:contents});
		
		//删除该文件
		removeFile (FileName,RemoteID);
//  	    //清空文件浏览器缓存
//  	    com.webrtc.file.deleteFiles();
	},


	//关闭显示界面调用函数
	recoverInterface:function(RemoteUserID,SessionType,ModuleType,SessionID){
		console.log("begin to delete interface");
		deleteSelectedLabel(RemoteUserID,SessionType,ModuleType);
	},

	//错误信息界面调用函数
	onCallFailed :function(RemoteUserID,errCode,SessionType,ModuleType){
		/* 1 ：对端拒绝请求；
           2 ：对端不在线；
           3 ：请求超时（现在设的是120s，如果对方没有接受请求会触发超时）；
           7 ：其他错误；
         */
		var contents = null;
		if(errCode == this.Session.SESSION_ERROR["refused"]){
			
			contents = "ERROR! "+RemoteUserID+" "+SessionType+" "+ModuleType+'对端拒绝请求';
			console.log("User refused!");
		} else if(errCode == this.Session.SESSION_ERROR["offline"]){
			contents = "ERROR! "+RemoteUserID+" "+SessionType+" "+ModuleType+'对端不在线';
			console.log("User offline!");
		} else if(errCode == this.Session.SESSION_ERROR["timeout"]){
			contents ="ERROR! "+RemoteUserID+" "+SessionType+" "+ModuleType+'请求超时';
			console.log("Session timeout!");
		} else if(errCode == this.Session.SESSION_ERROR["other"]){
			contents = "ERROR! "+RemoteUserID+" "+SessionType+" "+ModuleType+'其他错误';
			console.log("Other error:");
			console.log(errCode);
		}
		$.fillTipBox({type:'danger', icon:'glyphicon-alert', content:contents});
	},

	onCallActive:function(remoteID,sessionType,moduleType,sessionID){
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
        else if(moduleType == "audiomeeting")
        {
           str ="会议音频通话";
        }
         else if(moduleType == "videomeeting")
        {
           str ="会议视频通话";
        }
         else if(moduleType == "imsaudio")
        {
           str ="IMS音频通话";
        }
         else if(moduleType == "imsvideo")
        {
           str ="IMS视频通话";
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
        else{

        }

        var contents = "与" + remoteID + "的" + "类型为"+type+"的"+str + "正在进行中";
		
		$.fillTipBox({type:'success', icon:'glyphicon-ok-sign', content:contents});
	}



	

}