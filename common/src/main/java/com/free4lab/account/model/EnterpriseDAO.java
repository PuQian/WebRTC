package com.free4lab.account.model;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class EnterpriseDAO extends AbstractDAO<Enterprise> {
	
	public static final String EID= "eid";
	public static final String NAME= "name";
	public static final String INTRODUCTION= "introduction";
	public static final String SCALE= "scale";
	
	@Override
	public Class<Enterprise> getEntityClass() {
		return Enterprise.class;
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