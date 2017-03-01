package com.free4lab.account.model;

import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class EngroupDAO extends AbstractDAO<Engroup> {
	// property constants
	public static final String EID = "eid";
	public static final String LFZ = "lfz";
	public static final String FZ = "fz";

	@Override
	public Class<Engroup> getEntityClass() {
		return Engroup.class;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

	@Override
	public String getPUName() {
		return "AccountPU";
	}

	public List<Engroup> findByUsername(Object eid) {
		return findByProperty(EID, eid);
	}
	
	public List<Engroup> findByFz(Object fz) {
		return findByProperty(FZ, fz);
	}

	public List<Engroup> findByLfz(Object lfz) {
		return findByProperty(LFZ, lfz);
	}

	
	public List<Engroup> findByEidLfz(Object eid, Object lfz){
		return findByProperty2(EID, eid, LFZ, lfz);
	}
	
	public List<Engroup> findByEidLfzForPage(Object eid,Object lfz,int _page,int _size)
	{		
		String name1 = EID;
		final Object value1 = eid;
		String name2 = LFZ;
		final Object value2 = lfz;
		int page = _page;
		int size = _size;

		log("finding " + getClassName() + " instance with property1: " + name1
				+ ", value1: " + value1 + "; propety2: " + name2 + ", value2: "
				+ value2, Level.INFO, null);
		try {
			final String queryString = "select model from " + getClassName()
					+ " model where model." + name1 + "= :value1 and model."
					+ name2 + "= :value2";
			Query query = getEntityManager().createQuery(queryString);
			query.setParameter("value1", value1);
			query.setParameter("value2", value2);
			query.setMaxResults(size).setFirstResult(page * size);
			return query.getResultList();
		} catch (RuntimeException re) {
			log("find by property name failed", Level.SEVERE, re);
			throw re;
		}
	}
	
	public long countByEidLfzForPage(Object eid,Object lfz)
	{
		 return countByProperty(EID,eid,LFZ,lfz);
	}
	
}