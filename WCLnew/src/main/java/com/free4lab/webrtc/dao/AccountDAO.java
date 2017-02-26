package com.free4lab.webrtc.dao;

import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;
import com.free4lab.webrtc.entity.Account;

public class AccountDAO extends AbstractDAO<Account> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<Account> getEntityClass() {
        return Account.class;
    }
    public static final String PU_NAME = "WebrtcDemoPU";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }
}
