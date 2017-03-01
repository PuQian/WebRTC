package com.free4lab.utils.group;


import java.util.HashMap;
import java.util.Iterator;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

public class GroupInfo extends HashMap<String, String>{
	private static final Logger logger = Logger.getLogger(GroupInfo.class);
	private static final long serialVersionUID = 1L;
	GroupInfo(){}
	public GroupInfo(String jsonInfo) {
//		super();
		if(jsonInfo == null)
			return;
		
		try {
			JSONObject jo = new JSONObject(jsonInfo);
			Iterator<String> iter = jo.keys();
			while (iter.hasNext()) {
				String key = iter.next();
				String value = jo.getString(key);
				this.put(key, value);
			}
		} catch (JSONException e) {
			logger.debug("invalid groupInfo",e);
		}
	}
}