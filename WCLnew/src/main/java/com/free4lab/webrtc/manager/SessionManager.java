package com.free4lab.webrtc.manager;


import java.sql.Timestamp;
import java.util.List;

import org.apache.log4j.Logger;



import com.webrtc.dao.Session;
import com.webrtc.dao.SessionDAO;

/**
 * 音视频会话信息管理类
 *
 */
public class SessionManager {
	private static final Logger logger = Logger.getLogger(SessionManager.class);
	private static SessionDAO sessionDAO = new SessionDAO();
	
	public static final String ANSWERER = "answerer";
	public static final String ACCEPTDATE = "acceptDate";
	public static final String CALLDATE = "callDate";
	
	/**
	 * 获取accept_date为空 && call_date在lastLoginTime ~ curLoginTime之间的会话个数
	 * 即离线期间未接的音视频数量
	 */
	
	public static int getRecentMissedMediaCallsNum(String answerer, Timestamp lastLoginTime,Timestamp curLoginTime)
	{
		//List<Session> list = sessionDAO.findByAnswererAndAcceptDateNullAndCallDateBetween("answerer",answerer,"acceptDate","callDate", lastLoginTime, curLoginTime);
		
		List<Session> list = sessionDAO.findByAnswererAndAcceptDateNullAndCallDateBetween(ANSWERER,answerer,ACCEPTDATE,CALLDATE, lastLoginTime, curLoginTime);

		if(list == null || list.size() <= 0)
			return -1;
		else
			return list.size();
	}
}
