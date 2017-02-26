package com.free4lab.webrtc.manager;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.webrtc.dao.EnterpriseDAO;
import com.free4lab.webrtc.entity.Enterprise;



public class EnterpriseManager {
	
	private static EnterpriseDAO enterpriseDAO = new EnterpriseDAO();
	private static final Logger LOGGER = Logger.getLogger(EnterpriseManager.class);
	
	//获取所有的企业
	public static Enterprise getEnterpriseByEid(int eid) 
	{
		Enterprise enterprise = enterpriseDAO.findById(eid);
		return enterprise;
	}
}
