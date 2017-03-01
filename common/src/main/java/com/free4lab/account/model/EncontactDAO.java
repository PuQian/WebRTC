package com.free4lab.account.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class EncontactDAO extends AbstractDAO<Encontact> {
	//property constants
	public static final String FZ= "fz";

	@Override
	public Class<Encontact> getEntityClass() {
		return Encontact.class;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

	@Override
	public String getPUName() {
		return "AccountPU";
	}

	public List<Encontact> findByFz(Object fz
	) {
		return findByProperty(FZ,fz
		);
	}
	
	public List<Encontact> findByFzForPage(Object fz,int page,int size)
	{
		return findByProperty(FZ,fz,page,size);
	}
	
	public long countByFzForPage(Object fz)
	{
		return countByProperty(FZ,fz);
	}
	
	@SuppressWarnings("unchecked")
	public List<Encontact> findByIds(String propertyName, List<Integer> values)
	{
		if(values.size() == 0){
				getLogger().info("values.size() == 0");
				return (new ArrayList<Encontact>());
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

	            throw re;
	        }
		}
}
