package com.webrtc.service;

import java.net.*;
import java.io.*;

abstract public class SocketHandler extends Thread {
	protected String remoteID = null;
	protected Socket connSocket = null;
	protected BufferedReader in = null;
	protected PrintWriter out = null;
	
	protected byte[] receiveresult2 = new byte[10000];
	protected byte[] outresult = new byte[10];

	public SocketHandler(String id, Socket s) {
		this.remoteID = id;
		this.connSocket = s;
		try {
			in = new BufferedReader(new InputStreamReader(
					this.connSocket.getInputStream()));
			out = new PrintWriter(this.connSocket.getOutputStream());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	/**
	 * send the message to the remote peer through socket
	 * 
	 * @param message
	 *            : the message need to send
	 * @throws
	 * @return
	 */
	public void send(String message) {
		//System.out.println("^^^^^^^^^^^^^^^^^^^^^^^^");
		int length=message.length();
		try {
			length = message.getBytes("UTF-8").length;
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

//		int length = message.length();
		outresult = int2Byte(length);

		try {
			connSocket.getOutputStream().write(outresult, 0, 4);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		out.print(message);
		//System.out.println("send message length = " + length);
		//System.out.println("send message content = " + message);
		out.flush();
		//System.out.println("------------------------");
	}

	public void sendtest() {
	}

	public static byte[] int2Byte(int intValue) {
		byte[] b = new byte[4];
		for (int i = 0; i < 4; i++) {
			b[i] = (byte) (intValue >> 8 * (3 - i) & 0xFF);
			//System.out.println("--" + (+b[i] & 0xFF) + "--");
		}
		return b;
	}
	// public static int byte2Int(byte[] b) {
	// int intValue = 0;
	// for (int i = 0; i < b.length; i++) {
	// intValue += (b[i] & 0xFF) << (8 * (3 - i));
	// }
	// return intValue;
	// }

	public static int byte2Int(byte[] b) {
		int intValue = 0;
		for (int i = 0; i < b.length; i++) {
			// System.out.println("--" + (+b[i] & 0xFF) + "--");
			intValue += (b[i] & 0xFF) << (8 * (3 - i));
		}
		return intValue;
	}

	abstract public void handleMessage(String message);

	public void run() {
		try {
			String messageall = null;
			while (true) {
				byte[] receiveresult = new byte[4];
				connSocket.getInputStream().read(receiveresult); //获取远程客户端发来的输入
				int length = byte2Int(receiveresult);
				// 消息长度零，直接continue
				if (length <= 0) {
					continue;
				}
				//System.out.println("<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
				//System.out.println("receive message head = " + length);

				int realReadCount = 0;// 已经成功读取的字节的个数
				while (realReadCount < length) {
					realReadCount += connSocket.getInputStream().read(
							receiveresult2, realReadCount,
							length - realReadCount);
					//System.out.println("realReadCount = " + realReadCount);
				}
//				messageall = new String(receiveresult2,"UTF-8");
				messageall = new String(receiveresult2, 0, length);
		

				//System.out.println("receive message content = \n" + messageall);
				System.out.println("\n" + messageall);
				System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");		
				this.handleMessage(messageall);
				messageall = null;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("Disconnetct with server " + this.remoteID);
		} finally {
			// release the resource
			try {
				// remove the <id, thread> from the hashMap
				SocketService.removeSocketHandlerThread(remoteID);
				if (this.in != null)
					this.in.close();
				if (this.out != null)
					this.out.close();
				if (this.connSocket != null)
					this.connSocket.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	public void closeSocket() {
		try {
			if (this.in != null)
				this.in.close();
			if (this.out != null)
				this.out.close();
			if (this.connSocket != null)
				this.connSocket.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
