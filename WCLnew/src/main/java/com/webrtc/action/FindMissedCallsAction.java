package com.webrtc.action;

import org.apache.log4j.Logger;
import java.sql.Timestamp;
import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.manager.EventManager;
import com.free4lab.webrtc.manager.SessionManager;

/**
 * add by yck
 * 查询session表中最近未接来电（音频、视频）数量
 */
public class FindMissedCallsAction extends BaseAction{
	
	private final Logger logger = Logger.getLogger(FindMissedCallsAction.class);
	
	private String answerer;
	private Timestamp lastLoginTime;
	private Timestamp curLoginTime;
	private int missedMediaCallsNum;
	private int missedMeetingCallsNum;
	
	public String execute() throws Exception{
		
		System.out.println("用户："+answerer);
		System.out.println("上次登录时间："+lastLoginTime);
		System.out.println("这次登录时间："+curLoginTime);
		
		missedMediaCallsNum = SessionManager.getRecentMissedMediaCallsNum(answerer, lastLoginTime, curLoginTime);
		missedMeetingCallsNum = EventManager.getRecentMissedMeetingCallsNum(answerer, lastLoginTime, curLoginTime);
		
		return SUCCESS;
	}
	
	public String getAnswerer() {
		return answerer;
	}

	public void setAnswerer(String answerer) {
		this.answerer = answerer;
	}
	public Timestamp getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(Timestamp lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}

	public Timestamp getCurLoginTime() {
		return curLoginTime;
	}

	public void setCurLoginTime(Timestamp curLoginTime) {
		this.curLoginTime = curLoginTime;
	}

	public int getMissedMediaCallsNum() {
		return missedMediaCallsNum;
	}

	public void setMissedMediaCallsNum(int missedMediaCallsNum) {
		this.missedMediaCallsNum = missedMediaCallsNum;
	}

	public int getMissedMeetingCallsNum() {
		return missedMeetingCallsNum;
	}

	public void setMissedMeetingCallsNum(int missedMeetingCallsNum) {
		this.missedMeetingCallsNum = missedMeetingCallsNum;
	}
}
