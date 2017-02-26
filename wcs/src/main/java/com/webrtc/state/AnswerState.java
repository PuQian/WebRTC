package com.webrtc.state;

import java.io.IOException;

import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.common.RoapType;
import com.webrtc.common.SessionStateType;
import com.webrtc.dao.SessionDAO;
import com.webrtc.domain.WebrtcSession;
import com.webrtc.service.RESTClient;

public class AnswerState extends SessionState{

	@Override
	public void handleMessage(WebrtcSession session, JSONObject msgObj) {
		// TODO Auto-generated method stub
		try {
			SessionDAO sessionDao = new SessionDAO();
			String offerSessionID = msgObj.getJSONObject("roap").getString("offerSessionId");
			String answerSessionID = msgObj.getJSONObject("roap").getString("answerSessionId");
			
			int roapType = msgObj.getJSONObject("roap").getInt("type");
			
			if(roapType == RoapType.OK){
				System.out.println(session.getOfferSessionID() + " : State[answer], Receive ok!");
				
				//change the session state to 'offer'
				session.setState(new ActiveState());
				
				//cancel the timeout timer
				session.getTimer().cancel();
//				try {
//					RESTClient.Send(session);
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
				//update the session into the DB
				sessionDao.updateStatus(offerSessionID, answerSessionID, SessionStateType.SESSION_STATUS_ACTIVE);		
			} else if (roapType == RoapType.CANDIDATE) {
				if (session.getCaller().equals(msgObj.getString("to"))) {
					if (session.getAnswerIP() == null || session.getAnswerPort() == null) {
						String sdp = msgObj.getJSONObject("roap").getString("sdp");
						String[] parts = sdp.split(" ");
						String ip = parts[4];
						String type = parts[1];
						if (type.contains("1") && !ip.contains("192.168")) {
//							if (session.isIMS()) {
//								session.setAnswerIP(Constants.MEDIA_SERVER_ADDR);
//							}
							session.setAnswerIP(ip);
							String port = parts[5];
							session.setAnswerPort(port);
						}
					}
				}
			} else{
				System.out.println(session.getOfferSessionID() + " : State[answer], Receive other roap " + roapType + " !");
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public String getType() {
		// TODO Auto-generated method stub
		return SessionStateType.SESSION_STATUS_ANSWER;
	}
}
