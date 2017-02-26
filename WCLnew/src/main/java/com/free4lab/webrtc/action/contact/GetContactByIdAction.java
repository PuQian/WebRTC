package com.free4lab.webrtc.action.contact;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.entity.ContactInfo;
import com.free4lab.webrtc.manager.ContactManager;
import com.free4lab.webrtc.model.contact.Friend;
import com.opensymphony.xwork2.ActionContext;

public class GetContactByIdAction extends BaseAction{
	private final Logger logger = Logger.getLogger(GetContactByIdAction.class);
	
	private List<ContactInfo> contactinfo= new ArrayList<ContactInfo>();
	private Integer friendId;
	
	public String execute() throws Exception{
		
		
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
		
		contactinfo = (new ContactManager()).getContactById(userId,friendId);
		//logger.info(contactGroupList);
		JSONArray result = new JSONArray(contactinfo, false);

		logger.info(result.toString());
		
		return SUCCESS;
	}
	
	//setter,getter
	
		public void setFriendId(Integer friendId)
		{
			this.friendId=friendId;
		}
		
		public Integer getFriendId()
		{
			return this.friendId;
		}
		
		public void setContactinfo(List<ContactInfo> contactInfo)
		{
			this.contactinfo=contactinfo;
		}
		
		public List<ContactInfo> getContactinfo()
		{
			return this.contactinfo;
		}
	}
