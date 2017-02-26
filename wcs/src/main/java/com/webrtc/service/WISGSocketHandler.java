package com.webrtc.service;

import java.net.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.io.*;

import org.cometd.bayeux.server.ServerSession;
import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.common.Constants;


//WISGSocketHandler 连接的是 WISG

public class WISGSocketHandler extends SocketHandler {

	public WISGSocketHandler(String id, Socket s) {
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
			System.out.println("From "+this.remoteID+" Socket message : " + message);
			// 如果此SocketHandler 是WISG ，则 每次收到 不管是心跳消息 还是 真正的 消息 ，计数器均 清零
			if (this.remoteID.equals(Constants.WISG_FLAG)) {
				// 清零
				HttpService.ss.WISG_HeartBeat.setCountZero();
			}
			// 如果是心跳消息，返回此心跳消息给WISG
			if (message.equals("HeartBeat")) {
				send("heartBeatResponse");
				return;
			}
			
			// 以下为处理正常消息
			// parse the message into json object
			//System.out.println("Socket message : " + message);
			JSONObject msgObj = new JSONObject(message);
			// System.out.println("Socket message : " + message);
			String to = msgObj.getString("to");
			
			// 如果此 sockethandler 是 连接 WISG的
			if (this.remoteID.equals(Constants.WISG_FLAG)) {
				String from = msgObj.getString("from");
				// from字段 增加 @open-ims.com
				msgObj.put("from", from + Constants.WISG_DOMAIN);
			}

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

}
