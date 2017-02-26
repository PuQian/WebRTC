package com.webrtc.dao;

import java.sql.Timestamp;
import java.util.List;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class SessionDAO extends AbstractDAO<Session>{

	@Override
	public Class getEntityClass() {
		return Session.class;
	}

	public static final String PU_NAME = "WebrtcDemoPU";
	public static final String DEFAULT_ANSWER_SESSION_ID = "default";
	@Override
	public String getPUName() {
		return PU_NAME;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}
	
	public String getClassName() {
		return getEntityClass().getName();
	}
	
	public Session create(String offerer, String answerer, String offerSessionID,
			String answerSessionID, String status, Long seq,
			Timestamp callDate, Timestamp acceptDate, Timestamp byeDate){
		List<Session> sessionList = findByProperty2("offerSessionID", offerSessionID, "answerSessionID", DEFAULT_ANSWER_SESSION_ID);
		Session instance;
		if(sessionList.size() == 0)
		{
			System.out.println("新的session，生成offerer:"+offerer+"----->answerer:"+answerer);
			instance = new Session(offerer, answerer, offerSessionID, answerSessionID, status, seq, callDate, acceptDate, byeDate);
			save(instance);
		} 
		else
		{
			System.out.println("旧的session，取出");
			instance = sessionList.get(0);
		}
		
		return instance;
	}
	
	/**
	 * 呼叫时接收到answer时更新answerSessionID和acceptDate
	 * @param offerSessionID
	 * @param answerSessionID  
	 * @param acceptDate
	 * @return
	 * @throws IllegalArgumentException 
	 */
	public Session updateAnswerSessionID(String offerSessionID, String answerSessionID, Timestamp acceptDate) throws IllegalArgumentException{
		List<Session> sessionList = findByProperty2("offerSessionID", offerSessionID, "answerSessionID", DEFAULT_ANSWER_SESSION_ID);
		//需要answerSessionID和acceptDate
		if(sessionList.size() == 1){			
			Session session = sessionList.get(0);
			session.setAnswerSessionID(answerSessionID);
			session.setAcceptDate(acceptDate);
			update(session);
			return session;
			
		}
		//可能其他的wcs的sessionDao已经操作了数据库
		else if(sessionList.size() == 0){			
			
			List<Session> sessionList2 = findByProperty2("offerSessionID", offerSessionID, "answerSessionID", answerSessionID);
			//直接返回即可
			if(sessionList2.size() == 1){			
				Session session = sessionList2.get(0);
				return session;
				
			}
			else //异常情况
			{
				throw new IllegalArgumentException("can not find session by offersessionID: " + offerSessionID);
			}
		}
		else //异常情况
		{
			throw new IllegalArgumentException("can not find session by offersessionID: " + offerSessionID);
		}	
	}
	
	public void updateStatus(String offerSessionID, String answerSessionID, String status){
		List<Session> sessionList = findByProperty2("offerSessionID", offerSessionID, "answerSessionID", answerSessionID);
		if(sessionList.size() != 1){
			throw new IllegalArgumentException("can not find session by offersessionID: " + offerSessionID);
		}
		System.out.println("更新更新更新");
		Session session = sessionList.get(0);
//		Session session = findByPrimaryKey(new SessionPK(offerSessionID, answerSessionID));
		session.setStatus(status);
		update(session);
	}
	
	public String findStatus(String offerSessionID, String answerSessionID){
		List<Session> sessionList = findByProperty2("offerSessionID", offerSessionID, "answerSessionID", answerSessionID);
		if(sessionList.size() != 1){
			throw new IllegalArgumentException("can not find session by offersessionID: " + offerSessionID);
		}
		Session session = sessionList.get(0);
//		Session session = findByPrimaryKey(new SessionPK(offerSessionID, answerSessionID));
		return session.getStatus();
		//update(session);
	}
	
	
	public void updateShutdownTime(String offerSessionID, Timestamp ts){
		List<Session> sessionList = findByProperty("offerSessionID", offerSessionID);
		if(sessionList.size() != 1){
			throw new IllegalArgumentException("can not find session by offersessionID: " + offerSessionID);
		}
		Session session = sessionList.get(0);
		session.setByeDate(ts);
		update(session);
	}
	
	public void updateStatus(String offerSessionID, String status){
		List<Session> sessionList = findByProperty("offerSessionID", offerSessionID);
		if(sessionList.size() != 1){
			throw new IllegalArgumentException("can not find session by offersessionID: " + offerSessionID);
		}
		Session session = sessionList.get(0);
//		Session session = findByPrimaryKey(new SessionPK(offerSessionID, answerSessionID));
		session.setStatus(status);
		update(session);
	}
	
	public static void main(String args[]){
    	SessionDAO sessionDAO = new SessionDAO();
   // 	Session session = sessionDAO.create("liu", "ming", "123456", "default", "bew", (long) 1, null, null, null);
    	sessionDAO.updateAnswerSessionID("123456", "654321", Util.currentTime());
    	sessionDAO.updateStatus("123456", "654321", "newoffer");
	}
}