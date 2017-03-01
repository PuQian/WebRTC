package com.free4lab.utils.perflog;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 * 记录异常情况
 * 之后可以去fatallog.free4lab.com查看
 * @author wangchao
 */
public class FatalLogger {
	private static final Integer MAX_LENGTH = 65507;
	private static final String IP = "fatallog.free4lab.com";
	private static final Integer PORT = 3939;
	private static InetAddress ADDRESS = null;
	private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static final String SEPERATOR ="@#";
	
	private static DatagramSocket SOCKET = null;
	
	static{
		try {
			ADDRESS = InetAddress.getByName(IP);
			SOCKET = new DatagramSocket();
		} catch (UnknownHostException e) {
			System.out.println("FATAL ### No such host ###");
			e.printStackTrace();
//			System.exit(0);
		} catch (SocketException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 一个产品(product)的日志数量有上限.
	 * 标签(tag)用于标识异常的类型.
	 * 内容(content)为日志的内容.请不要超过64K字节大小.过长的消息将被截断
	 * @param product
	 * @param tag
	 * @param content
	 */
	public static void log(String product, String tag, String content){
		try {
			String time = sdf.format(Calendar.getInstance().getTime());
			String data = time + SEPERATOR + product + SEPERATOR + tag + SEPERATOR
					+ content;
			//System.out.println(data);
			byte[] buf = data.getBytes();
			int length = buf.length > MAX_LENGTH ? MAX_LENGTH : buf.length;
			DatagramPacket packet = new DatagramPacket(buf, length,
					ADDRESS, PORT);

			SOCKET.send(packet);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		log("hello","world","message");
		String message = "message";
		StringBuilder sb = new StringBuilder();
		for(int i=0;i< 65536/7 ;i++){
			sb.append(i);
			sb.append(message);		
		}
		log("hello","world",sb.toString());
	}
}
