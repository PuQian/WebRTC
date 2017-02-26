package com.free4lab.webrtc.manager;

import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.webrtc.dao.EnteruserDAO;
import com.free4lab.webrtc.entity.Enteruser;



public class EnteruserManager {
	private static EnteruserDAO enteruserDAO = new EnteruserDAO();
	private static final Logger LOGGER = Logger.getLogger(EnteruserManager.class);
	
	public static final String EID= "eid";
	public static final String UID= "uid";
	public static final String ISADMIN= "isadmin";
	public static final String ISARTI= "isarti";
	public static final String PRIORITY= "priority";
	public static final String ISBINDTIMER= "isbindtimer";
	public static final String LOGINTIME= "loginTime";
	public static final String LOGOUTTIME= "logoutTime";
	
	public static Enteruser getByUid(Integer uid)
	{
		List<Enteruser> list = enteruserDAO.findByProperty(UID, uid);
		if(list != null && list.size() > 0)
			return list.get(0);
		else 
			return null;
	}
}
