package com.free4lab.webrtc.action.contact;

import org.apache.log4j.Logger;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.ContactManager;
import com.opensymphony.xwork2.ActionContext;
//没有用，直接前端js实现
public class CheckContactGroupAction extends BaseAction{
	private final Logger logger = Logger.getLogger(CheckContactGroupAction.class);
	
	
	
	//
	private String groupName;
	private String oldgroupName;
	public String execute() throws Exception{
		
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
		
		logger.info("groupname="+groupName);
		
		//添加联系人
		oldgroupName=(new ContactManager()).checkContactGroup(userId, groupName);
		logger.info("oldname="+oldgroupName);
		return SUCCESS;
	}

	
	public String getGroupName()
	{
		return this.groupName;
	
	}

	public void setGroupName(String groupName)
	{
		this.groupName=groupName;
	}
	
	public String getOldgroupName()
	{
		return this.oldgroupName;
	
	}

	public void setOldgroupName(String oldgroupName)
	{
		this.oldgroupName=oldgroupName;
	}
	
	
}

