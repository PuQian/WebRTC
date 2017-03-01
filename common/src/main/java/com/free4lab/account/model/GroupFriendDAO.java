package com.free4lab.account.model;

import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class GroupFriendDAO extends AbstractDAO<GroupFriend> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<GroupFriend> getEntityClass() {
        return GroupFriend.class;
    }
    public static final String PU_NAME = "AccountPU";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }

	@SuppressWarnings("unchecked")
	public List<GroupFriend> findByPropertyList(String name, List<Integer> values) {
		if(values.size() == 0){
			return null;
		}
		getLogger().info("finding " + getClassName() + " instance with property:" + name
                + ", values: " + values.toString());
		String queryString = "select model from " + getClassName() + " model where "; 
		for(int i = 0; i< values.size(); i++){
			if(i == 0){
				queryString += "model." + name + " = " + values.get(i);
			}else{
				queryString += " or model." + name + " = " + values.get(i);
			}
		}
		try {
			Query query = getEntityManager().createQuery(queryString);
			return query.getResultList();
		}catch (RuntimeException re) {
            log("find GroupGriends by Ids failed", Level.SEVERE, re);
            throw re;
        }
	}
}
