package com.webrtc.service;

import java.net.*;
import java.util.HashMap;
import java.util.List;
import java.io.*;

import com.webrtc.dao.*;
import com.webrtc.common.Constants;
import com.webrtc.common.WebrtcUtil;
import com.webrtc.service.WCSSocketHandler;

public class SocketService extends Thread {
	private static String localServerId;
	private static String localIPAddr;
	private static String name;
	private int localPort;
	private ServerSocket listenSocket;
	private ServerDAO serverDao;
	private static HashMap<String, SocketHandler> socketConns = new HashMap<String, SocketHandler>();

	public HeartBeatService WISG_HeartBeat = null;
	public HeartBeatService WCSG_HeartBeat = null;

	public SocketService(int port, String name) {
		this.localPort = port;
		this.name = name;
		this.serverDao = new ServerDAO();

		// register the ip and port in the database
		this.register();

		// get the server id
		this.localServerId = this.serverDao.getServerID(this.localIPAddr,
				this.localPort).toString();
	}

	/**
	 * register the ip and port in the database
	 * 
	 * @param
	 * @throws
	 * @return
	 */
	private void register() {
		this.localIPAddr = WebrtcUtil.getHostAddress();
		// this.localIPAddr="127.0.0.1";
		// this.localIPAddr="127.0.1.1";
		System.out.println("Local ip : " + localIPAddr);
		System.out.println("Local port : " + this.localPort);

		this.serverDao.create(this.localIPAddr, this.localPort, this.name);
	}

	/**
	 * get the local server allocated by database
	 * 
	 * @param
	 * @throws
	 * @return String : the local server id
	 */
	public static String getServerId() {
		return localServerId;
	}

