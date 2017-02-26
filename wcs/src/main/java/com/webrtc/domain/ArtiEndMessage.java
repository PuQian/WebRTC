package com.webrtc.domain;

import org.json.JSONException;
import org.json.JSONObject;
public class ArtiEndMessage {

	private JSONObject msgObj= null;
	private final int END = 2; //ActionType.END
	
	public ArtiEndMessage(String from) {
		
		try {
			this.msgObj = new JSONObject();
			this.msgObj.put("from", from);
			this.msgObj.put("action", END);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public JSONObject getMsgObj() {
		return msgObj;
	}

	public void setMsgObj(JSONObject msgObj) {
		this.msgObj = msgObj;
	}
}
