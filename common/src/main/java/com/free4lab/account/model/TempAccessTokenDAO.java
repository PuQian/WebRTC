package com.free4lab.account.model;

import java.util.List;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class TempAccessTokenDAO extends AbstractDAO<AccessToken> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<AccessToken> getEntityClass() {
        return AccessToken.class;
    }
    public static final String PU_NAME = "AccountPU";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }
    
    @SuppressWarnings("unchecked")
	public List<AccessToken> findByAccessTokenMiddle(String accessToken) {
        try {
            final String queryString = "select model from " + getClassName() + " model where model.access_token like '________" + accessToken + "________' order by model.begin_time desc ";
            Query query = getEntityManager().createQuery(queryString);
            return query.getResultList();
        } catch (RuntimeException re) {
            throw re;
        }
    }
//    //通过email查找accesstoken值
//    @SuppressWarnings("unchecked")
//	public  List<String> findToken(String email){
//    	try{
//    		
//    	    final String queryString = "select access_token from" + getClassName()+"where user_id = "+email;
//            Query query = getEntityManager().createQuery(queryString);
//            return query.getResultList();
//    	}
//    	catch(RuntimeException re){
//    		throw re;
//    	}
//    }
        
//    //通过uesr_id(邮箱)删除数据库里的记录
//        public void deleteToken(String email){
//        try{
//              final String queryString = "delete from access_token where user_id ="+email;        
//              Query query = getEntityManager().createQuery(queryString);
//        }
//        catch(RuntimeException re){
//            throw re;
//        }
//       }
}
