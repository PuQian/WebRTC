package com.free4lab.webrtc.dao;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;
import com.free4lab.webrtc.entity.Enteruser;

public class EnteruserDAO extends AbstractDAO<Enteruser> {
	
	public static final String EID= "eid";
	public static final String UID= "uid";
	public static final String ISADMIN= "isadmin";
	public static final String ISARTI= "isarti";
	public static final String PRIORITY= "priority";
	public static final String ISBINDTIMER= "isbindtimer";
	public static final String LOGINTIME= "loginTime";
	public static final String LOGOUTTIME= "logoutTime";
	
	@Override
	public Class<Enteruser> getEntityClass() {
		return Enteruser.class;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

	@Override
	public String getPUName() {
		return "WebrtcDemoPU";
	}
}
