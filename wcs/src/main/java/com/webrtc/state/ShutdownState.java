package com.webrtc.state;

import java.io.IOException;

import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.common.RoapType;
import com.webrtc.common.SessionStateType;
import com.webrtc.dao.SessionDAO;
import com.webrtc.dao.UserDAO;
import com.webrtc.domain.WebrtcSession;
import com.webrtc.service.RESTClient;
import com.webrtc.service.WebrtcSessions;

public class ShutdownState extends SessionState{

	@Override
	public void handleMessage(WebrtcSession session, JSONObject msgObj) {
		// TODO Auto-generated method stub
		try {
			UserDAO userDao = new UserDAO();
			SessionDAO sessionDao = new SessionDAO();
			String from = msgObj.getString("from");
			String offerSessionID = msgObj.getJSONObject("roap").getString("offerSessionId");
			
			int roapType = msgObj.getJSONObject("roap").getInt("type");
			if(roapType == RoapType.OK){
				System.out.println(session.getOfferSessionID() + " : State[shutdown], Receive ok!");
				
				//change the session state to 'closed'
				session.setState(new ClosedState());
				session.setMediaType(null);
//				try {
//					RESTClient.Send(session);
//				} catch (IOException e) {
					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}	
				WebrtcSessions.removeSession(offerSessionID);
				
				//update the session into the DB
				sessionDao.updateStatus(offerSessionID, SessionStateType.SESSION_STATUS_CLOSED);
				
				//update the from user state
				userDao.updateStatus(from, UserDAO.USER_STATUS_ONLINE);
			} else{
				System.out.println(session.getOfferSessionID() + " : State[shutdown], Receive other roap " + roapType + " !");
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}

	@Override
	public String getType() {
		// TODO Auto-generated method stub
		return SessionStateType.SESSION_STATUS_SHUTDOWN;
	}

}
