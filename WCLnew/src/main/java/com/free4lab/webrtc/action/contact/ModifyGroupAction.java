package com.free4lab.webrtc.action.contact;

import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.ContactManager;
import com.free4lab.webrtc.model.contact.Grouplist;
import com.opensymphony.xwork2.ActionContext;

public class ModifyGroupAction extends BaseAction {
	private final Logger logger = Logger.getLogger(ModifyGroupAction.class);
	private Integer groupId;
	private String groupName;//只能改名字
	private String oldGroupName;//旧的groupName
	public String execute() throws Exception{
		
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
		logger.info("oldGroupName="+oldGroupName);
		//找到到旧的分组的
		
		List<Grouplist> oldGroup=(new ContactManager()).findGroup(userId,oldGroupName);
		if(!oldGroup.isEmpty()){
			groupId=oldGroup.get(0).getGroupId();
			logger.info("groupId="+groupId);
		}
		
		(new ContactManager()).updateGroup(userId,groupId, groupName);
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
	
	public String getOldGroupName()
	{
		return this.oldGroupName;
	
	}

	public void setOldGroupName(String oldGroupName)
	{
		this.oldGroupName=oldGroupName;
	}
	
	public Integer GetGroupId()
	{
		return this.groupId;
		
	}
	
	public void setGroupId(Integer groupId)
	{
		this.groupId =groupId;
	}
}
