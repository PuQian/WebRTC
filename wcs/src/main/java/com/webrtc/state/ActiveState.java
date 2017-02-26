package com.webrtc.state;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.common.RoapType;
import com.webrtc.common.SessionStateType;
import com.webrtc.dao.SessionDAO;
import com.webrtc.dao.UserDAO;
import com.webrtc.domain.WebrtcSession;
import com.webrtc.service.RESTClient;
import com.webrtc.service.WebrtcSessions;

public class ActiveState extends SessionState{

	@Override
	public void handleMessage(WebrtcSession session, JSONObject msgObj) {
		// TODO Auto-generated method stub		
		try {
			UserDAO userDao = new UserDAO();
			SessionDAO sessionDao = new SessionDAO();
			
			String from = msgObj.getString("from");
			String offerSessionID = msgObj.getJSONObject("roap").getString("offerSessionId");
			String answerSessionID = msgObj.getJSONObject("roap").getString("answerSessionId");
			
			int roapType = msgObj.getJSONObject("roap").getInt("type");
			if(roapType == RoapType.SHUTDOWN){
				System.out.println(session.getOfferSessionID() + " : State[active], Receive shutdown!");
				
				
							
				if(SessionStateType.SESSION_STATUS_CLOSED.equals(sessionDao.findStatus(offerSessionID, answerSessionID)))
				{
					//in database, this session is closed, so we don't need to change closed to shutdown　？？？
					session.setState(new ClosedState());
					//in database, this session is closed, so we don't need to change closed to shutdown　？？？
				
				}
				else
				{
					//change the session state to 'offer'
					session.setState(new ShutdownState());
					//update the session into the DB
					Date date = new Date();
					Timestamp ts = new Timestamp(date.getTime());
				
					sessionDao.updateShutdownTime(offerSessionID, ts);
					sessionDao.updateStatus(offerSessionID, answerSessionID, SessionStateType.SESSION_STATUS_SHUTDOWN);
				}
				//update the from user state
				userDao.updateStatus(from, UserDAO.USER_STATUS_ONLINE);
			} 
			
			else if (roapType == RoapType.OFFER){

				String sdp = msgObj.getJSONObject("roap").getString("sdp"); 
				if (sdp.contains("video")) {
					session.setMediaType("video");
				} else if (sdp.contains("audio")) {
					session.setMediaType("audio");
				}
				System.out.println(session.getOfferSessionID() + " : State[active], Receive offer!");
			} else if (roapType == RoapType.CANDIDATE){
//				if (session.getOfferIP() == null) {
//					String sdp = msgObj.getJSONObject("roap").getString("sdp");
//					String[] parts = sdp.split(" ");
//					String ip = parts[4];
//					session.setOfferIP(ip);
//				}
				System.out.println(session.getOfferSessionID() + " : State[active], Receive candidate!");
				
			} else if (roapType == RoapType.OK) { 
//				try {
//					RESTClient.Send(session);
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
			} else{
				System.out.println(session.getOfferSessionID() + " : State[active], Receive other roap " + roapType + " !");
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}

	@Override
	public String getType() {
		// TODO Auto-generated method stub
		return SessionStateType.SESSION_STATUS_ACTIVE;
	}
}
