package com.webrtc.common;

public interface RTCMessageType{
	public static final int REGISTER = 1;
	public static final int SESSION_INITIATE = 2;
	public static final int SESSION_REFUSE = 3;
	public static final int SESSION_BYE = 4;
	public static final int SESSION_ACK = 5;
	public static final int HEARTBEAT = 6;
}
