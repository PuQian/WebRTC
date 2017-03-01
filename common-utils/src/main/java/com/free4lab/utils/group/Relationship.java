package com.free4lab.utils.group;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * @author 构造Relationship的各种基础数据 通过得到的json构造需要处理的lsit数据 通过json构造Relationship对象
 */
public class Relationship {
	private static final Logger logger = Logger.getLogger(Relationship.class);
	
	private Group oFatherGroup; // 原父组(仅在改变组位置的情况下使用)
	private Group nFatherGroup; // 被移向的新的父组
	private List<String> subs;

	public Relationship(){}
	
	public Relationship(Group oFatherGroup, Group nFatherGroup,
			List<String> subs) {
		this.nFatherGroup=nFatherGroup;
		this.oFatherGroup=oFatherGroup;
		this.subs=subs;
	}
	
	public Relationship(Group nFatherGroup,
			List<String> subs) {
		this.nFatherGroup=nFatherGroup;
		this.subs=subs;
	}
	

	/**
	 * 为客户端构造json数据
	 * 
	 * @return json转化后的string
	 * 
	 * 暂时为使用，使用struts serializable
	 */
//	public String ToJson(String ofuuid, String nfuuid, String oToken,
//			String nToken, List<String> subGroupUuid) throws JSONException {
//		JSONObject o = new JSONObject();
//		o.put("ofuuid", ofuuid);
//		o.put("oToken", oToken);
//		o.put("nToken", nToken);
//		JSONArray array = new JSONArray();
//		for (int i = 0; i < subs.size(); i++) {
//			array.put(subs.get(i));
//		}
//		o.put("subs", array);
//		return o.toString();
//	}

	public static List<Relationship> MakeRelationshipList(String json) {
		List<Relationship> relation = new ArrayList<Relationship>();
		try {

			JSONArray array = new JSONArray(json);
			for (int i = 0; i < array.length(); i++) {
				Relationship r = new Relationship(array.getJSONObject(i));
				relation.add(r);
			}
		} catch (JSONException e) {
			logger.debug("parse json failed!", e);
			e.printStackTrace();
		}
		return relation;
	}

	public Relationship(JSONObject o) throws JSONException {
		setoFatherGroup(new Group(o.getJSONObject("oFatherGroup")));
		setnFatherGroup(new Group(o.getJSONObject("nFatherGroup")));
		JSONArray arrays = o.getJSONArray("subs");
		subs = new ArrayList<String>();
		System.out.println("subs is " + arrays.length());
		for (int i = 0; i < arrays.length(); i++) {
			subs.add(arrays.getString(i));
		}
	}

	public Group getoFatherGroup() {
		return oFatherGroup;
	}

	public void setoFatherGroup(Group oFatherGroup) {
		this.oFatherGroup = oFatherGroup;
	}

	public Group getnFatherGroup() {
		return nFatherGroup;
	}

	public void setnFatherGroup(Group nFatherGroup) {
		this.nFatherGroup = nFatherGroup;
	}

	public List<String> getSubs() {
		return subs;
	}
	public void setSubs(List<String> subs) {
		this.subs = subs;
	}

}