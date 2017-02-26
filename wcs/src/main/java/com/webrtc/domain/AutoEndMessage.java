package com.webrtc.domain;

import org.json.JSONException;
import org.json.JSONObject;
public class AutoEndMessage {

	private JSONObject msgObj= null;
	private final int END = 3; //SessionStateType.END
	
	public AutoEndMessage(String from) {
		
		try {
			this.msgObj = new JSONObject();
			this.msgObj.put("from", from);
			this.msgObj.put("status", END); //强行置为终结
		} catch (JSONException e) {

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
