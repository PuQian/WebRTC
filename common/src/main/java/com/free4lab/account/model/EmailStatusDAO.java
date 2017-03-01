package com.free4lab.account.model;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class EmailStatusDAO  extends AbstractDAO<EmailStatus> {

	public String getClassName() {
        return getEntityClass().getName();
    }
	
	public Class<EmailStatus> getEntityClass() {
		return EmailStatus.class;
	}
	
	public static final String PU_NAME = "AccountPU";
	public String getPUName() {
		return PU_NAME;
	}

	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

}
