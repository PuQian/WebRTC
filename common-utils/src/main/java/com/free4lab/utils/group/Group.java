package com.free4lab.utils.group;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;



public class Group {
	private static final Logger logger = Logger.getLogger(Group.class);
	
	public static List<Group> MakeGroupList(String json){
		List<Group> groups = new ArrayList<Group>();
		
		try {
			JSONArray array = new JSONArray(json);
			for(int i=0;i<array.length();i++){
				Group g = new Group(array.getJSONObject(i));
				groups.add(g);
			}
		} catch (JSONException e) {
			logger.debug("parse json failed!",e);
		}
		return groups;
	}
	public static List<String> MakeStringList(String json){
		List<String> members = new ArrayList<String>();
		try {
			JSONArray array = new JSONArray(json);
			for(int i=0;i<array.length();i++){
				members.add(array.getString(i));
			}
		} catch (JSONException e) {
			logger.debug("parse json failed!",e);
		}
		return members;
	}
	
	
    private String uuid;        // 传入传出的时候都必须包含uuid
    private String authToken;   // 只有在创建group的时候，会返回。其他时候必须带入
    private GroupInfo info;     // 只在update的时候传入，其他时候传出
    private List<Group> subGroupList;   // 子组列表
    private List<String> memberList;    // 用户列表
    
    public Group(String uuid,String authToken){
    	this.uuid = uuid;
    	this.authToken = authToken;
    }
    
    /**
     * 从JSON对象中构造一个Group
     * 传入的对象中一般只有 uuid 和 authToken两个字段
     * @param o
     * @throws JSONException
     */
    public Group(JSONObject o) throws JSONException{
    	authToken = o.getString("authToken");
		uuid = o.getString("uuid");
		info = new GroupInfo(o.getString("info"));
		subGroupList = Group.MakeGroupList(o.getString("subGroupList"));
		memberList = Group.MakeStringList(o.getString("memberList"));
    }
    
//	/**
//	 * 构造一个json @deprecated  使用JSONUtil
//	 * @throws JSONException 
//	 */
//	public String ToJson(Group group) throws JSONException {
//		group=new Group(uuid, authToken);
//		uuid=group.getUuid();
//		authToken=group.authToken;
//		JSONObject o=new JSONObject();
//		o.put("uuid", uuid);
//		o.put("authToken", authToken);
//		return o.toString();
//	}
    
    public boolean isMember(String user){
    	for (Group g : subGroupList) {
			if(g.isMember(user))
				return true;
		}
    	return getMemberList().contains(user);
    }
    
    public boolean isDirectMember(String user){
    	return getMemberList().contains(user);
    }
    
    public boolean isSubGroup(String uuid){
    	for (Group g : subGroupList) {
			if(g.isSubGroup(uuid) || g.getUuid().equals(uuid) )
				return true;
		}
    	return false;
    }
    
    public boolean isDirectSubGroup(String uuid){
    	for (Group g : subGroupList) {
			if( g.getUuid().equals(uuid) )
				return true;
		}
    	return false;
    }
    
    public List<Group> findUserGroups(String user){
    	List<Group> groups = new ArrayList<Group>();
    	if(isDirectMember(user))
    		groups.add(this);
    	for (Group g : subGroupList) {
    		g.findUserGroups(user, groups);
    	}
    	return groups;
    }
    
    public void findUserGroups(String user,List<Group> groups){
    	if(groups == null) return;
    	if(isDirectMember(user))
    		groups.add(this);
    	for (Group g : subGroupList) {
    		g.findUserGroups(user, groups);
    	}
    }
    
    
    
	
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getAuthToken() {
		return authToken;
	}
	public void setAuthToken(String authToken) {
		this.authToken = authToken;
	}
	public GroupInfo getInfo() {
		if(info == null)
			info = new GroupInfo(null);
		return info;
	}
	public void setInfo(GroupInfo info) {
		this.info = info;
	}
	public List<Group> getSubGroupList() {
		if(subGroupList == null)
			subGroupList = new ArrayList<Group>();
		return subGroupList;
	}
	public void setSubGroupList(List<Group> subGroupList) {
		this.subGroupList = subGroupList;
	}
	public List<String> getMemberList() {
		if(memberList == null)
			memberList = new ArrayList<String>();
		return memberList;
	}
	public void setMemberList(List<String> memberList) {
		this.memberList = memberList;
	}
    
}