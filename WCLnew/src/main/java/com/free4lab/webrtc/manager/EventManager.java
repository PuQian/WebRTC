package com.free4lab.webrtc.manager;

import com.webrtc.dao.Event;
import com.webrtc.dao.EventDAO;
import com.webrtc.dao.Session;

import java.sql.Timestamp;
import java.util.List;

import org.apache.log4j.Logger;

/**
 * 会议会话信息管理类
 */

public class EventManager {
	
	private static EventDAO eventDAO = new EventDAO();
	private static final Logger LOGGER = Logger.getLogger(EventManager.class);
	
	public static final String USERNAME = "username";
	public static final String ACCEPTEDTIME = "acceptedTime";
	public static final String EVENTTIME = "eventTime";
	
	/**
	 * 获取accepted_time为空 && event_time在lastLoginTime ~ curLoginTime之间的会话个数
	 * 即离线期间未接的音视频数量
	 */
	
	public static int getRecentMissedMeetingCallsNum(String username, Timestamp lastLoginTime,Timestamp curLoginTime)
	{
		List<Event> list = eventDAO.findByUsernameAndAcceptedTimeNullAndEventTimeBetween(USERNAME,username,ACCEPTEDTIME,EVENTTIME, lastLoginTime, curLoginTime);

		if(list == null || list.size() <= 0)
			return -1;
		else
			return list.size();
	}
}
