package com.free4lab.account.model;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class AccountDAO extends AbstractDAO<Account> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<Account> getEntityClass() {
        return Account.class;
    }
    public static final String PU_NAME = "AccountPU";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }

	@SuppressWarnings("unchecked")
	public List<Account> findByPropertyLike(String name, String email) {
		log("finding " + getClassName() + " instance with like property: "+name+
				" , value: " +email, Level.INFO, null);

		try {
			final String queryString = "select model from " + getClassName() + 
					" model where model."+name+" like :propertyValue1";
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("propertyValue1", "%" + email + "%");
            return query.getResultList();
        } catch (RuntimeException re) {
            log("findByPropertyLike failed", Level.SEVERE, re);
            throw re;
        }
	}

	@SuppressWarnings("unchecked")
	public List<Account> findByPropertyLikeByPage(String name, String email,
			int page, int pageSize) {
		log("finding " + getClassName() + " instance with like property: "+name+
				" , value: " +email, Level.INFO, null);

		try {
			final String queryString = "select model from " + getClassName() + 
					" model where model."+name+" like :propertyValue1";
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("propertyValue1", "%" + email + "%");
            query.setMaxResults(pageSize).setFirstResult((page-1) *pageSize);
            return query.getResultList();
        } catch (RuntimeException re) {
            log("findByPropertyLike failed", Level.SEVERE, re);
            throw re;
        }
	}
	
	//根据一组ids查询
	@SuppressWarnings("unchecked")
	public List<Account> findByIds(String propertyName, List<Integer> values)
	{
		if(values.size() == 0)
		{
			getLogger().info("values.size() == 0");
			return (new ArrayList<Account>());
		}
		getLogger().info("finding " + getClassName() + " instance with property: "
                + propertyName + ", values: " + values.toString());
		String queryString = "select model from " + getClassName() + " model where "; 
		for(int i = 0; i< values.size(); i++)
		{
			if(i == 0)
			{
				queryString += "model." + propertyName + " = " + values.get(i);
			}else
			{
				queryString += " or model." + propertyName + " = " + values.get(i);
			}
		}
		try 
		{
			Query query = getEntityManager().createQuery(queryString);
			System.out.println(queryString);
			return query.getResultList();
		}
		catch (RuntimeException re) 
		{
            throw re;
        }
	}
}
