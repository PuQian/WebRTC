package com.free4lab.account.model;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;


public class EnterfrienduserDAO extends AbstractDAO<Enterfrienduser> {
	
	public static final String EID= "eid";
	public static final String FID= "fid";
	
	@Override
	public Class<Enterfrienduser> getEntityClass() {
		return Enterfrienduser.class;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

	@Override
	public String getPUName() {
		return "AccountPU";
	}
}
