package com.webrtc.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.TimerTask;

import org.cometd.bayeux.server.ServerSession;
import org.json.JSONObject;

import com.webrtc.common.ErrorType;
import com.webrtc.common.RoapType;
import com.webrtc.common.SessionStateType;
import com.webrtc.dao.SessionDAO;
import com.webrtc.dao.UserDAO;
import com.webrtc.domain.RTCMessage;
import com.webrtc.domain.WebrtcSession;

public class WebrtcSessions {
	private static HashMap<String, WebrtcSession> webrtcSessions = new HashMap<String, WebrtcSession>();
	private static final int SESSION_TIMEOUT_DELAY = 90000;
	
	private static UserDAO userDao = new UserDAO();
	private static SessionDAO sessionDAO = new SessionDAO();

//////////////////
	private static HashMap<String, SessionInfo> sessionHashMap = new HashMap<String, WebrtcSessions.SessionInfo>();
	public static HashMap<String, SessionInfo> getSessionHashMap(){
		return sessionHashMap;
	}
//////////////////
	/**
	 * change the session status recording to the message
	 * @param msgObj : the message received in json object type
	 * @throws
	 * @return
	 */   
    public static void changeSessionStatus(ServerSession clientId,JSONObject msgObj){
    	try{
    		String from = msgObj.getString("from");
    		String to = msgObj.getString("to");
			String offerSessionID = msgObj.getJSONObject("roap").getString("offerSessionId");
/////////////////////////	
			//建立临时会话表,加入callerClientId，calleeClientId  
			if(!sessionHashMap.containsKey(offerSessionID))
			{
				
				//by shanxuan 新的clientId用传入的clientId 定义
//				String clientId = HttpService.getMembers().get(HttpService.getDefaultRoom()).get(to);  
			    System.out.println(HttpService.getMembers());
			    String remoteServerId =  userDao.getServerAddr(from).toString();
			    ServerSession callerClientId = null;
				if(msgObj.getJSONObject("roap").getInt("type") == RoapType.OFFER)
					callerClientId = clientId;
				System.out.println("set callerClientId : "+callerClientId);
				SessionInfo sessionInfo = new SessionInfo(from,callerClientId,to,null,remoteServerId);                       
			    sessionHashMap.put(offerSessionID, sessionInfo);
				
			}
			else if(msgObj.getJSONObject("roap").getInt("type") == RoapType.ANSWER)
			{
				SessionInfo sessionInfo = sessionHashMap.get(offerSessionID);				
				sessionInfo.setCalleeClientId(clientId);
				System.out.println("set calleeClientId : "+clientId);
				sessionHashMap.put(offerSessionID, sessionInfo);
			}
			
//////////////////////////			
			
			if(webrtcSessions.containsKey(offerSessionID))
			{
				//the session has existed
				WebrtcSession session = webrtcSessions.get(offerSessionID);
				System.out.println("session:"+session);System.out.println("此时的状态为:"+session.getState().getClass().getName());
				session.getState().handleMessage(session, msgObj);
			}
			else
			{
				//receive the offer, construct the new session
				if(msgObj.getJSONObject("roap").getInt("type") == RoapType.OFFER)
				{
					System.out.println("New session!");
					WebrtcSession session = new WebrtcSession(offerSessionID);
					
					//start the timeout timer
					session.getTimer().schedule(new SessionTimeoutTimer(offerSessionID, from, to), SESSION_TIMEOUT_DELAY);
					
					//put the <id, session> into the hashMap
					webrtcSessions.put(offerSessionID, session);
					System.out.println("初始化时的状态:"+session.getState().getClass().getName()+",这时会生成一个新的session");
					//handle the message in the state
					session.getState().handleMessage(session, msgObj);
				}
				
				
				
			}
    	} catch(Exception e){
    		e.printStackTrace();
    	}
    }
    
	/**
	 * the session timeout timer class
	 */   
    public static class SessionTimeoutTimer extends TimerTask{

    	private String offerSessionID;
    	private String from;
		private String to;
    	
