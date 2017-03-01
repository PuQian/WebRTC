package com.free4lab.utils.account;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class FriendGroup extends HashMap<String, String>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(FriendGroup.class);
	
	public FriendGroup(){}
	
	public FriendGroup(JSONObject jo) {
		try {
			@SuppressWarnings("unchecked")
			Iterator<String> iter = jo.keys();
			while (iter.hasNext()) {
				String key = iter.next();
				String value = ""; 
				if(jo.get(key) != JSONObject.NULL){
					value = jo.getString(key);
				}else{
					value = ""; 
				}
				
				this.put(key, value);
			}
		} catch (JSONException e) {
			logger.debug("invalid groupInfo",e);
		}
	}
	
	public static List<FriendGroup> getList(JSONObject ro,String param){
		List<FriendGroup> friendships = new ArrayList<FriendGroup>();
		try {
			if(ro.get(param) != JSONObject.NULL){
				String friends = ro.getString(param);
				
					JSONArray array = new JSONArray(friends);
					for(int i=0;i<array.length();i++){
						JSONObject o = array.getJSONObject(i);
						logger.info(o);
						FriendGroup r = new FriendGroup(o);
						friendships.add(r);
					}
				
			}
			
		} catch (JSONException e) {
			logger.debug("parse json failed!",e);
		}
		return friendships;
	}

	public String getId() {
		return "id";
	}

	public void setId(String id) {
		put("id",id);
	}

	public String getUpdate_time() {
		return "update_time";
	}

	public void setUpdate_time(String update_time) {
		put("update_time",update_time);
	}
	
	public String getName() {
		return "name";
	}

	public void setName(String name) {
		put("name",name);
	}
	
}
