package com.webrtc.dao;

import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;

public class EaseFriendDAO extends AbstractDAO<EaseFriend>{
	
    @Override
    public Class<EaseFriend> getEntityClass() {
        return EaseFriend.class;
    }

    @Override
    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }

    @Override
    public String getPUName() {
        return "WebrtcDemoPU";
    }
    
    /**
     * add by pq
     * 根据hostname查询好友列表
     * @param factory 
     */
    @SuppressWarnings("unchecked")
    public  List<EaseFriend> findfriendsbyHostName(String propertyName1,final Object value1)
    {
        log("finding " + getClassName() + " instance with property: " + propertyName1 +", value1: "+ value1 , Level.INFO, null);
        try 
        {
            final String queryString = "select model from " + getClassName() + " model "+
                "where model."+ propertyName1 +" = :value1";
            System.out.println("查询语句是："+queryString);
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("value1", value1);
            return query.getResultList();
        } 
        catch (RuntimeException re) 
        {
            log("find by property between value2 and value3 failed", Level.SEVERE, re);
            throw re;
        }
    }
    /**
     * add by pq
     * 根据id查询好友列表
     */
    @SuppressWarnings("unchecked")
    public  List<EaseFriend> findfriendsbyIds(String propertyName, List<Integer> ids){
    	if(ids.size() == 0){
			getLogger().info("values.size() == 0");
			return (new ArrayList<EaseFriend>());
		}
    	log("finding " + getClassName() + " instance with property: " + propertyName +", value: "+ ids , Level.INFO, null);
    	String queryString = "select model from " + getClassName() + " model where ";    
    	for(int i = 0; i< ids.size(); i++){
				if(i == 0){
					queryString += "model." + propertyName + " = " + ids.get(i);
				}else{
					queryString += " or model." + propertyName + " = " + ids.get(i);
				}
			}
			try {
				System.out.println("查询语句是："+queryString);
				Query query = getEntityManager().createQuery(queryString);
				return query.getResultList();
			}catch (RuntimeException re) {

	            throw re;
	        }
    }
    /*
     * add by pq
     * 根据hostname和friendname删除记录
     */
    @SuppressWarnings("unchecked")
    public void delFriendbyhostnameAndfriendname(String hostname,String friendname){
    	log("del easefriend by hostname: " + hostname + " and friendname:" + friendname, Level.INFO, null);
    	try{
        	final String queryString = "delete from " + getClassName() + " model where "+
         	       "model.hostname = :hostname and model.friendname = :friendname";
        	
        	EntityManagerFactory factory=Persistence.createEntityManagerFactory("WebrtcDemoPU");
        	EntityManager em=factory.createEntityManager();
        	em.getTransaction().begin();//开启事务

        	Query query = em.createQuery(queryString);
        	query.setParameter("hostname", hostname);
        	query.setParameter("friendname", friendname);
        	query.executeUpdate();
        	
        	em.getTransaction().commit();
        	em.close();
        	factory.close();
    	}
    	catch(RuntimeException re){
    		throw re;
    	}
    }
   
    /*
     * 添加好友记录(添加前先查询是否存在该记录，避免重复添加)
     */
    @SuppressWarnings("unchecked")
    public void addEaseFriend(String hostname,String friendname){
    	log("add easefriend by hostname:" + hostname + "and friendname:" + friendname,Level.INFO, null);
    	try{
    		EaseFriendDAO easefriend = new EaseFriendDAO();
    		List<EaseFriend> Record = easefriend.findEaseRecordByHostnameandFriendname(hostname,friendname);
    		if(!Record.isEmpty())  return;
    		
    		EaseFriendDAO easefrienddao = new EaseFriendDAO();
    		EaseFriend newRow = new EaseFriend();

    		newRow.setHostname(hostname);
    		newRow.setFriendname(friendname);
    		
    		easefrienddao.save(newRow);
    	}
    	catch(RuntimeException re){
    		throw re;
    	}
    }
    
    @SuppressWarnings("unchecked")
    public List<EaseFriend> findEaseRecordByHostnameandFriendname(String hostname,String friendname){
    	try{
    		String queryString = "select model from " + getClassName() + " model " +
    		       "where model.hostname = :hostname and model.friendname = :friendname";
    		Query query = getEntityManager().createQuery(queryString);
    		query.setParameter("hostname",hostname);
    		query.setParameter("friendname",friendname);
    		return query.getResultList();
    	}
    	catch(RuntimeException re){
    		throw re;
    	}
    }
    
    public static void main(String[] args){
//    	EaseFriendDAO friendDAO = new EaseFriendDAO();
//    	friendDAO.delFriendbyhostnameAndfriendname("webrtc4-163.com", "webrtc10-163.com");      
    	EaseFriendDAO friendDAO = new EaseFriendDAO();
    	friendDAO.addEaseFriend("webrtc4-163.com", "webrtc10-163.com");    
    }
}
