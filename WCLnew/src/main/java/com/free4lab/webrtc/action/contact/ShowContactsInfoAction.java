package com.free4lab.webrtc.action.contact;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.utils.account.UserInfo;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.ContactManager;
import com.free4lab.webrtc.model.contact.Friend;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public class ShowContactsInfoAction extends BaseAction {
//点击联系人，就显示用户的联系人列表 
	private final Logger logger = Logger.getLogger(ShowContactsInfoAction.class);
	//private InputStream inputStr;
	//private String callback;
	private List<Friend> contactList = new ArrayList<Friend>();
	
	public String execute() throws Exception{
		//String userName = (String)ActionContext.getContext().getSession().get("userName");
		//logger.info("userName"+userName);
		//String myId = (String)ActionContext.getContext().getSession().get("userId");//??
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);
		
		//just for test
		//Integer userId = Integer.parseInt("140");
		//logger.info("userId="+userId);
		contactList = (new ContactManager()).getContactList(userId);
		logger.info("联系人"+contactList);
		JSONArray result = new JSONArray(contactList, false);
//		JSONObject result = new JSONObject(friendList);
		logger.info(result.toString());
		/*不要下面这句*/
		//inputStr = new ByteArrayInputStream( (callback + "("+ result.toString() +")").getBytes("utf-8"));
		return SUCCESS;
	}
/*
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
	public List<Friend> getContactList() {
		return contactList;
	}

	public void setContactList(List<Friend> contactList) {
		this.contactList=contactList;
	}
	
}

