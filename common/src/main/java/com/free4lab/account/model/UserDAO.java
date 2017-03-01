package com.free4lab.account.model;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class UserDAO extends AbstractDAO<User> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<User> getEntityClass() {
        return User.class;
    }
    public static final String PU_NAME = "AccountPU";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }
    
    @SuppressWarnings("unchecked")
	public List<User> findUsersByIds(String propertyName, List<Integer> values){
		if(values.size() == 0){
			getLogger().info("values.size() == 0");
			return (new ArrayList<User>());
		}
		getLogger().info("finding " + getClassName() + " instance with property: "
                + propertyName + ", values: " + values.toString());
		String queryString = "select model from " + getClassName() + " model where "; 
		for(int i = 0; i< values.size(); i++){
			if(i == 0){
				queryString += "model." + propertyName + " = " + values.get(i);
			}else{
				queryString += " or model." + propertyName + " = " + values.get(i);
			}
		}
		try {
			Query query = getEntityManager().createQuery(queryString);
			return query.getResultList();
		}catch (RuntimeException re) {
            log("find users by Ids failed", Level.SEVERE, re);
            throw re;
        }
	}
    
    /* 根据 email查询 uid 2016-10*/
    @SuppressWarnings("unchecked")
    public int searchUidByEmail(String email){
    	getLogger().info("finding " + getClassName() + " instance with property: "
                + "email" + ", values: " + email);
		String queryString = "select uid from " + getClassName() + " model where "+
                "email = :value1";
		Query query = getEntityManager().createQuery(queryString);
		query.setParameter("value1", email);
		return (Integer) query.getSingleResult();
    }
    
    @SuppressWarnings("unchecked")
	public List<User> findUserById(String propertyName, Integer value){
    	getLogger().info("finding " + getClassName() + " instance with property: "
                + propertyName + ", value: " + value.toString());
    	String queryString = "select model from " + getClassName() + " model where "
    			+ " model." + propertyName + " = " + value; 
    	try {
			Query query = getEntityManager().createQuery(queryString);
			return query.getResultList();
		}catch (RuntimeException re) {
            log("find users by Ids failed", Level.SEVERE, re);
            throw re;
        }
    }

	@SuppressWarnings("unchecked")
	public List<User> findByProperty3(String name1, String email, String name2,
			String screenName, String name3, String company) {
		getLogger().info("finding " + getClassName() + " instance with property " + name1 + ","
				+ name2 +" and " + name3 + ", values: " + email + "," + screenName +","
				+ company);
		String queryString = "select model from " + getClassName() + " model where "; 
		
		if(!email.equalsIgnoreCase("")){
			queryString += "model." + name1 + " like :propertyValue1";
		}
		
		if(email.equalsIgnoreCase("") && !screenName.equalsIgnoreCase("")){
			queryString += "model." + name2 + " like :propertyValue2";
		}else if(!screenName.equalsIgnoreCase("")){
			queryString += " and model." + name2 + " like :propertyValue2";
		}
		if(email.equalsIgnoreCase("") && screenName.equalsIgnoreCase("") 
				&& !company.equalsIgnoreCase("")){
			queryString += "model." + name3 + " like :propertyValue3";
		}else if(!company.equalsIgnoreCase("")){
			queryString += " and model." + name3 + " like :propertyValue3";
		}
		getLogger().info(queryString);
		
		try {
			Query query = getEntityManager().createQuery(queryString);
			if(!email.equalsIgnoreCase("")){
				query.setParameter("propertyValue1", "%" + email + "%");
			}
			if(!screenName.equalsIgnoreCase("")){
				query.setParameter("propertyValue2", "%" + screenName + "%");
			}
			if(!company.equalsIgnoreCase("")){
				query.setParameter("propertyValue3", "%" + company + "%");
			}
			return query.getResultList();
		}catch (RuntimeException re) {
            log("findByProperty3 failed", Level.SEVERE, re);
            throw re;
        }
	}

	@SuppressWarnings("unchecked")
	public List<User> findByProperty3ByPage(String name1, String email, String name2,
			String screenName, String name3, String company, int page, int pageSize) {
		getLogger().info("finding " + getClassName() + " instance with property " + name1 + ","
				+ name2 +" and " + name3 + ", values: " + email + "," + screenName +","
				+ company);
		String queryString = "select model from " + getClassName() + " model where "; 
		
		if(!email.equalsIgnoreCase("")){
			queryString += "model." + name1 + " like :propertyValue1";
		}
		
		if(email.equalsIgnoreCase("") && !screenName.equalsIgnoreCase("")){
			queryString += "model." + name2 + " like :propertyValue2";
		}else if(!screenName.equalsIgnoreCase("")){
			queryString += " and model." + name2 + " like :propertyValue2";
		}
		if(email.equalsIgnoreCase("") && screenName.equalsIgnoreCase("") 
				&& !company.equalsIgnoreCase("")){
			queryString += "model." + name3 + " like :propertyValue3";
		}else if(!company.equalsIgnoreCase("")){
			queryString += " and model." + name3 + " like :propertyValue3";
		}
		getLogger().info(queryString);
		
		try {
			Query query = getEntityManager().createQuery(queryString);
			if(!email.equalsIgnoreCase("")){
				query.setParameter("propertyValue1", "%" + email + "%");
			}
			if(!screenName.equalsIgnoreCase("")){
				query.setParameter("propertyValue2", "%" + screenName + "%");
			}
			if(!company.equalsIgnoreCase("")){
				query.setParameter("propertyValue3", "%" + company + "%");
			}
			query.setMaxResults(pageSize).setFirstResult((page-1) *pageSize);
			return query.getResultList();
		}catch (RuntimeException re) {
            log("findByProperty3 failed", Level.SEVERE, re);
            throw re;
        }
	}
	
	@SuppressWarnings("unchecked")
	public List<User> findByProperty4ByPage(String name1, String email, String name2,
			String realName, String name3, String company,String name4, String description, int page, int pageSize) {
		getLogger().info("finding " + getClassName() + " instance with property " + name1 + ","
				+ name2 +"," + name3 + " and" + name4 + ", values: " + email + "," + realName +","
				+ company + description);
		String queryString = "";
		if(email.equalsIgnoreCase("") && realName.equalsIgnoreCase("") 
				&& company.equalsIgnoreCase("") && description.equalsIgnoreCase("")){
			queryString = "select model from " + getClassName() + " model"; 
		}else{
			queryString = "select model from " + getClassName() + " model where "; 
		}
		
		if(!email.equalsIgnoreCase("")){
			queryString += "model." + name1 + " like :propertyValue1";
		}
		
		if(email.equalsIgnoreCase("") && !realName.equalsIgnoreCase("")){
			queryString += "model." + name2 + " like :propertyValue2";
		}else if(!realName.equalsIgnoreCase("")){
			queryString += " and model." + name2 + " like :propertyValue2";
		}
		if(email.equalsIgnoreCase("") && realName.equalsIgnoreCase("") 
				&& !company.equalsIgnoreCase("")){
			queryString += "model." + name3 + " like :propertyValue3";
		}else if(!company.equalsIgnoreCase("")){
			queryString += " and model." + name3 + " like :propertyValue3";
		}
		if(email.equalsIgnoreCase("") && realName.equalsIgnoreCase("") 
				&& company.equalsIgnoreCase("") && ! description.equalsIgnoreCase("")){
			queryString += "model." + name4 + " like :propertyValue4";
		}else if(!description.equalsIgnoreCase("")){
			queryString += " and model." + name4 + " like :propertyValue4";
		}
		
		getLogger().info(queryString);
		
		try {
			Query query = getEntityManager().createQuery(queryString);
			if(!email.equalsIgnoreCase("")){
				query.setParameter("propertyValue1", "%" + email + "%");
			}
			if(!realName.equalsIgnoreCase("")){
				query.setParameter("propertyValue2", "%" + realName + "%");
			}
			if(!company.equalsIgnoreCase("")){
				query.setParameter("propertyValue3", "%" + company + "%");
			}
			if(!description.equalsIgnoreCase("")){
				query.setParameter("propertyValue4", "%" + description + "%");
			}
			query.setMaxResults(pageSize).setFirstResult((page-1) *pageSize);
			return query.getResultList();
		}catch (RuntimeException re) {
            log("findByProperty4ByPage failed", Level.SEVERE, re);
            throw re;
        }
	}
	
	@SuppressWarnings("unchecked")
	public List<User> findByProperty4(String name1, String email, String name2,
			String realName, String name3, String company,String name4, String description) {
		getLogger().info("finding " + getClassName() + " instance with property " + name1 + ","
				+ name2 +"," + name3 + " and " + name4 + ", values: " + email + "," + realName +","
				+ company + description);
		String queryString = "";
		if(email.equalsIgnoreCase("") && realName.equalsIgnoreCase("") 
				&& company.equalsIgnoreCase("") && description.equalsIgnoreCase("")){
			queryString = "select model from " + getClassName() + " model"; 
		}else{
			queryString = "select model from " + getClassName() + " model where "; 
		}
		
		if(!email.equalsIgnoreCase("")){
			queryString += "model." + name1 + " like :propertyValue1";
		}
		
		if(email.equalsIgnoreCase("") && !realName.equalsIgnoreCase("")){
			queryString += "model." + name2 + " like :propertyValue2";
		}else if(!realName.equalsIgnoreCase("")){
			queryString += " and model." + name2 + " like :propertyValue2";
		}
		if(email.equalsIgnoreCase("") && realName.equalsIgnoreCase("") 
				&& !company.equalsIgnoreCase("")){
			queryString += "model." + name3 + " like :propertyValue3";
		}else if(!company.equalsIgnoreCase("")){
			queryString += " and model." + name3 + " like :propertyValue3";
		}
		if(email.equalsIgnoreCase("") && realName.equalsIgnoreCase("") 
				&& company.equalsIgnoreCase("") && ! description.equalsIgnoreCase("")){
			queryString += "model." + name4 + " like :propertyValue4";
		}else if(!description.equalsIgnoreCase("")){
			queryString += " and model." + name4 + " like :propertyValue4";
		}
		
		getLogger().info(queryString);
		try {
			Query query = getEntityManager().createQuery(queryString);
			if(!email.equalsIgnoreCase("")){
				query.setParameter("propertyValue1", "%" + email + "%");
			}
			if(!realName.equalsIgnoreCase("")){
				query.setParameter("propertyValue2", "%" + realName + "%");
			}
			if(!company.equalsIgnoreCase("")){
				query.setParameter("propertyValue3", "%" + company + "%");
			}
			if(!description.equalsIgnoreCase("")){
				query.setParameter("propertyValue4", "%" + description + "%");
			}
			return query.getResultList();
		}catch (RuntimeException re) {
            log("findByProperty4 failed", Level.SEVERE, re);
            throw re;
        }
	}
}
