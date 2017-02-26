package com.webrtc.dao;

import java.sql.Timestamp;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class SessionDAO extends AbstractDAO<Session> {

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
	//test
	public long countByProperty(String property, Object value){
    	log("finding " + getClassName() + " instance with property: "
                + property + ", value: " + value, Level.INFO, null);
        try {
            final String queryString = "select count(model)" +
            		" from " + getClassName() + " model" +
            		" where model." + property + "= :propertyValue";
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("propertyValue", value);
            Long count = (Long)query.getSingleResult();
            return count.longValue();
        } catch (RuntimeException re) {
            log("count by property name failed",
                    Level.SEVERE, re);
            throw re;
            
        }
    }
	//caller or callee is username
	public long countByProperty(String firstName, Object firstValue,
			String secondName, Object secondValue) {
		log("finding " + getClassName() + " instance with property1: "
				+ firstName + ", value1: " + firstValue + "; propety2: "
				+ secondName + ", value2: " + secondValue, Level.INFO, null);
		try {
			final String queryString = "select count(model)" + " from "
					+ getClassName() + " model" + " where model." + firstName
					+ "= :value1" + " or model." + secondName + "=:value2";
			Query query = getEntityManager().createQuery(queryString);
			query.setParameter("value1", firstValue);
			query.setParameter("value2", secondValue);
			Long count = (Long) query.getSingleResult();
			return count.longValue();
		} catch (RuntimeException re) {
			log("count by property name2 failed", Level.SEVERE, re);
			  throw re;
		}
	}
	
	//caller or callee is username
		public List<Session> findByUsernameForPage(String propertyName1,final Object value1,String propertyName2,final Object value2
				, int page, int size) {
	        log("finding " + getClassName() + " instance with property: "
	                + propertyName1 + ", value: " + value1+"; propety2: "
	        				+ propertyName2 + ", value2: " + value2, Level.INFO, null);
	        try {
	            final String queryString = "select model from " + getClassName() + " model where model."
	                    + propertyName1 + "= :propertyValue1" + " or model." + propertyName2 + "=:propertyValue2 order by model.callDate desc";
	            Query query = getEntityManager().createQuery(queryString);
	            query.setParameter("propertyValue1", value1);
	            query.setParameter("propertyValue2", value2);
	            //setMaxResults设置返回记录的总数；setFirstResult设置记录开始的位置
	            query.setMaxResults(size).setFirstResult(page * size);
	            return query.getResultList();
	        } catch (RuntimeException re) {
	            log("find by property name failed",
	                    Level.SEVERE, re);  
	            throw re;
	        }
	    }
	
		public static void main(String[] args) {
		SessionDAO sessionDAO = new SessionDAO();
//		long count = sessionDAO.countByProperty("offerer","webrtc10-163.com@WebRTC","answerer","webrtc1-163.com@WebRTC");
//		if(count==0){
//			System.out.println("count is zero or something error!");
//		}
//		else{
//			System.out.println(count);
//		}
		List<Session> results = sessionDAO.findByUsernameForPage("offerer","webrtc10-163.com@WebRTC", "answerer","webrtc1-163.com@WebRTC",1,1);
		if(results == null | results.size()==0){
			System.out.println("no groups or something error!");
		}
		else
			System.out.println(results.get(0).getAcceptDate());
		    /*2016-04-12 16:40:36.0*/
	}
		
	/**
	 * add by yck
	 * 根据属性property1 = value1 && propertyName2 = null && propertyName3的区间value2-value3 查询记录	
	 */
	@SuppressWarnings("unchecked")
	public  List<Session> findByAnswererAndAcceptDateNullAndCallDateBetween(String propertyName1,final Object value1, String propertyName2,String propertyName3,final Object value2,final Object value3)
	{
		log("finding " + getClassName() + " instance with property: " + propertyName1 +", value1: "+ value1 +" and property: "
				+ propertyName2 + ", value2: " + value2 + ", value3: " + value3, Level.INFO, null);
		try 
		{
			final String queryString = "select model from " + getClassName() + " model where model."+ propertyName1 +" = :value1 and model."+ propertyName2 + " is null and model." + propertyName3
					+ " >= :value2" + " and model." + propertyName3 + " <= :value3 and model.status != 'closed'";
			
			System.out.println("查询语句是："+queryString);
			Query query = getEntityManager().createQuery(queryString);
			query.setParameter("value1", value1);
			query.setParameter("value2", value2);
			query.setParameter("value3", value3);
			return query.getResultList();
		} 
		catch (RuntimeException re) 
		{
			log("find by property between value2 and value3 failed", Level.SEVERE, re);
			throw re;
		}
	}
		
}