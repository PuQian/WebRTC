package com.webrtc.service;

import java.net.*;
import java.util.ArrayList;
import org.cometd.bayeux.server.ServerSession;
import org.json.JSONException;
import org.json.JSONObject;


//AutoSocketHandler 连接的是 自动总机问题查询模块

public class AutoSocketHandler extends SocketHandler {

	public AutoSocketHandler(String id, Socket s) {
		super(id,s);
	}
	/**
	 * 处理收到的数据
	 */
	@Override
	public void handleMessage(String message) {
		
		/**
		 * 收到自动总机模块计算出的message后，包装成JSON数据，取得目的地客户端地址后，发送给前段浏览器显示
		 */

		try {
			JSONObject msgObj = new JSONObject(message);
			String to = msgObj.getString("to");
			
			//获取客户端对象，方便转发
			ArrayList<ServerSession> peers = HttpService.getClientsFromClientName(to);
			if(peers != null && peers.size() > 0 && peers.get(0) != null)
				HttpService.forwardingMessageFromSwitchBoard(msgObj, peers.get(0));
			else
				System.out.println("收到后端自动总机的回应信息，但找不到前端客户端对象");
			
		} catch (JSONException e) {
			e.printStackTrace();
		}

	}

}
