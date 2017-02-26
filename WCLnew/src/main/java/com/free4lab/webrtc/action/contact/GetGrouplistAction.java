package com.free4lab.webrtc.action.contact;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.ContactManager;
import com.free4lab.webrtc.model.contact.Grouplist;
import com.opensymphony.xwork2.ActionContext;

public class GetGrouplistAction extends BaseAction{
	private final Logger logger = Logger.getLogger(GetGrouplistAction.class);
	
	private List<Grouplist> contactGroupList = new ArrayList<Grouplist>();
	
	public String execute() throws Exception{
		
		
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
		//获取分组列表，正常情况是不为空的。
		contactGroupList = (new ContactManager()).getContactgroupList(userId);
		logger.info(contactGroupList);
		JSONArray result = new JSONArray(contactGroupList, false);

		logger.info(result.toString());
		
		return SUCCESS;
	}
	
	//setter,getter
	
	public void setContactGroupList(List<Grouplist> grouplist)
	{
		this.contactGroupList=grouplist;
	}
	public List<Grouplist> getContactGroupList()
	{
		return this.contactGroupList;
	}
	

	}
