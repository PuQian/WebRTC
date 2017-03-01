package com.free4lab.utils.account;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class UserInfo extends HashMap<String, String>  {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(UserInfo.class);
	
	public UserInfo(){}
	
	public UserInfo(JSONObject jo) {
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
	
	public static List<UserInfo> getList(JSONObject ro,String param){
		List<UserInfo> userInfos = new ArrayList<UserInfo>();
		try {
			String userInfo = ro.getString(param);
			if(param.equalsIgnoreCase(AccountUtil.USER_KEY)){
				JSONObject o = new JSONObject(userInfo);
				UserInfo r = new UserInfo(o);
				userInfos.add(r);
			}else if(param.equalsIgnoreCase(AccountUtil.USERS_KEY)){
				JSONArray array = new JSONArray(userInfo);
				for(int i=0;i<array.length();i++){
					JSONObject o = array.getJSONObject(i);
					logger.info(o);
					UserInfo r = new UserInfo(o);
					userInfos.add(r);
				}
			}
		} catch (JSONException e) {
			logger.debug("parse json failed!",e);
		}
		return userInfos;
	}
	
	public String getUserId() {
		return get("uid");
	}
	public void setUserId(String userId) {
		put("uid",userId);
	}
	public String getEmail() {
		return get("email");
	}
	public void setEmail(String email) {
		put("email",email);
	}
	public String getAvatar() {
		return get("profile_image_url");
	}
	public void setAvatar(String avatar) {
		put("profile_image_url",avatar);
	}
	public String getRealName() {
		return get("real_name");
	}
	public void setRealName(String realName) {
		put("real_name",realName);
	}
	public String getSex() {
		return get("gender");
	}
	public void setSex(String sex) {
		put("gender",sex);
	}
	public String getUserName() {
		return get("real_name");
	}
	public void setUserName(String userName) {
		put("real_name",userName);
	}
	public String getPhone() {
		return get("phone");
	}
	public void setPhone(String phone) {
		put("phone",phone);
	}
	public String getQq() {
		return get("qq");
	}
	public void setQq(String qq) {
		put("qq",qq);
	}
	public String getCompany() {
		return get("company");
	}
	public void setCompany(String company) {
		put("company",company);
	}
	
	public String getDescription() {
		return get("description");
	}
	public void setDescription(String description) {
		put("description",description);
	}
	
	public String getPhone_home() {
		return get("phone_home");
	}
	public void setPhone_home(String phone_home) {
		put("phone_home",phone_home);
	}
	public String getPhone_work() {
		return get("phone_work");
	}
	public void setPhone_work(String phone_work) {
		put("phone_work",phone_work);
	}
	public String getEmail_home() {
		return get("email_home");
	}
	public void setEmail_home(String email_home) {
		put("email_home",email_home);
	}
	public String getEmail_work() {
		return get("email_work");
	}
	public void setEmail_work(String email_work) {
		put("email_work",email_work);
	}
}
