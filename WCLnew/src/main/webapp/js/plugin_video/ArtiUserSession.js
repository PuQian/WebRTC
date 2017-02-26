/**
 * 处理接收来自人工总机模块的会话信息
 * 
 */

(function() {
	com.webrtc.ArtiUserSession = Object.subClass({
		/** @Public Methods */
		ctor : function() {

			this.calleeName = null;

			this.OnResponse = null;

		},

		init : function(onresponse) {

			this.OnResponse = onresponse;
		},

		handleMessage : function(message) {

			// 处理反馈的结果
			var msg = JSON.parse(message.data);// 转换成json格式
			switch (msg.answer) 
			{
				case com.webrtc.protocol.RTCArtiAnswerType["SUCCESS"]:handleSuccess(msg.targetname);break;
				case com.webrtc.protocol.RTCArtiAnswerType["FINISH"]:handleFinish(msg.targetname);break; // 其实这里的FINISH是处理用户掉线
			}
		},

		// 发送消息至WCS
		SendMessage : function(message) {
			this.appConnected.trigger(com.webrtc.events.RecvUserSession,
					message);
		},
		HangUp : function(CalleeId) {
			com.webrtc.DeleteUserSession(this.SessionID);
		},

		setSessionID : function(sessionID) {
			this.SessionID = sessionID;
		}
	});
})();

// 建立与clientname的服务关系
var handleSuccess = function(clientname) {
	clientname = formatRechange(clientname);
	clients.push(clientname); // 添加至数组

	if (globalCur == ArtiUserPrefix) // 若当前打开着“访问用户”菜单，执行界面上的添加
	{
		artiUserUl = $('#' + ArtiUserPrefix).find(".mail_list ul");
		addArtiUser(artiUserUl, clientname);
	}

	$.fillTipBox({
		type : 'info',
		icon : 'glyphicon-info-sign',
		content : "有新的外部用户请求服务，请留意"
	})
};

// 解除与clientname的服务关系
var handleFinish = function(clientname) {
	
	clientname = formatRechange(clientname);

	//销毁有关该用户的一切信息
	removeArtiUser(getFinishElementA(clientname),clientname); //销毁数据
	removeArtiUserActiveListAndWindow(clientname);
	
	$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:"与一个外部用户的服务已结束"})
};