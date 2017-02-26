package com.free4lab.webrtc.action.contact;

import org.apache.log4j.Logger;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.ContactManager;
import com.opensymphony.xwork2.ActionContext;

public class AddContactAction extends BaseAction{
	private final Logger logger = Logger.getLogger(AddContactAction.class);
	
	private Integer friendId;
	//private Integer groupId = -1;
	
	//private InputStream inputStr;
	//private String callback;
	
	//friend fields
	private String nickname;
	private String email;
	private String qq;
	private String webrtc;
	private String phone;
	//
	private String groupName;
	
	public String execute() throws Exception{
		//String myId = (String)ActionContext.getContext().getSession().get("MYID");
		//logger.info("myId="+myId);
		//Integer userId = Integer.parseInt(myId);
		//logger.info("userId="+userId);
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
		
		
		//添加联系人
		(new ContactManager()).addContact(userId, groupName, nickname, email, qq, webrtc, phone);
		//inputStr = new ByteArrayInputStream( (callback + "(null)").getBytes("utf-8"));
		return SUCCESS;
	}

	public Integer getFriendId() {
		return friendId;
	}

	public void setFriendId(Integer friendId) {
		this.friendId = friendId;
	}
	
	public String getGroupName()
	{
		return this.groupName;
	
	}

	public void setGroupName(String groupName)
	{
		this.groupName=groupName;
	}
	
	public String getEmail()
	{
		return this.email;
	
	}

	public void setEmail(String email)
	{
		this.email=email;
	}
	
	public String getQq()
	{
		return this.qq;
	
	}

	public void setQq(String qq)
	{
		this.qq=qq;
	}
	
	public String getPhone()
	{
		return this.phone;
	
	}

	public void setPhone(String phone)
	{
		this.phone=phone;
	}
	
	public String getWebrtc()
	{
		return this.webrtc;
	
	}

	public void setWebrtc(String webrtc)
	{
		this.webrtc=webrtc;
	}
	
	public String getNickname()
	{
		return this.nickname;
	
	}

	public void setNickname(String nickname)
	{
		this.nickname=nickname;
	}
	
}

