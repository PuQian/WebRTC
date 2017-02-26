package com.webrtc.action;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.webrtc.manager.EaseFriendManager;
import com.opensymphony.xwork2.ActionSupport;

public class ManageEaseFriendAction extends ActionSupport {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(ManageEaseFriendAction.class);

	
	private String hostname;
	private String friendname;

	//删除好友记录
	public String delEaseFriend() throws Exception {
		EaseFriendManager.DelFriendByHostnameandFriendName(hostname,friendname);		
		return SUCCESS;
	}
	//添加好友记录
	public String addEaseFriend() throws Exception{
		EaseFriendManager.AddEaseFriend(hostname,friendname);		
		return SUCCESS;
	}
	
	public String getHostname(){
		return hostname;
	}
	public void setHostname(String hostname){
		this.hostname=hostname;
	}
	public String getFriendname(){
		return friendname;
	}
	public void setFriendname(String friendname){
		this.friendname=friendname;
	}
}
