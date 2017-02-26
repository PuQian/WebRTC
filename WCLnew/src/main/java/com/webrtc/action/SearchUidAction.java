package com.webrtc.action;

import java.util.Map;

import org.apache.log4j.Logger;
import com.free4lab.account.manager.UserManager;

public class SearchUidAction {

	private final Logger logger = Logger.getLogger(SearchUidAction.class);
	
	private String username;
	private int uid;

	public String execute() throws Exception{
		
	    System.out.println(username);
		
	    uid = UserManager.searchUidByEmail(username);
	    System.out.println(uid);

        return "success";

	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
}
