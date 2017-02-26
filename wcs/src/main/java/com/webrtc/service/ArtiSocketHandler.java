package com.webrtc.service;

import java.net.*;
import java.util.ArrayList;

import org.cometd.bayeux.server.ServerSession;
import org.json.JSONException;
import org.json.JSONObject;


//WCSGSocketHandler 连接的是 人工总机客服分配模块

public class ArtiSocketHandler extends SocketHandler {
	
	public ArtiSocketHandler(String id, Socket s) {
		super(id,s);
	}
	/**
	 * handle the message received
	 * 
	 * @param message
	 *            : the message need to handle
	 * @throws
	 * @return
	 */
	@Override
	public void handleMessage(String message) {
		/**
		 * 收到人工总机模块反馈的answer后，进行处理
		 * 返回前台提示用户
		 */

		try {
			JSONObject msgObj = new JSONObject(message);
			String to = msgObj.getString("to");
			String sessionID = msgObj.getString("sessionID");
			
			//首先判断answer是否为SUCCESS，若是把targetname存入

			//先把to拆解为单个用户，逐一发送
			String[] clientNames = to.split(",");
			String[] sessionIDs = sessionID.split(",");
			for(int i=0;i<clientNames.length;i++)
			{	
				String clientName = clientNames[i];
				String sid = sessionIDs[i];
				
				msgObj.put("sessionID",sid);
				
				//获取客户端对象，转发
				ArrayList<ServerSession> peers = HttpService.getClientsFromClientName(clientName);
				if(peers != null && peers.size() > 0 && peers.get(0) != null)
					HttpService.forwardingMessageFromSwitchBoard(msgObj, peers.get(0)); //发送给前台
				else
					System.out.println("收到后端自动总机的回应信息，但找不到前端客户端对象");
			}
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
}
