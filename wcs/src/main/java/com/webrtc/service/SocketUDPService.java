/*************************************************************************
*
* FileName : SocketUDPServer.java
*
*
**************************************************************************/

package com.webrtc.service;

import java.net.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.io.*;

import org.cometd.bayeux.server.ServerMessage;
import org.cometd.bayeux.server.ServerSession;
import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.dao.*;
import com.webrtc.common.WebrtcUtil;
import com.webrtc.service.WCSSocketHandler;
import com.webrtc.service.WebrtcSessions.SessionInfo;

public class SocketUDPService extends Thread{
	
	private static String localIPAddr;
	private int localPort;
	private DatagramSocket listenSocket;

	private DatagramPacket data;
	
	public SocketUDPService(int port){
		this.localPort = port;
	}
	

	/**
	 * handle the request
	 * @param 
	 * @throws
	 * @return
	 */
	public void handleRequest() throws Exception{
		
		
		while(true){
			
			
			 listenSocket.receive(data);
			  String sentence = new String(data.getData());
             System.out.println("receive CS Message: " + sentence);
             
         	JSONObject jso=new JSONObject(sentence);
         	
        	System.out.println("cs result to="+jso.get("to").toString());
        	
        	String result=jso.get("to").toString();
        	String sarray[]=result.split(",");  
    		
    		for(String i:sarray)
    		{
    			//System.out.println(i);
    			
    			sendMeetingMembers(i,result);
    		}
             
		}		
	}
	
	
	public void sendMeetingMembers(String to,String meetingMembers) throws JSONException{
		
		ArrayList<ServerSession> peers = HttpService.getClientsFromClientName(to);
		
		JSONObject sendMsg = new JSONObject();
		sendMsg.put("from", "wcs");
		sendMsg.put("type",1);
		
		JSONObject sendRoapMsg = new JSONObject();
		sendRoapMsg.put("type", 11);
		sendRoapMsg.put("meetingMembers",meetingMembers);
		
		sendMsg.put("roap",sendRoapMsg);
		
		ServerMessage.Mutable forward = HttpService.generateMessage(sendMsg.toString());
	
		
	    if(peers.size()>0)
	    {
	    	
	        System.out.println("wcs return to "+to+" memberMeetings "+sendMsg.toString());			
		     for(int i=0;i<=peers.size()-1;i++)
		    	 {
		    	       peers.get(i).deliver(peers.get(i), forward);
		    	 }
	    }
             		
	}
	
	public void testSendMeetingMembers() throws JSONException
	{
	    byte[] bs = new byte[1024];  
		
		String a="{\"to\":\"jxk143-163.com@WebRTC,webrtc1-163.com@WebRTC,aa,aaaa@open-ims.com,webrtc4-163.com@WebRTC\"}";
		bs = a.getBytes();
		String res = new String(bs);
		System.out.println("res="+res);
		
		JSONObject jso=new JSONObject(res);
		String result=jso.get("to").toString();
		
		String sarray[]=result.split(",");  
		
		for(String i:sarray)
		{
			sendMeetingMembers(i,result);
		}
	}
	
	
	
		
	
    public void run(){
    	    	
		try {
			//instantiate the socket server
			this.listenSocket = new DatagramSocket(new InetSocketAddress(this.localPort));
			this.localIPAddr=WebrtcUtil.getHostAddress();
			
			System.out.println("UDP Socket listen on ip: "+ this.localIPAddr+" port:" +this.localPort);
		
			byte[] bs = new byte[1024];  
            
            data = new DatagramPacket(bs, bs.length);  			
			
			this.handleRequest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		finally{
			if(this.listenSocket != null) this.listenSocket.close();
		}
    }
    
    
    
    
}
