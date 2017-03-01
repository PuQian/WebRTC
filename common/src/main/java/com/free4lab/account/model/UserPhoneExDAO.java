package com.free4lab.account.model;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class UserPhoneExDAO extends AbstractDAO<UserPhoneEx> {

	@Override
	public Class<UserPhoneEx> getEntityClass() {
		return UserPhoneEx.class;
	}

	public static final String PU_NAME = "AccountPU";
	@Override
	public String getPUName() {
		return PU_NAME;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return  new NoCacheEntityManagerHelper();
	}

}

