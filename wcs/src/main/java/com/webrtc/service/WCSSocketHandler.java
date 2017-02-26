package com.webrtc.service;

import java.net.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.io.*;

import org.cometd.bayeux.server.ServerSession;
import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.common.Constants;


//SocketHandler 连接的是其他的WCS

public class WCSSocketHandler extends SocketHandler {

	public WCSSocketHandler(String id, Socket s) {
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
		try {
			
			//某一个用户下线消息
			if (message.substring(0, 1).equals("#")) {
				this.updateTempUsers(message.substring(1));
				return ;
			}
			// 以下为处理正常消息
			// parse the message into json object
			System.out.println("Socket message : " + message);
			JSONObject msgObj = new JSONObject(message);
			// System.out.println("Socket message : " + message);
			String to = msgObj.getString("to");

			ArrayList<ServerSession> peers = HttpService
					.getClientsFromClientName(to);
			if (peers.size() > 0) {
				for (ServerSession peer : peers) {
					WebrtcSessions.changeSessionStatus(peer, msgObj);
					HttpService.forwardingMessage(msgObj, peers);
				}
			} else {
				// in next version add code to send back the 'offline' error
				// message
				System.out
						.println("Receive message from the remote server and have unknown destination : "
								+ to);
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	// 更新临时用户信息表
	public void updateTempUsers(String clientName) {
		System.out.println(".................................." + clientName);
		HashMap<String, String> tempUsers = HttpService.getTempUsers();
		if (tempUsers.containsKey(clientName)) {
			tempUsers.remove(clientName);
		}
	}

}
