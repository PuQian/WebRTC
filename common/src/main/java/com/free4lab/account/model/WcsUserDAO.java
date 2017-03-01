package com.free4lab.account.model;

import java.util.List;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class WcsUserDAO extends AbstractDAO<WcsUser> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<WcsUser> getEntityClass() {
        return WcsUser.class;
    }
    public static final String PU_NAME = "AccountPU";
    public static final String USER_ID = "user_id";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }
    
    @SuppressWarnings("unchecked")
	public List<WcsUser> findByAccessTokenMiddle(String accessToken) {
        try {
            final String queryString = "select model from " + getClassName() + " model where model.access_token like '________" + accessToken + "________' order by model.begin_time desc ";
            Query query = getEntityManager().createQuery(queryString);
            return query.getResultList();
        } catch (RuntimeException re) {
            throw re;
        }
    }
    
    public List<WcsUser> findByUser_Id(Object user_id
    		) {
    			return findByProperty(USER_ID,user_id
    			);
    		}
    
}
