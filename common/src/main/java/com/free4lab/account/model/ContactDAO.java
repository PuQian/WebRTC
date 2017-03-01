package com.free4lab.account.model;

import java.util.List;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class ContactDAO extends AbstractDAO<Contact> {
	//property constants
	public static final String FZ= "groupId";

	@Override
	public Class<Contact> getEntityClass() {
		return Contact.class;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

	@Override
	public String getPUName() {
		return "AccountPU";
	}

	public List<Contact> findByFz(Object fz
	) {
		return findByProperty(FZ,fz
		);
	}
	public List<Contact> findByFzForPage(Object fz,int page,int size)
	{
		return findByProperty(FZ,fz,page,size);
	}
	
	public long countByFzForPage(Object fz)
	{
		return countByProperty(FZ,fz);
	}
}