    	public SessionTimeoutTimer(String offerSessionID, String from, String to){
    		this.offerSessionID = offerSessionID;
    		this.from = from;
    		this.to = to;
    	}
    	
		@Override
		public void run() {
			// TODO Auto-generated method stub
			if(webrtcSessions.containsKey(this.offerSessionID)){
				String sessionType = webrtcSessions.get(this.offerSessionID).getState().getType();
				if(!sessionType.equals(SessionStateType.SESSION_STATUS_ACTIVE) && !sessionType.equals(SessionStateType.SESSION_STATUS_CLOSED)){
					System.out.println(this.offerSessionID + " has been timeout!");
					webrtcSessions.remove(this.offerSessionID);
					sessionDAO.updateStatus(this.offerSessionID, SessionStateType.SESSION_STATUS_CLOSED);					
					System.out.println("Send the timeout message to '" + this.from + "'!");
					RTCMessage rtcMsgFrom = new RTCMessage(this.offerSessionID, this.to, this.from, ErrorType.TIMEOUT);
					ArrayList<ServerSession> peers = HttpService.getClientsFromClientName(this.from);
					HttpService.forwardingMessage(rtcMsgFrom.getJSONObject(), peers);
					userDao.updateStatus(this.from, UserDAO.USER_STATUS_ONLINE);
					
					System.out.println("Send the timeout message to '" + this.to + "'!");
					RTCMessage rtcMsgTo = new RTCMessage(this.offerSessionID, this.from, this.to, ErrorType.TIMEOUT);
					peers = HttpService.getClientsFromClientName(this.to);
					HttpService.forwardingMessage(rtcMsgTo.getJSONObject(), peers);
					userDao.updateStatus(this.from, UserDAO.USER_STATUS_ONLINE);
				}
			}
		} 	
    }
    
	/**
	 * if the offerSessionID exists in sessions, then remove it
	 */     
    public static void removeSession(String offerSessionID){
    	if(webrtcSessions.containsKey(offerSessionID)){
    		webrtcSessions.get(offerSessionID).getTimer().cancel();
    		webrtcSessions.remove(offerSessionID);
    		WebrtcSessions.getSessionHashMap().remove(offerSessionID);
			System.out.println("is removed?"+WebrtcSessions.getSessionHashMap().containsKey(offerSessionID));
    		System.out.println("The session '" + offerSessionID + "' has been removed!");
    	}
    }
	
////////////////////
    /*
     * 会话信息类
     */
    public static class SessionInfo{
    	private String localUserName;
    	private ServerSession callerClientId;
    	private ServerSession calleeClientId;
    	private String clientId; 
    	private String remoteUserName;
    	private String remoteServerId;
    	
    	public SessionInfo(String localUserName,ServerSession callerClientId,String remoteUserName, ServerSession calleeClientId,String remoteServerId){
    		this.localUserName = localUserName;
    		this.callerClientId = callerClientId;
    		this.remoteUserName = remoteUserName;
    		this.calleeClientId = calleeClientId;
    		this.remoteServerId = remoteServerId;
    	}
    	public ServerSession getCallerClientId() {
			return callerClientId;
		}
		public void setCallerClientId(ServerSession callerClientId) {
			this.callerClientId = callerClientId;
		}
		public ServerSession getCalleeClientId() {
			return calleeClientId;
		}
		public void setCalleeClientId(ServerSession calleeClientId) {
			this.calleeClientId = calleeClientId;
		}
		public String getLocalUserName(){
    		return localUserName;
    	}
    	public String getClientId(){
    		return clientId;
    	}
    	public String getRemoteUserName(){
    		return remoteUserName;
    	}
    	public String getRemoteServerId(){
    		return remoteServerId;
    	}
    	
    }
/////////////////////
    
    
    //根据CorrelationId获取session
    public static WebrtcSession getCorrelationId(String CorrelationId) {
    	Collection<WebrtcSession> sessions = webrtcSessions.values(); 
    	for (WebrtcSession session : sessions) {
    		if (session.getCorrelationId().equals(CorrelationId)) {
    			return session;
    		}	
    	}
    	return null;
    }
    
}
