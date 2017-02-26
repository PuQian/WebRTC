package com.webrtc.state;

import org.json.JSONObject;

import com.webrtc.domain.WebrtcSession;

public abstract class SessionState {
	public abstract void handleMessage(WebrtcSession session, JSONObject msgObj);
	public abstract String getType();
}
