package com.webrtc.common;

import java.net.InetAddress;
import java.net.UnknownHostException;

public class WebrtcUtil {
	
	/**
	 * get the local host address
	 * @param 
	 * @throws
	 * @return String : local ip address
	 */
	public static String getHostAddress(){
		InetAddress addr = null;
		try {
			addr = InetAddress.getLocalHost();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String ip=addr.getHostAddress().toString();
		return ip;
	}
}
