/**
 * 企业管理页面内的相关操作
 */

//企业用户点击“登录/注销人工总机”按钮
var artiLoginLogout = function(element)
{	
	arti_switch = $(element).find("img");
	if(becameArti == false) //登录
	{
		$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:"已登录为人工总机"})
		becameArti = true;
		arti_switch.attr("src","css/pc/images/rtc_head_artion.png"); //开关样式转换
				
		//创建会话Create
		createArtiSession(ARTI);
		
		//向WCS发送注册消息给后台人工总机模块
		sendActionToArti("LOGIN","");
	}
	else  //注销
	{
		$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:"已注销人工总机"})
		becameArti = false;
		arti_switch.attr("src","css/pc/images/rtc_head_artioff.png");//开关样式转换
		
		//向WCS发送注销消息给后台人工总机模块		
		sendActionToArti("LOGOUT","");
		
		//挂断会话HangUp
		endArtiSession();
		
		//清空所有当前的clients
		removeAllClients();	
	}
}

//首次与自动总机会话（初次进入，或点击进入自动总机会话的时候）
var createArtiSession = function()
{
	//创建自动总机会话session
	sessionID = guid(); //生成消息会话的标识
	var artiUserSession = new com.webrtc.ArtiUserSession();
	var userSessionBase = new com.webrtc.WUserSessionBase();

	artiUserSession.calleeName = ARTI;
	artiUserSession.init(onResponse);

	$.extend( true, artiUserSession,userSessionBase);
	artiUserSession.setSessionID(sessionID);
	com.webrtc.app.AddSession(artiUserSession);
};

//发送动作消息给WCS
var sendActionToArti = function(action,targetname)
{
	from = formatChange(username);
	targetname = targetname != "" ? formatChange(targetname) : "";
	to = ARTI;

	var artiMsg = new com.webrtc.protocol.RTCArtiMessage(com.webrtc.protocol.RTCMsgType["artiswitchboard"],from,to,sessionID,eid,priority,targetname,maxservingnum,com.webrtc.protocol.RTCArtiActionType[action]); 
	com.webrtc.app.usersessionlist[sessionID].SendMessage(artiMsg);	
};

//结束会话
var endArtiSession = function()
{
	com.webrtc.app.usersessionlist[sessionID].HangUp(ARTI);
	sessionID = "";
};

//删除当前所有的外部访问用户
var removeAllClients = function()
{		
	//清空所有当前的clients
	if(getRtcCenterDiv(ArtiUserPrefix)) //若存在外部用户Div
	{
		artiUserUl = $('#'+ArtiUserPrefix).find(".mail_list ul");
		artiUserUl.empty();
	}
	
	//关闭所有外部用户的会话框、活动列表项
	for(var i=0;i<clients.length;i++)
		removeArtiUserActiveListAndWindow(clients[i]);

	clients = []; //清空外部用户名数组
};