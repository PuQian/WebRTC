package com.webrtc.state;

import java.util.Date;
import java.sql.Timestamp;

import org.json.JSONObject;

import com.webrtc.common.ErrorType;
import com.webrtc.common.RoapType;
import com.webrtc.common.SessionStateType;
import com.webrtc.dao.SessionDAO;
import com.webrtc.dao.UserDAO;
import com.webrtc.domain.WebrtcSession;
//import com.webrtc.webrtcserver.MyWebSocketHandler;
import com.webrtc.service.WebrtcSessions;

public class OfferState extends SessionState{

	@Override
	public void handleMessage(WebrtcSession session, JSONObject msgObj) {
		// TODO Auto-generated method stub
		try {
			UserDAO userDao = new UserDAO();
			SessionDAO sessionDao = new SessionDAO();
			String from = msgObj.getString("from");
			String to = msgObj.getString("to");
			String offerSessionID = msgObj.getJSONObject("roap").getString("offerSessionId");
			
			int roapType = msgObj.getJSONObject("roap").getInt("type");
			
			if(roapType == RoapType.ANSWER)
			{
				System.out.println(session.getOfferSessionID() + " : State[offer], Receive answer!");
				
				//change the session state to 'offer'
				session.setState(new AnswerState());
				
				//update the session into the DB
				Date date = new Date();
				Timestamp ts = new Timestamp(date.getTime());
				String answerSessionID = msgObj.getJSONObject("roap").getString("answerSessionId");
				sessionDao.updateAnswerSessionID(offerSessionID, answerSessionID, ts);
				sessionDao.updateStatus(offerSessionID, answerSessionID, SessionStateType.SESSION_STATUS_ANSWER);
				System.out.println("ohohoho");
				//update the callee state
				userDao.updateStatus(from, UserDAO.USER_STATUS_BUSY);
			} 
			else if (roapType == RoapType.CANDIDATE) 
			{
				if (session.getCaller().equals(msgObj.getString("from"))) {
					if (session.getOfferIP() == null || session.getOfferPort() == null) {
						String sdp = msgObj.getJSONObject("roap").getString("sdp");
						String[] parts = sdp.split(" ");
						String ip = parts[4];
						String type = parts[1];
						if (type.contains("1") && !ip.contains("192.168")) {
							session.setOfferIP(ip);
							String port = parts[5];
							session.setOfferPort(port);
						}
					}
				}
			} else if(roapType == RoapType.SHUTDOWN){
				System.out.println(session.getOfferSessionID() + " : State[offer], Receive shutdown!");
				
				//cancel the timer
				session.getTimer().cancel();
				
				//change the session state to 'shutdown'
				session.setState(new ShutdownState());
				
				//update the session state to 'closed'
				Date date = new Date();
				Timestamp ts = new Timestamp(date.getTime());
				sessionDao.updateShutdownTime(offerSessionID, ts);
				sessionDao.updateStatus(offerSessionID, SessionStateType.SESSION_STATUS_SHUTDOWN);	
				
				//update the caller and callee state
				userDao.updateStatus(from, UserDAO.USER_STATUS_ONLINE);			
				userDao.updateStatus(to, UserDAO.USER_STATUS_ONLINE);	
			} else if(roapType == RoapType.ERROR){
				int errorType = msgObj.getJSONObject("roap").getInt("error");
				if(errorType == ErrorType.REFUSED){
					//receive the refuse error message
					System.out.println(session.getOfferSessionID() + " : State[offer], Receive 'refused' error!");
					
					//remove the session from sessions
					WebrtcSessions.removeSession(offerSessionID);

					//update the session state to 'closed'
					sessionDao.updateStatus(offerSessionID, SessionStateType.SESSION_STATUS_CLOSED);
				
					//update the caller state
					userDao.updateStatus(to, UserDAO.USER_STATUS_ONLINE);
				} else if(errorType == ErrorType.CONFLICT){
					//receive the conflict error message
					System.out.println(session.getOfferSessionID() + " : State[offer], Receive 'conflict' error!");
					
					//remove the session from sessions
					WebrtcSessions.removeSession(offerSessionID);

					//update the session state to 'closed'
					sessionDao.updateStatus(offerSessionID, SessionStateType.SESSION_STATUS_CLOSED);
					
					//update the caller state
					userDao.updateStatus(to, UserDAO.USER_STATUS_ONLINE);
				} else if(errorType == ErrorType.MEDIAFAILED){
					//receive the conflict error message
					System.out.println(session.getOfferSessionID() + " : State[offer], Receive 'mediafailed' error!");
					
					//remove the session from sessions
					WebrtcSessions.removeSession(offerSessionID);

					//update the session state to 'closed'
					sessionDao.updateStatus(offerSessionID, SessionStateType.SESSION_STATUS_CLOSED);
					
					//update the caller state
					userDao.updateStatus(to, UserDAO.USER_STATUS_ONLINE);					
				}else{
					System.out.println(session.getOfferSessionID() + " : State[offer], Receive other error " + errorType + " !");
					
					//update the caller state
					userDao.updateStatus(to, UserDAO.USER_STATUS_ONLINE);
				}
			} else{
				System.out.println(session.getOfferSessionID() + " : State[offer], Receive other roap " + roapType + " !");
			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public String getType() {
		// TODO Auto-generated method stub
		return SessionStateType.SESSION_STATUS_OFFER;
	}
}
