//创建会议群聊
var createMeetingGroup = function(roomID){
	var chatgroupname = roomID;
	var chatgroupdesc = "WebRTCMeeting";
	var chatgroupmax = Number(10); 
	
	var chatgroupapproval=true;
	var chatgrouppub = false;
	console.log("群主:"+curUserId);
	console.log("群名："+roomID);
	var chatgroupowner = curUserId;
	//发送加入群组请求
	$.ajax({  
    	url : WEBIM_URL+"/creategroup",  
    	async: true,  
    	type : "get",
    	dataType : "jsonp",
    	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
    	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
    	data : {
    		'chatgroupname':chatgroupname,
			'userid' :chatgroupowner,
			'desc':chatgroupdesc,
			'approval':chatgroupapproval,
			'pub':chatgrouppub,
			'max':chatgroupmax
    	},  
    	success : function(json) {
    	    var contents = json[0].msg;
    	    console.log(contents);
    	}  
    });
};

//根据会议群组名称搜索群组ID号（群组名称可以重复，但群组ID号唯一）
var startSearchMeetingGroup = function(roomID) {
	$.ajax({  
    	url : WEBIM_URL+"/searchgroup",  
    	async: true,  
    	type : "get",
    	dataType : "jsonp",
    	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
    	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
    	data : {'chatgroupname': roomID
    	},  
    	success : function(json) {  
    		var contents = json[0].content;
    		console.log(contents);
    		//同样群名称的群组可能有很多（会议群组只会有一个）
    		//如果存在该群组
    		if(contents){	
                console.log(contents[0]);
                //取一个群组名称的群组
    			var MeetingGroupId = contents[0].groupid;
    			console.log("搜索到的会议群号："+MeetingGroupId);
    			//添加隐藏群组Id
    			if($("body").children("input[class='"+ roomID +"']")){
    				$("body").children("input[class='"+ roomID +"']").remove();
    			}
    			var GroupMeetingId = $("<input type=\"hidden\" class = \""+ roomID +"\" "+
 			    "value=\"\">");
 	            $("body").append(GroupMeetingId);
    			$("input[class='"+ roomID +"']").val(MeetingGroupId);
    		}
    		else{
    			console.log("不存在该群组名称！");
    		}
    	}
    });
}; 

//根据会议Id号搜索群组名称
var startSearchMeetingGroupName = function(message,GroupId) {
	$.ajax({  
    	url : WEBIM_URL+"/searchgroupname",  
    	async: true,  
    	type : "get",
    	dataType : "jsonp",
    	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
    	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
    	data : {'chatgroupid': GroupId
    	},  
    	success : function(json) {  
    		var contents = json[0].content;
    		//同样群名称的群组可能有很多（会议群组只会有一个）
    		//如果存在该群组
    		if(contents){	
                console.log(contents[0]);
                //取一个群组名称的群组
    			var MeetingGroupName = contents[0].groupname;
    			console.log("搜索到的会议名称："+MeetingGroupName);
    			/////添加隐藏会议群组名称
    			if($("body").children("input[class='"+ GroupId+"']")){
    				$("body").children("input[class='"+ GroupId+"']").remove();
    			}
    			var $GroupMeetingName = $("<input type=\"hidden\" class = \""+ GroupId +"\" "+
 			    "value=\"\">");
 	            $("body").append($GroupMeetingName);
    			$("input[class='"+GroupId+"']").val(MeetingGroupName);
    			//回调impc.js消息处理函数
    			handleTextMessageCallBack(message);
    		}
    		else{
    			console.log("不存在该群组Id");
    		}
    	}
    });
}; 

//加入群组（多次加入和多次删除效果一样）
var startAddMeetingGroup = function(MeetingGroupId) {
	console.log("加入群组，群成员："+curUserId);
	$.ajax({  
    	url : WEBIM_URL+"/addgroup",  
    	async: true,  
    	type : "get",
    	dataType : "jsonp",
    	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
    	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
    	data : {'chatgroupname': MeetingGroupId,
    		    'userid': curUserId
    	},  
    	success : function(json) {
    	   var contents = json[0].msg;
    	   console.log(contents);
    	}
     
    });
};