	/**
	 * connect to the other servers got from the database
	 * 
	 * @param
	 * @throws
	 * @return
	 */
	public void connectOtherServers() {
		// get all the <id, ip, port> records in the database
		//从数据库读取所有wcs服务器的ip地址，然后逐个互联
		List<Server> servers = this.serverDao.getServerList();
		for (Server remoteServer : servers) {
			String remoteID = remoteServer.getId().toString();
			String remoteIPAddr = remoteServer.getServerAddr();
			int remotePort = remoteServer.getPort().intValue();
			if (!remoteID.equals(this.localServerId)) {
				try {
					// establish the connection with the remote server
					System.out.println("Connect to " + remoteIPAddr + ":"
							+ remotePort + "....");
					Socket connSocket = new Socket(remoteIPAddr, remotePort);
					System.out
							.println("Have established connection with Server "
									+ remoteID);

					// send the local server id to the remote server
					PrintWriter out = new PrintWriter(
							connSocket.getOutputStream());
					String message = this.localServerId;
					int length = message.length();
					byte[] result = int2Byte(length);
					connSocket.getOutputStream().write(result);
					out.print(message);
					out.flush();
					// instantiate a thread to handle the receiving message
					// and put the <id, thread> into the hashMap
					WCSSocketHandler sc = new WCSSocketHandler(remoteID,
							connSocket);
					socketConns.put(remoteID, sc);
					sc.start();
					// sc.sendtest();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					System.out.println("Server '" + remoteIPAddr
							+ "' is offline!");
				}
			}
		}
	}

	// ///////////////////////
	/*
	 * 通知其他服务器更新信息表，只的是多个WCS之间
	 */
	public void imformOtherServers(String clientId) {
		List<Server> servers = this.serverDao.getServerList();
		for (Server remoteServer : servers) {
			String remoteID = remoteServer.getId().toString();
			String remoteIPAddr = remoteServer.getServerAddr();
			if (!remoteID.equals(this.localServerId)) {
				try {
					System.out.println("                              #"
							+ clientId);
					socketConns.get(remoteID).send("#" + clientId);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					System.out.println("Server '" + remoteIPAddr
							+ "' is offline!");
				}
			}
		}
	}

	// //////////////////

	/**
	 * handle the request
	 * 
	 * @param
	 * @throws
	 * @return
	 */
	@SuppressWarnings({ "resource", "resource", "resource" })
	public void handleRequest() throws Exception {
		
		//监听有没有客户端请求与自己建立服务
		//若有则建立联系，且根据它的remoteID和connSocket描述符开启通信
		//客户端可为：浏览器、自动总机、人工总机、心跳等
		while (true) {
			// accept the socket request
			//阻塞！！
			Socket connSocket = this.listenSocket.accept();
			BufferedReader in = new BufferedReader(new InputStreamReader(
					connSocket.getInputStream()));

			String messageall = null;
			byte[] result = new byte[4];

			//阻塞！！需要发送send进一步触发
			connSocket.getInputStream().read(result);
			int length = byte2Int(result);
			System.out.println("length"+length);
			// 消息长度零，直接continue
			if (length <= 0) {
				continue;
			}

			byte[] result2 = new byte[length];
			connSocket.getInputStream().read(result2);
			messageall = new String(result2,"UTF-8");
			System.out.println("receive message head = " + length);
			System.out.println("receive message content = " + messageall);
			String remoteID = messageall; //remoteID是请求连接WCS的客户端的标识码（自动总机？人工总机？其它WCS？）
			System.out.println("Have accept connection request with Server " + remoteID);

			// instantiate a thread to handle the receiving message
			// and put the <id, thread> into the hashMap
			SocketHandler sc = null;

			// sc.sendtest();

			// 待完善修改

			// 普通的另一个WCS申请连接

			// WISG 或 WCSG申请连接

			
			/**
			 * add by yck
			 * 注意：remoteID只是前缀 比如 AUTO ARTI 
			 */
			
			// 自动总机申请连接
			if(remoteID.equals(Constants.AUTO_FLAG))
			{
				sc = new AutoSocketHandler(remoteID, connSocket); //自动总机---->WCS
			}
			
			// 人工总机申请连接
			else if(remoteID.equals(Constants.ARTI_FLAG))
			{
				sc = new ArtiSocketHandler(remoteID, connSocket); //自动总机---->WCS
			}
			
			// 如果remoteID是 WISG,启动WISG_HeartBeat定时器
			else if (remoteID.equals(Constants.WISG_FLAG)) {

				sc = new WISGSocketHandler(remoteID, connSocket);

				if (this.WISG_HeartBeat != null) {
					this.WISG_HeartBeat.cancel();
					this.WISG_HeartBeat = null;
				}
				this.WISG_HeartBeat = new HeartBeatService(remoteID, sc);
				this.WISG_HeartBeat.start();

			}
			// 如果remoteID是 WCSG,启动WCSG_HeartBeat定时器
			else if (remoteID.equals(Constants.WCSG_FLAG)) 
			{
				sc = new WCSGSocketHandler(remoteID, connSocket);

				if (this.WCSG_HeartBeat != null) {
					this.WCSG_HeartBeat.cancel();
					this.WCSG_HeartBeat = null;
				}
				this.WCSG_HeartBeat = new HeartBeatService(remoteID, sc);
				this.WCSG_HeartBeat.start();

			}
			else 
			{
				sc = new WCSSocketHandler(remoteID, connSocket);
			}

			socketConns.put(remoteID, sc);
			sc.start();

			messageall = null;
			result = null;
			result2 = null;

		}
	}

	public static SocketHandler getSocketHandlerFromServerID(String serverID) {
		return socketConns.get(serverID);
	}

	public static void removeSocketHandlerThread(String serverID) {
		if (socketConns.containsKey(serverID)) {
			socketConns.remove(serverID);
		}
	}

	public void run() {

		//this.connectOtherServers();

		try {
			// instantiate the socket server
			this.listenSocket = new ServerSocket(this.localPort);
			System.out.println("Socket listen on " + this.localPort);

			this.handleRequest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				if (this.listenSocket != null)
					this.listenSocket.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	public static byte[] int2Byte(int intValue) {
		byte[] b = new byte[4];
		for (int i = 0; i < 4; i++) {
			b[i] = (byte) (intValue >> 8 * (3 - i) & 0xFF);
			// System.out.println(Integer.toBinaryString(b[i])+" ");
			System.out.println("--" + (+b[i] & 0xFF) + "--");
		}
		return b;
	}

	public static int byte2Int(byte[] b) {
		int intValue = 0;
		for (int i = 0; i < b.length; i++) {
			intValue += (b[i] & 0xFF) << (8 * (3 - i));
		}
		return intValue;
	}
}
