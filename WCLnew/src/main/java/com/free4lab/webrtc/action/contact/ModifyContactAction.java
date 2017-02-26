package com.free4lab.webrtc.action.contact;

import org.apache.log4j.Logger;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.ContactManager;
import com.opensymphony.xwork2.ActionContext;

public class ModifyContactAction extends BaseAction{
private final Logger logger = Logger.getLogger(ModifyContactAction.class);
	
	private Integer friendId;
	//private Integer groupId = -1;
	
	//private InputStream inputStr;
	//private String callback;
	
	//
	private String nickname;
	private String email;
	private String qq;
	private String webrtc;
	private String phone;
	
	private String groupName;
	
	public String execute() throws Exception{
		
		
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
		logger.info("groupName="+groupName+",friendId="+friendId+",nickname"+nickname+",email="+email+","+qq+","+webrtc+","+phone);
		
		
		 (new ContactManager()).updateContact(userId,groupName,friendId,nickname,email,qq,webrtc, phone);
		
		//inputStr = new ByteArrayInputStream( (callback + "(null)").getBytes("utf-8")); 
		return SUCCESS;
	}

	public Integer getFriendId() {
		return friendId;
	}

	public void setFriendId(Integer friendId) {
		this.friendId = friendId;
	}
/*
	public Integer getGroupId() {
		return groupId;
	}

	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
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
