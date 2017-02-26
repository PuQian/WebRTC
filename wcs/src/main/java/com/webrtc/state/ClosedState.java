package com.webrtc.state;

import java.sql.Timestamp;
import java.util.Date;
import org.json.JSONException;
import org.json.JSONObject;
import com.webrtc.common.RoapType;
import com.webrtc.common.SessionStateType;
import com.webrtc.dao.SessionDAO;
import com.webrtc.dao.UserDAO;
import com.webrtc.domain.WebrtcSession;

public class ClosedState extends SessionState{

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
			if(roapType == RoapType.OFFER){
				System.out.println(session.getOfferSessionID() + " : State[closed], Receive offer!");
				session.setCaller(from);
				session.setCallee(to);
				if (to.contains("@ims-core.com")) {
					session.setIMS(true);
				}
				String sdp = msgObj.getJSONObject("roap").getString("sdp"); 
				if (sdp.contains("video")) {
					session.setMediaType("video");
				} else if (sdp.contains("audio")) {
					session.setMediaType("audio");
				}

					
				//change the session state to 'offer'
				session.setState(new OfferState());
				//save the new session into the DB
				Long seq = msgObj.getJSONObject("roap").getLong("seq");
				Date date = new Date();
				Timestamp ts = new Timestamp(date.getTime());
				sessionDao.create(from, to, offerSessionID, SessionDAO.DEFAULT_ANSWER_SESSION_ID, SessionStateType.SESSION_STATUS_OFFER, seq, ts, null, null);
				System.out.println("session被写入了！！！！！！from:"+from+"----->to:"+to);
				//update the caller state
				userDao.updateStatus(from, UserDAO.USER_STATUS_BUSY);
			} else{
				System.out.println(session.getOfferSessionID() + " : State[closed], Receive other roap " + roapType + " !");
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public String getType() {
		// TODO Auto-generated method stub
		return SessionStateType.SESSION_STATUS_CLOSED;
	}
}
