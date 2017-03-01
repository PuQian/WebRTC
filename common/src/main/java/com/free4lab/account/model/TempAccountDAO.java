package com.free4lab.account.model;

import java.util.List;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class TempAccountDAO extends AbstractDAO<TempAccount> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<TempAccount> getEntityClass() {
        return TempAccount.class;
    }
    public static final String PU_NAME = "AccountPU";
	public static final String TEMP_NAME= "temp_name";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }
    
    @SuppressWarnings("unchecked")
	public List<TempAccount> findByAccessTokenMiddle(String accessToken) {
        try {
            final String queryString = "select model from " + getClassName() + " model where model.access_token like '________" + accessToken + "________' order by model.begin_time desc ";
            Query query = getEntityManager().createQuery(queryString);
            return query.getResultList();
        } catch (RuntimeException re) {
            throw re;
        }
    }
    
    public List<TempAccount> findByTemp_Name(Object temp_name
    		) {
    			return findByProperty(TEMP_NAME,temp_name
    			);
    		}
}
