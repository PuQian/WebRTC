var becameArti = false; //是否注册为了人工总机
var sessionID = ""; //等待createArtiSession后产生
var username = ""; //webrtc9@163.com
var eid = 0;
var priority = 0;
var maxservingnum = 3;
var ARTI = "ARTI"; //常量
var clients = new Array();//已成功请求服务的外部用户（显示在“访问用户选项卡里面”）

$(document).ready(function(){
	
	
	VIDEO_URL = com.websockets[0];
	console.log(VIDEO_URL);
	if(com.webrtc.getMediaSupport() == true){
		loginwebrtc();
		console.log("initAll end to loginwebrtc");
	}else{
		//不支持webrtc API
	}
	
	//初始化需要用到的数据
	initData();
	
	//连接环信
	console.log("connectToEase");
	connectToEase();
	console.log("connectToEase success in initAll.js");
	
});


//初始化需要用到的数据
var initData = function()
{
	//获取必要参数参数作为全局变量使用
	username = $('.pub_banner').attr("user");
	console.log("username = " +username);
	
	isarti = $('#isarti').val();
	if(isarti == 1) //该用户具备人工总机权限
	{
		eid = $('#eid').val();
		priority = $('#priority').val();
		maxservingnum = $('#maxservingnum').val();
	}
};

//判断是否需要初始化客服相关界面、功能等，如：自动开启客服定时，自动关闭客服
var checkIfStartArti = function()
{
	//是客服
	if($('#isarti').val() == 1)
	{
		//顶部显示客服开关
		$(".head_tips ul li").eq(3).show();
		
		//又设置了客服自动登录/注销开关
		if($('#isbindtimer').val() == 1)
		{
			//获取登录、注销时间点
			date = new Date(); //获取当前日期对象
			today = date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();// 拼接年/月/日 ,如2016/5/9
			todayLoginTime = today + " " + $('#loginTime').val(); //今天自动登录客服的时间 
			todayLogoutTime = today + " " + $('#logoutTime').val(); //今天自动注销客服的时间 
	
			//获取三个时间点距离1970-1-1的毫秒数
			loginTimeLength = Date.parse(new Date(todayLoginTime));
			logoutTimeLength = Date.parse(new Date(todayLogoutTime));
			curTimeLength = new Date().getTime();//当前时间点长度
			
			console.log("客服自动登录时间长度：" + loginTimeLength);
			console.log("客服自动注销时间长度：" + logoutTimeLength);
			console.log("当前时间长度：" + curTimeLength);
			
			//判断是否开启定时器
			//在登录时间点之前 || 介于登录时间与注销时间之间   才会开启
			if(curTimeLength < loginTimeLength) 
			{
				//loginTimeLength-curTimeLengh毫秒后开启
				setTimeout("autoLoginArti()",loginTimeLength-curTimeLength);
				
				//logoutTimeLength-curTimeLengh毫秒后终止
				setTimeout("autoLogoutArti()",logoutTimeLength-curTimeLength);
			}
			else if(curTimeLength >= loginTimeLength && curTimeLength < logoutTimeLength) //立即开启
			{
				//立即开启
				autoLoginArti();
				
				//logoutTimeLength-curTimeLengh毫秒后终止
				setTimeout("autoLogoutArti()",logoutTimeLength-curTimeLength);
			}
		}
	}
};

//企业用户自动登录客服
var autoLoginArti = function()
{
	if(becameArti == false) //之前要不是客服，才开启
		$("#artiloginlogout").trigger("click");
};

//企业用户自动注销客服
var autoLogoutArti = function()
{
	if(becameArti == true) //之前要是客服，才关闭
		$("#artiloginlogout").trigger("click");
};


//格式转化，去掉“@”换成“-”，并在后面加“@WebRTC”	
//eg: jxk143@163.com -->  jxk143-163.com@WebRTC
var formatChange = function(original){
	return original.split("@")[0]+'-'+original.split("@")[1]+"@WebRTC";
}
//格式转换，去掉“@WebRTC”，“-”换成“@”
////eg: jxk143-163.com@WebRTC -->  jxk143@163.com
var formatRechange = function(original){
	return original.split('@')[0].replace('-','@');
}
//格式转化，去掉“@”换成“-”  
//eg: jxk143@163.com -->  jxk143-163.com
var formatToEase = function(original){
	return original.replace('@','-');
}
//格式转化，去掉“-”换成“@”  
//eg: jxk143-163.com -->  jxk143@163.com
var formatReEase = function(original){
	return original.replace('-','@');
}

//格式转化，加上“@”
//eg: jxk143-163.com -->  jxk143-163.com@WebRTC
var EaseToWCS = function(original){
	return original+"@WebRTC";;
}
//格式转化，去掉“@WebRTC” 
//eg: jxk143-163.com@WebRTC -->  jxk143-163.com
var WCSToEase = function(original){
	return original.split('@')[0];
}