//发送消息（roomid为会议名称）
var sendMeetingText = function(roomid) {
	//获取textarea要发送的内容
	var $msgInput=$(document.getElementById(roomid+"message"));
	var msg = $msgInput.val();
    
	//获取会议群Id
	var MeetingGroupId = $("input[class='"+ roomid +"']").val();
	console.log(MeetingGroupId);
	
	if (msg == null || msg.length == 0) {
		return;
	}

	var options = {
		to : MeetingGroupId,
		msg : msg,
		type : "groupchat"
	};
	
	console.log("options.to="+options.to);

	conn.sendTextMessage(options);

	//"我"发送的信息 原样显示
	appendMyMeetingContent(roomid,msg);
	//清空textarea
    $(document.getElementById(roomid+"message")).val("");
};

//原样显示我发送的信息
var appendMyMeetingContent = function(roomid,msg){
	//获取显示消息UL
	var MeetingContentUl =$(document.getElementById(roomid+"meetingContent"));
	//添加"我"发的消息
	var MyContentLi = $("<li><h3>我</h3><p>"+ msg +"</p></li>");
	MeetingContentUl.append(MyContentLi);
	//滚动条属于ul的父元素
	MeetingContentUl.parent().scrollTop(MeetingContentUl[0].scrollHeight); //滑动条置底
};

//显示群组其他成员的信息
var appendOtherMeetingContent = function(roomid,from,msg){
	var MeetingContentUl = $(document.getElementById(roomid +"meetingContent"));
	var MeetingContentLi = $("<li><h3 class='you_name'>"+ formatReEase(from) +"</h3>"+
			"<p>"+ msg +"</p></li>");
	MeetingContentUl.append(MeetingContentLi);
	//滚动条属于ul的父元素
	MeetingContentUl.parent().scrollTop(MeetingContentUl[0].scrollHeight); //滑动条置底
};

//会议成员退出会议（退群或解散）
var HangUpMeetingvideoGroup = function(roomID,SessionID){
	
	var MeetingGroupId = $("input[class='"+ roomID +"']").val();
	//查询群主
	searchMeetingGroupOwner(roomID,SessionID,MeetingGroupId);
};

//查询群主
var searchMeetingGroupOwner = function(roomID,SessionID,MeetingGroupId) {
	$.ajax({  
    	url : WEBIM_URL+"/searchgroupowner",  
    	async: true,  
    	type : "get",
    	dataType : "jsonp",
    	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
    	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
    	data : {'chatgroupid': MeetingGroupId,
    	},  
    	success : function(json) {
    	    var owner = (json[0].owner).substr(18);
    	    console.log("查询会议群主："+owner);
    	    if(owner == curUserId){  //解散会议
    	    	startDestroyMeetingGroup(MeetingGroupId);
    	    }
    	    else{  //退出会议
    	    	startDelMeetingGroup(MeetingGroupId);
    	    }
    		//挂断会议
    		HangUpMeetingvideo(roomID,SessionID);
    	}     
    });
};

//退出群组（会议成员）
var startDelMeetingGroup = function(MeetingGroupId) {
	console.log("退出群组，群成员："+curUserId);
	$.ajax({  
    	url : WEBIM_URL+"/delgroup",  
    	async: true,  
    	type : "get",
    	dataType : "jsonp",
    	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
    	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
    	data : {'chatgroupname': MeetingGroupId,
    		    'userid': curUserId
    	},  
    	success : function(json) {
    	    var contents = json[0].msg;
            console.log(contents);
    	}     
    });
};

//解散群组（会议主持人）
var startDestroyMeetingGroup = function(MeetingGroupId) {
	console.log("解散群组，群主："+curUserId);
	$.ajax({  
    	url : WEBIM_URL+"/destroygroup",  
    	async: true,  
    	type : "get",
    	dataType : "jsonp",
    	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
    	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
    	data : {'chatgroupname': MeetingGroupId,
    		    'userid': curUserId
    	},  
    	success : function(json) {
    	    var contents = json[0].msg;
            console.log(contents);
    	}
     
    });
};





