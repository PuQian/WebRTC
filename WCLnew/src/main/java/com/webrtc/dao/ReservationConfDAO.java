package com.webrtc.dao;


import java.security.PublicKey;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;
import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;
import com.webrtc.dao.ReservationConf;

public class ReservationConfDAO extends AbstractDAO<ReservationConf>{
	
	@Override
	public Class getEntityClass() {
		return ReservationConf.class;
	}

	public static final String PU_NAME = "MeetingPU";
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
	public String getConfMemberName(){
		return ConfMember.class.getName();
	}
	/**
	 * add by pq
	 * "creator",username,"members",page,size
	 * 查询会议召开记录，第page页的size条记录
	 */
	@SuppressWarnings("unchecked")
	public List<ReservationConf> findMeetinghistorybyusername
	    (String propertyName1, String username, String propertyName2, int page, int size){
		log("finding " + getClassName() + " instance with property: " + propertyName1 +", creator: "+ username +" and property: "
				+ propertyName2 + ", members: " + username, Level.INFO, null);
		try{

			  final String queryString = "select model from " + getClassName() +" model "+
			        "where (model.valid = 0 and (model." + propertyName1 +" = :username "+
					"or model."+ propertyName2 +" like '%"+ username +"%')) "+
			        "order by model.reservation_time desc";
			  
					System.out.println("查询语句是："+queryString);
					Query query = getEntityManager().createQuery(queryString);
			        query.setParameter("username", username);
			        query.setMaxResults(size).setFirstResult(page * size);
					return query.getResultList();
					  
		}
		catch (RuntimeException re) 
		{
			log("find by property between value1 and value2 failed", Level.SEVERE, re);
			throw re;
		}
	}
	/**
	 * 查询历史会议的总数目 add by pq
	 * @param username
	 * @return
	 */
	public long countMeetingHistoryByMembers(String username){
		log("finding " + getClassName() + " where " + username, Level.INFO, null);
		try{
			 final String queryString = "select count(model) from " + getClassName() +" model "+
				        "where model.valid = 0 and ( model.creator = :username "+
					    "or model.members like '%"+ username+ "%')";
				  
						System.out.println("查询语句是："+queryString);
						Query query = getEntityManager().createQuery(queryString);
				        query.setParameter("username", username);
				        Long count = (Long) query.getSingleResult();
						return count.longValue();
		}
		catch (RuntimeException re) 
		{
			log("find by property between value1", Level.SEVERE, re);
			throw re;
		}
	}
	/**
	 * add by pq
	 * 我的会议：creator或members存在该用户且valid值为1; conf_member中存在该用户；
	 */
	@SuppressWarnings("unchecked")
	public List<ReservationConf> findMymeetingbyusername
	    ( String propertyName1, final Object username, String propertyName2,
	      int page, int size){
		log("finding " + getClassName() + " instance with property: " + propertyName1 +", creator: "+ username +" and property: "
				+ propertyName2 + ", members: " + username, Level.INFO, null);
		try{

			  final String queryString = "select model from " + getClassName()+ " model"+
				    " where ((model.valid = 1" +
				    " and (model." + propertyName1 + " = :username" + 
				    " or model."+ propertyName2 + " like '%"+ username +"%'))"+
				    " or (model.roomid in (select model.id from "+ getConfMemberName()+ " model "+
				    "where model.member = :username))) order by model.reservation_time asc";
					System.out.println("查询语句是："+queryString);
					Query query = getEntityManager().createQuery(queryString);
			        query.setParameter("username", username);
			        query.setMaxResults(size).setFirstResult(page * size);
					return query.getResultList();
		}
		catch (RuntimeException re) 
		{
			log("find by property between value1 and value2 failed", Level.SEVERE, re);
			throw re;
		}
	}
	public long countMymeetingbyusername(String username){
		log("finding " + getClassName() + " instance with creator: "+ username  + ", members: " + username, Level.INFO, null);
		try{

			  final String queryString = "select count(model) from " + getClassName()+ " model"+
				    " where ((model.valid = 1" +
				    " and (model.creator = :username" + 
				    " or model.members like '%"+ username +"%'))"+
				    " or (model.roomid in (select model.id from "+ getConfMemberName()+ " model "+
				    "where model.member = :username)))";
					System.out.println("查询语句是："+queryString);
					Query query = getEntityManager().createQuery(queryString);
			        query.setParameter("username", username);
			        Long count = (Long) query.getSingleResult();
					return count.longValue();
					  
		}
		catch (RuntimeException re) 
		{
			log("find by property between value1 and value2 failed", Level.SEVERE, re);
			throw re;
		}
	}
	public static void main(String[] args){
		 ReservationConfDAO ResDAO = new ReservationConfDAO();
		 List<ReservationConf> result = ResDAO.findMeetinghistorybyusername("creator", "webrtc1-163.com@WebRTC", "members", 1, 10);
		 System.out.println(result.get(0).getConfname());
	}
	
}

