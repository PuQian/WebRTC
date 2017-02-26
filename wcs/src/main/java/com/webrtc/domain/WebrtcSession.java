package com.webrtc.domain;

import java.util.HashMap;
import java.util.Timer;

import org.cometd.bayeux.server.ServerSession;

import com.webrtc.state.ClosedState;
import com.webrtc.state.SessionState;

public class WebrtcSession {
	private String offerSessionID;
	private String answerSessionID;
	private int seq;
	private String caller;
	private String callee;
	private int stateType;
	private SessionState state;
	private Timer timer;
	private HashMap<String, WebrtcSession> sessions;
	
	private String offerIP;
	private String answerIP;
	private String offerPort;
	private String answerPort;
	private String mediaType;
	private String correlationId;
//	private ServerSession callerClientId;
//	private ServerSession calleeClientId;
	private boolean isIMS;
//	public ServerSession getCallerClientId() {
//		return callerClientId;
//	}
//
//	public void setCallerClientId(ServerSession callerClientId) {
//		this.callerClientId = callerClientId;
//	}

//	public ServerSession getCalleeClientId() {
//		return calleeClientId;
//	}
//
//	public void setCalleeClientId(ServerSession calleeClientId) {
//		this.calleeClientId = calleeClientId;
//	}

	private boolean isCreated;
	
	public WebrtcSession(String offerSessionID){
		this.state = new ClosedState();
		this.offerSessionID = offerSessionID;
		this.timer = new Timer();
	}
	
	public String getOfferSessionID() {
		return offerSessionID;
	}
	public void setOfferSessionID(String offerSessionID) {
		this.offerSessionID = offerSessionID;
	}
	public String getAnswerSessionID() {
		return answerSessionID;
	}
	public void setAnswerSessionID(String answerSessionID) {
		this.answerSessionID = answerSessionID;
	}
	public int getSeq() {
		return seq;
	}
	public void setSeq(int seq) {
		this.seq = seq;
	}
	public String getCaller() {
		return caller;
	}
	public void setCaller(String caller) {
		this.caller = caller;
	}
	public String getCallee() {
		return callee;
	}
	public void setCallee(String callee) {
		this.callee = callee;
	}
	public int getStateType() {
		return stateType;
	}
	public void setStateType(int stateType) {
		this.stateType = stateType;
	}
	public SessionState getState() {
		return state;
	}
	
	public void setState(SessionState state) {
		this.state = state;
	}

	public Timer getTimer() {
		return timer;
	}

	public void setTimer(Timer timer) {
		this.timer = timer;
	}

	public HashMap<String, WebrtcSession> getSessions() {
		return sessions;
	}

	public void setSessions(HashMap<String, WebrtcSession> sessions) {
		this.sessions = sessions;
	}

	public String getOfferIP() {
		return offerIP;
	}

	public void setOfferIP(String offerIP) {
		this.offerIP = offerIP;
	}

	public String getAnswerIP() {
		return answerIP;
	}

	public void setAnswerIP(String answerIP) {
		this.answerIP = answerIP;
	}

	public String getMediaType() {
		return mediaType;
	}

	public void setMediaType(String mediaType) {
		this.mediaType = mediaType;
	}

	public boolean isIMS() {
		return isIMS;
	}

	public void setIMS(boolean isIMS) {
		this.isIMS = isIMS;
	}

	public boolean isCreated() {
		return isCreated;
	}

	public void setCreated(boolean isCreated) {
		this.isCreated = isCreated;
	}

	public String getCorrelationId() {
		return correlationId;
	}

	public void setCorrelationId(String resource) {
		this.correlationId = resource;
	}

	public String getOfferPort() {
		return offerPort;
	}

	public void setOfferPort(String offerPort) {
		this.offerPort = offerPort;
	}

	public String getAnswerPort() {
		return answerPort;
	}

	public void setAnswerPort(String answerPort) {
		this.answerPort = answerPort;
	}
}
