package com.free4lab.account.model;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class AccountAdminDAO extends AbstractDAO<AccountAdmin>{
	
	public String getClassName() {
        return getEntityClass().getName();
    }
	
	@Override
	public Class<AccountAdmin> getEntityClass() {
		return AccountAdmin.class;
	}

	public static final String PU_NAME = "AccountPU";
	@Override
	public String getPUName() {
		return PU_NAME;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

}
