package com.free4lab.account.model;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class GroupUserDAO extends AbstractDAO<GroupUser> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<GroupUser> getEntityClass() {
        return GroupUser.class;
    }
    public static final String PU_NAME = "AccountPU";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }
}
