package com.free4lab.utils.group;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Membership {
	private static final Logger logger = Logger.getLogger(Membership.class);
    private Group group;
    private List<String> members;

	public static List<Membership> MakeMemberList(String json){
		List<Membership> members = new ArrayList<Membership>();
		
		try {
			JSONArray array = new JSONArray(json);
			for(int i=0;i<array.length();i++){
				Membership m = new Membership(array.getJSONObject(i));
				members.add(m);
			}
		} catch (JSONException e) {
			logger.debug("MakeMemberList parse json failed!",e);
			e.printStackTrace();
		}
		return members;
	}
    
    
    public Membership(JSONObject o) throws JSONException{
		
		JSONArray array = o.getJSONArray("members");
		
		group = new Group(o.getJSONObject("group"));
		members = new ArrayList<String>();
		for(int i=0;i<array.length();i++){
			members.add(array.getString(i));
		}
    }
    
    public Membership(Group g,List<String> members){
    	this.group = new Group(g.getUuid(),g.getAuthToken());
    	this.members = members;
    }
    
    
    public String ToJSON() throws JSONException{
    	JSONObject o = new JSONObject();
    	o.put("authToken",group.getAuthToken());
    	o.put("uuid",group.getUuid());
    	
    	JSONArray array = new JSONArray();
    	for(String s : members){
    		array.put(s);
    	}
    	o.put("members",array);
    	
    	return o.toString();
    }

	public Group getGroup() {
		return group;
	}

	public void setGroup(Group group) {
		this.group = group;
	}

	public List<String> getMembers() {
		return members;
	}

	public void setMembers(List<String> members) {
		this.members = members;
	}
    
    
    String TrimQuote(String s){
    	if(s.charAt(0)=='\"' && s.charAt(s.length()) == '\"')
			return s = s.substring(1,s.length()-1);
    	return s;
    }
    
}