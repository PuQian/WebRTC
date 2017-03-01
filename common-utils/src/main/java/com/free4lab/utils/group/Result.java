package com.free4lab.utils.group;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.struts2.json.JSONUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Result extends HashMap<String, String> {
	
	private static final Logger logger = Logger.getLogger(Result.class);
	
	public static final String SUCCESS = "success";
	public static final String ERROR = "error";
	public static final String RESULT = "result";
	
	/**
	 * @param json
	 * @return
	 */
	public static List<Result> MakeResultList(String json){
		List<Result> results = new ArrayList<Result>();
		try {
			JSONArray array = new JSONArray(json);
			for(int i=0;i<array.length();i++){
				JSONObject o = array.getJSONObject(i);
				Result r = new Result(o);
				results.add(r);
			}
		} catch (JSONException e) {
			logger.debug("parse json failed!",e);
		}
		return results;
	}
	public Result(){}
	
	public Result(JSONObject jo) {
		
		try {
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
	
	public String GetStatus(){
		return get("status");
	}
	public String SetStatus(String status){
		return put("status",status);
	}
	
	public String GetReason(){
		return get("reason");
	}
	public String SetReason(String reason){
		return put("reason",reason);
	}
	
	public String SetGroupArray(String key,List<Group> list){
		String value ="";
		try {
			value = JSONUtil.serialize(list);
		} catch (org.apache.struts2.json.JSONException e) {
			e.printStackTrace();
		}
		return put(key,value);
	}
	
	public List<Group> getGroupArray(String key) {
		List<Group> list = new ArrayList<Group>();
		try {
			JSONArray arr = new JSONArray(get(key));
			for(int i =0;i<arr.length();i++){
				list.add(new Group(arr.getJSONObject(i)));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}
	
	public String SetBooleanArray(String key,List<Boolean> list){
		String value ="";
		try {
			value = JSONUtil.serialize(list);
		} catch (org.apache.struts2.json.JSONException e) {
			e.printStackTrace();
		}
		return put(key,value);
	}
	
	public List<Boolean> getBooleanArray(String key) {
		List<Boolean> blist = new ArrayList<Boolean>();
		try {
			JSONArray arr = new JSONArray(get(key));
			for(int i =0;i<arr.length();i++){
				blist.add(arr.getBoolean(i));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return blist;
	}
	
	public String SetStringArray(String key,List<String> list){
		String value ="";
		try {
			value = JSONUtil.serialize(list);
		} catch (org.apache.struts2.json.JSONException e) {
			e.printStackTrace();
		}
		return put(key,value);
	}
	
	public List<String> getStringArray(String key) {
		List<String> blist = new ArrayList<String>();
		try {
			JSONArray arr = new JSONArray(get(key));
			for(int i =0;i<arr.length();i++){
				blist.add(arr.getString(i));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return blist;
	}
}