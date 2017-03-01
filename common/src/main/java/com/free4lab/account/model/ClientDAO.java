package com.free4lab.account.model;

import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class ClientDAO extends AbstractDAO<Client> {
	public String getClassName() {
        return getEntityClass().getName();
    }
 
    public Class<Client> getEntityClass() {
        return Client.class;
    }
    public static final String PU_NAME = "AccountPU";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }
    
    @SuppressWarnings("unchecked")
	public List<Client> findClientByIds(List<Integer> values){
    	if(values.size() == 0){
    		return null; //Collections.emptyList();
    	}
    	getLogger().info("finding " + getClassName() + " instance with property: id"
                + ", values: " + values.toString());
		String queryString = "select model from " + getClassName() + " model where "; 
		for(int i = 0; i< values.size(); i++){
			if(i == 0){
				queryString += "model.id" + " = " + values.get(i);
			}else{
				queryString += " or model.id" + " = " + values.get(i);
			}
		}
		try {
			Query query = getEntityManager().createQuery(queryString);
			return query.getResultList();
		}catch (RuntimeException re) {
            log("find AuthorCodes by Ids failed", Level.SEVERE, re);
            throw re;
        }
    }
}
