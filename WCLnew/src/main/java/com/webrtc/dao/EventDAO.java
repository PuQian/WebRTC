package com.webrtc.dao;

import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;

public class EventDAO extends AbstractDAO<Event>{

	
	@Override
	public Class<Event> getEntityClass() {
		return Event.class;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

	@Override
	public String getPUName() {
		return "MeetingPU";
	}
	
	/**
	 * add by yck
	 * 根据属性property1 = value1 && propertyName2 = null && propertyName3的区间value2-value3 查询记录	
	 */
	@SuppressWarnings("unchecked")
	public  List<Event> findByUsernameAndAcceptedTimeNullAndEventTimeBetween(String propertyName1,final Object value1, String propertyName2,String propertyName3,final Object value2,final Object value3)
	{
		log("finding " + getClassName() + " instance with property: " + propertyName1 +", value1: "+ value1 +" and property: "
				+ propertyName2 + ", value2: " + value2 + ", value3: " + value3, Level.INFO, null);
		try 
		{
			final String queryString = "select model from " + getClassName() + " model where model."+ propertyName1 +" = :value1 and model."+ propertyName2 + " is null and model." + propertyName3
					+ " >= :value2" + " and model." + propertyName3 + " <= :value3";
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
