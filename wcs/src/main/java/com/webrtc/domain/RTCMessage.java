package com.webrtc.domain;

import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.common.RTCMessageType;
import com.webrtc.common.RoapType;

public class RTCMessage {
	private JSONObject msgObj= null;
	private JSONObject roapObj = null;

	public RTCMessage(String offerSessionID, String from, String to, int errorType) {
		// TODO Auto-generated constructor stub
		try {
			this.msgObj = new JSONObject();
			this.msgObj.put("type", RTCMessageType.SESSION_REFUSE);
			this.msgObj.put("from", from);
			this.msgObj.put("to", to);
			this.msgObj.put("sessionID", offerSessionID);
		
			
			this.roapObj = new JSONObject();
			this.roapObj.put("type", RoapType.ERROR);
			this.roapObj.put("offerSessionId", offerSessionID);
			this.roapObj.put("error", errorType);

			
			this.msgObj.put("roap", this.roapObj);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
	
	public JSONObject getJSONObject(){
		return msgObj;
	}

	public String toString(){
		return this.msgObj.toString();
	}
}
