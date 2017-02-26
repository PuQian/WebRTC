package com.free4lab.webrtc.action.contact;

import org.apache.log4j.Logger;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.ContactManager;
import com.opensymphony.xwork2.ActionContext;
/*
 * 无用
 */
public class CheckContactAction extends BaseAction{ 
	private final Logger logger = Logger.getLogger(CheckContactAction.class);
	
	private String nickname;
	//private Integer friendId;
	private String oldName;
	
	public String execute() throws Exception{
		
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
		
		
		logger.info("nickname="+nickname);
		//检查联系人
		oldName=(new ContactManager()).checkContact(userId,nickname);
		logger.info("oldName="+oldName);
		return SUCCESS;
	}
/*
	public Integer getFriendId() {
		return friendId;
	}

	public void setFriendId(Integer friendId) {
		this.friendId = friendId;
	}
	*/
	
	public String getNickname()
	{
		return this.nickname;
	
	}

	public void setNickname(String nickname)
	{
		this.nickname=nickname;
	}
	
	public String getOldName()
	{
		return this.oldName;
	
	}

	public void setOldName(String oldName)
	{
		this.oldName=oldName;
	}
}

