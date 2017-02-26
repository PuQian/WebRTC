package com.free4lab.webrtc.action.contact;

import org.apache.log4j.Logger;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.ContactManager;
import com.opensymphony.xwork2.ActionContext;

public class DeleteContactAction extends BaseAction{
	private final Logger logger = Logger.getLogger(DeleteContactAction.class);
	private Integer friendId;
	//private String groupIds;
	
	//private InputStream inputStr;
	//private String callback;
	
	public String execute() throws Exception{
		/*String myId = (String)ActionContext.getContext().getSession().get("MYID");
		logger.info("myId="+myId);
		Integer userId = Integer.parseInt(myId);
		logger.info("userId="+userId);
		*/
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
		logger.info("friendId");
	
		
		(new ContactManager()).delContact(userId,friendId);
		
		return SUCCESS;
	}

	public Integer getFriendId() {
		return friendId;
	}

	public void setFriendId(Integer friendId) {
		this.friendId = friendId;
	}
	/*
	public String getGroupIds() {
		return groupIds;
	}

	public void setGroupIds(String groupIds) {
		this.groupIds = groupIds;
	}
	
	public InputStream getInputStr() {
		return inputStr;
	}

	public void setInputStr(InputStream inputStr) {
		this.inputStr = inputStr;
	}

	public String getCallback() {
		return callback;
	}

	public void setCallback(String callback) {
		this.callback = callback;
	}
	*/
}
