/**
 * 顶部消息数量相关
 */

//设置顶部消息数量+1
var incNumInHeadTips = function(type)
{
	numLi = getNumLiInHeadTips(type); //获取顶部消息元素
	var num = getNumInHeadTips(numLi);
	updateNumInHeadTips(numLi, num+1);
};

//设置顶部消息数量-sub
var subNumInHeadTips = function(chatFriendId,type)
{
	numLi = getNumLiInHeadTips(type); //获取顶部消息元素
	var num = getNumInHeadTips(numLi);
	var sub = getNumInActiveListItem(getActiveList(chatFriendId,type));
	updateNumInHeadTips(numLi, num-sub);
};


//设置顶部头条的数量为num
var updateNumInHeadTips = function(numLi,num)
{
	num_i = numLi.find(".num"); //消息数量元素
	
	if(num <= 0)
	{
		num_i.hide(); //隐藏
	}
	else if(num >= 100)
	{
		num_i.show();
		num_i.text("..."); //三位数时显示...
	}
	else 
	{	
		num_i.show();
		num_i.text(num); //正常显示
	}
	
	numLi.attr("num",num); //隐藏消息数量记录更新
};

//获取顶部type类消息当前的数量
var getNumInHeadTips = function(numLi)
{
	return parseInt(numLi.attr("num"));
};


//通过type取得顶部消息是哪一个圆形（下标）
var getNumLiInHeadTips = function(type)
{
	var index=2;
	switch(type)
	{
		case MessagePrefix:
		case GroupPrefix:index = 2;break;
		case CallAudioPrefix:
		case CallVideoPrefix:index = 0;break;
		case MeetingPrefix:index = 1;break;
	}
	
	return $('.head_tips ul li').eq(index);
};

/**
 * 音视频、会议数量相关
 */

var localStorage = window.localStorage;
//初始化顶部的未接通话、未接会议 红色消息
var initHeadTips = function(username)
{
	var lastLoginTime = getLastLoginTime(username);	//获取上次登录时间
	var curLoginTime = new Date().Format("yyyy-MM-dd hh:mm:ss");//获取当前时间
	if(lastLoginTime == null)//信息被清空或第一次登录
	{
		saveCurrentLoginTime(username,curLoginTime);//存入
		return;
	}
	
	//请求后台action：WCL/requestMissedCalls
	//查询数据库获取所有未接来电
	console.log("username="+username);
	console.log("lastLoginTime="+lastLoginTime);
	console.log("curLoginTime="+curLoginTime);
	requestMissedCalls(username,lastLoginTime,curLoginTime);
	
	//覆盖保存这次的登录时间
	saveCurrentLoginTime(username,curLoginTime);
}

//获取username上次登录系统的时间
var getLastLoginTime = function(username)
{
	return localStorage.getItem('logintime_'+username);
}

//将username	本次登录系统的时间存入客户端
var saveCurrentLoginTime = function(username,curLoginTime)
{
	localStorage.setItem('logintime_'+username,curLoginTime);
}

//利用ajax异步请求后台访问所有在lastTime-curTime未接通话！！！！！！！！！！！！
var requestMissedCalls = function(username,lastLoginTime,curLoginTime)
{
	//音视频
	answerer = formatChange(username);
	$.ajax({
		url : "/WCLnew/requestMissedCalls",
		type : "post",
		async : false,
		data : {'answerer':answerer,'lastLoginTime':lastLoginTime,'curLoginTime':curLoginTime},
		dataType : "json",
		success : function(data) {
			
			console.log("the missed media message num ="+data.missedMediaCallsNum);
			console.log("the missed meeting message num ="+data.missedMeetingCallsNum);
			
			//显示音视频消息数
			updateNumInHeadTips(getNumLiInHeadTips(CallAudioPrefix),data.missedMediaCallsNum);
			
			//显示会议消息数
			updateNumInHeadTips(getNumLiInHeadTips(MeetingPrefix),data.missedMeetingCallsNum);
			
		}
	});
}


//点击顶部第一个圆形链接（音视频）
var showMissedCalls = function()
{
	$(".rtc_menu ul li").eq(4).trigger("click");//触发历史记录选项卡,执行HistoryCall()函数
	$("#onAudio").trigger("click");//触发通话记录选项卡,执行HistoryAudio()函数
	
	//清空红色数字
	numLi = getNumLiInHeadTips(CallAudioPrefix);
	updateNumInHeadTips(numLi,0);
}

//点击顶部第二个圆形链接（会议）
var showMissedMeetings = function()
{
	$(".rtc_menu ul li").eq(4).trigger("click");//触发历史记录选项卡，执行HistoryCall()函数
	$("#onMeeting").trigger("click");//触发会议召开记录选项卡,执行HistoryMeeting()函数
	
	//清空红色数字
	numLi = getNumLiInHeadTips(MeetingPrefix);
	updateNumInHeadTips(numLi,0);
}