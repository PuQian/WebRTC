package com.free4lab.webrtc.action.contact;

import org.apache.log4j.Logger;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.ContactManager;
import com.opensymphony.xwork2.ActionContext;

public class DeleteGroupAction extends BaseAction {
private final Logger logger = Logger.getLogger(DeleteGroupAction.class);
	
	private String groupName;
	//private Integer groupId ;
	
	public String execute() throws Exception{
	/*String myId = (String)ActionContext.getContext().getSession().get("MYID");
	logger.info("myId="+myId);
	Integer userId = Integer.parseInt(myId);
	logger.info("userId="+userId);*/
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
	//delete group
	(new ContactManager()).deleteGroup(userId, groupName);//
	//
	return SUCCESS;
	}
	
	public void setGroupName(String groupName)
	{
		this.groupName=groupName;
	}
	
	public String getGroupName()
	{
		return this.groupName;
	
	}
}