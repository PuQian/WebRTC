package com.free4lab.account.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class EnteruserDAO extends AbstractDAO<Enteruser> {
	
	public static final String EID= "eid";
	public static final String UID= "uid";
	public static final String ISADMIN= "isadmin";
	public static final String ISARTI= "isarti";
	public static final String PRIORITY= "priority";
	public static final String ISBINDTIMER= "isbindtimer";
	public static final String LOGINTIME= "loginTime";
	public static final String LOGOUTTIME= "logoutTime";
	
	@Override
	public Class<Enteruser> getEntityClass() {
		return Enteruser.class;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

	@Override
	public String getPUName() {
		return "AccountPU";
	}
	
	//根据一组ids查询
	@SuppressWarnings("unchecked")
	public List<Enteruser> findByIds(String propertyName, List<Integer> values)
	{
		if(values.size() == 0)
		{
			getLogger().info("values.size() == 0");
			return (new ArrayList<Enteruser>());
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
			return query.getResultList();
		}
		catch (RuntimeException re) 
		{
            throw re;
        }
	}
}
