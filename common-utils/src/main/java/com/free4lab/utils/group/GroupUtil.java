package com.free4lab.utils.group;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.struts2.json.JSONUtil;
import org.json.JSONException;
import org.json.JSONObject;

import com.free4lab.utils.http.HttpCrawler;

/**
 * this package present a API for back end use
 * 
 * @author yicou
 */
public class GroupUtil {
	private static final Logger logger = Logger.getLogger(GroupUtil.class);

	// private static String freeGroupUrl = "http://group.free4lab.com/";
	private static String freeGroupUrl = "http://freegroupdev.free4lab.com/";

	/**
	 * 默认超时时间2s
	 */
	private static int timeout = 2000;
	private static int retrycount = 10;

	public static final String PARAS_KEY = "param";

	public static final String CREATE_ROOT_GROUP_URL = "api/creategroup";
	public static final String CREATE_SUB_GROUP_URL = "api/createsubgroups";
	public static final String DELETE_GROUP_URL = "api/deletegroup";
    public static final String SET_GROUP_INFO_URL = "api/setgroupinfo";
    public static final String GET_GROUP_URL = "api/getgroup";
	public static final String MOVE_GROU_URL = "api/movegroup";
	public static final String ADD_MEMBER_URL = "api/addmember";
	public static final String DELETE_MEMBER_URL = "api/deletemember";
	//functions can be done by use the upper apis
	public static final String GET_SUBGROUP_URL = "api/getsubgroup";
	public static final String GET_DIRECT_SUBGROUP_URL = "api/getdirectsubgroup";
	public static final String JUDGE_RELATION_URL = "api/judgerelation";
	public static final String JUDGE_DIRECT_RELATION_URL = "api/judgedirectrelation";
	
	public static final String GET_MEMBER_URL = "api/getmembers";
	public static final String GET_DIRECT_MEMBER_URL = "api/getdirectmembers";
	public static final String JUDGE_MEMBER_URL = "api/judgemember";
	public static final String JUDGE_DIRECT_MEMBER_URL = "api/judgedirectmember";
	public static final String FIND_MEMBER_GROUP_URL = "api/findmembergroup";
	
	static public class GroupInfo extends HashMap<String, String> {
		private static final long serialVersionUID = 1L;
	}

	/**
	 * 创建根组
	 * 
	 * @return 失败的时候返回null
	 */
	public static Group createRootGroup() {
		String content = HttpCrawler.getHtmlDoc(getFreeGroupUrl()
				+ CREATE_ROOT_GROUP_URL, null, getTimeout(),getRetrycount());
		logger.info("content : " + content);
		JSONObject o;
		try {
			o = new JSONObject(content);
			Group p = new Group(o.getJSONObject("group"));
			return p;
		} catch (JSONException e) {
			logger.error("create Root Group failed");
		}
		return null;
	}

	/**
	 * 创建某组的多个子组（同时包含组之间关系）
	 * 
	 * @param num
	 * @return
	 */
	public static List<Group> createSubGroup(Group group, int num) {
		try {
			JSONObject o = new JSONObject();
			o.put("group", new JSONObject(group));
			o.put("num", num);

			logger.debug("fatherGroup:" + JSONUtil.serialize(group));
			String param = o.toString();
			logger.debug("param:" + param);
			String url = getFreeGroupUrl() + CREATE_SUB_GROUP_URL + "?"
					+ PARAS_KEY + "=" + URLEncoder.encode(param, "UTF-8");
			logger.debug("url:" + url);
			String json = HttpCrawler.getHtmlDoc(url, null, getTimeout(),getRetrycount());
			logger.debug("json:" + json);
			JSONObject ro = new JSONObject(json);

			List<Group> groups = Group.MakeGroupList(ro.getString("groups"));
			return groups;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("create Sub Group failed!", e);
		}

		return null;
	}
	
	private static List<Result> getResults(String Action,String param){
		try {
			String url = makeUrl(Action, param);
    		logger.debug("param:" + param);
    		logger.debug(url);
    		String json = HttpCrawler.getHtmlDoc(url,null,getTimeout(),getRetrycount());
    		logger.info("json  is " + json);
    		JSONObject ro = new JSONObject(json);
    		List<Result> results = Result.MakeResultList(ro.getString("results"));
    		return results;
		} catch (Exception e) {
			logger.error(Action +" failed",e);
		}
        return null;
	}
	private static List<Result> getResults (String Action,List<Group> groups){
		try {
			String param = JSONUtil.serialize(groups);
			return getResults(Action, param);
		} catch (Exception e) {
			logger.error(Action +" failed",e);
		}
        return null;
	}
	
	private static List<Result> getRelationResults (String Action,List<Relationship> relations){
		try {
			String param = JSONUtil.serialize(relations);
			return getResults(Action, param);
		} catch (Exception e) {
			logger.error(Action +" failed",e);
		}
        return null;
	}
	private static List<Result> getMemberResults (String Action,List<Membership> members){
		try {
			String param = JSONUtil.serialize(members);
			return getResults(Action, param);
		} catch (Exception e) {
			logger.error(Action +" failed",e);
		}
        return null;
	}
	
	private static List<String> getMembers(String Action,List<Group> groups){
		try {
			String param = JSONUtil.serialize(groups);
			String url = makeUrl(Action, param);
    		logger.debug("param:" + param);
    		logger.debug(url);
    		String json = HttpCrawler.getHtmlDoc(url,null,getTimeout(),getRetrycount());
    		JSONObject ro = new JSONObject(json);
    		List<String> ms = Group.MakeStringList(ro.getString("members"));
    		return ms;
		} catch (Exception e) {
			logger.error(Action +" failed",e);
		}
        return null;
	}
	
	private static List<Group> getGroups (String Action,List<Group> groups){
		try {
			String param = JSONUtil.serialize(groups);
			String url = makeUrl(Action, param);
    		logger.debug("param:" + param);
    		logger.debug(url);
    		String json = HttpCrawler.getHtmlDoc(url,null,getTimeout(),getRetrycount());
    		logger.info("getSubGroups is "+ json);
    		JSONObject ro = new JSONObject(json);
    		List<Group> gs = Group.MakeGroupList(ro.getString("groups"));
    		return gs;
		} catch (Exception e) {
			logger.error(Action +" failed",e);
		}
        return null;
	}
    /**
     * 删除组（可以一次删除多个组的信息）
     * 删除组的同时，与组相关的关系也都会被删除
     * 每个GroupInfo必须包含uuid和authToken
     * @return
     */
    public static List<Result> deleteGroup(List<Group> groups) {
    	return getResults(DELETE_GROUP_URL, groups);
    }

    /**
     * 设置组的信息，每个Map对应一个组的信息（可以一次设置多个组的信息）
     * 每个GroupInfo必须包含uuid和authToken，和info
     * @param infoList
     * @return
     */
    public static List<Result> setGroupInfo(List<Group> groups) {
    	return getResults(SET_GROUP_INFO_URL, groups);
    }

    /**
     * 通过uuid列表获取组的(树)信息（可以一次获取多个组的信息）
     * 每个GroupInfo必须包含uuid和authToken
     * @param uuidList
     * @return Group中包含uuid,info
     */
    public static List<Group> getGroupTree(List<Group> groups) {
    	return getGroups(GET_GROUP_URL, groups);
    }

	/**
	 * 判断群组关系，（一次可判断多组关系）
	 * 每个Relationship中，需包含新的父group的uuid和authToken，以及子group的uuid 比如原本有
	 * g1、g2、g3，g1、g2平级，g3是g1的子组，可以用changeRelation将g3变成g2的子组，此时g3不再是g1的子组
	 * 
	 * @param relationList
	 * @return
	 */
	public static List<Result> moveGroup(List<Relationship> relationList) {
		try {
			logger.info("JSONUtil.serialize(relationList) is "+JSONUtil.serialize(relationList));
			return getResults(MOVE_GROU_URL, JSONUtil.serialize(relationList));
		} catch (Exception e) {
			logger.error("move Group failed", e);
		}
		return null;
	}

	

	/**
	 * 增加群组成员关系，（一次可增加多组关系） 每个Membership，需包含父group的uuid和authToken，以及成员的name
	 * 
	 * @param membershipList
	 * @return
	 */
	public static List<Result> addMember(List<Membership> membershipList) {
		try {
			return getResults(ADD_MEMBER_URL, JSONUtil.serialize(membershipList));
		} catch (Exception e) {
			logger.error("add Member failed", e);
		}
		return null;
	}

	/**
	 * 删除群组成员关系，（一次可删除多组关系） 每个Membership，需包含父group的uuid和authToken，以及成员的name
	 * 
	 * @param membershipList
	 * @return
	 */
	public static List<Result> deleteMember(List<Membership> membershipList) {
		try {
			return getResults(DELETE_MEMBER_URL, JSONUtil.serialize(membershipList));
		} catch (Exception e) {
			logger.error("del Member failed", e);
		}
		return null;
	}



	/**
	 * @return the freeGroupUrl
	 */
	public static String getFreeGroupUrl() {
		return freeGroupUrl;
	}

	/**
	 * @param aFreeGroupUrl
	 *            the freeGroupUrl to set
	 */
	public static void setFreeGroupUrl(String aFreeGroupUrl) {
		freeGroupUrl = aFreeGroupUrl;
	}

	/**
	 * @return the timeout
	 */
	public static int getTimeout() {
		return timeout;
	}

	/**
	 * @param aTimeout
	 *            the timeout to set
	 */
	public static void setTimeout(int aTimeout) {
		timeout = aTimeout;
	}
	
	public static int getRetrycount() {
		return retrycount;
	}

	public static void setRetrycount(int retrycount) {
		GroupUtil.retrycount = retrycount;
	}

	public static <T> List<T> makeList(T e) {
		List<T> list = new ArrayList<T>();
		list.add(e);
		return list;
	}
	
	private static String makeUrl(String Action,String param){
		
		try {
			return getFreeGroupUrl() + Action + "?" + PARAS_KEY + "="	+ URLEncoder.encode(param, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return null;
	}
	/***********************  不常用的方法集  ***************************/
	
	/**
	 * 通过uuid列表获取组的信息（可以一次获取多个组的信息） 每个GroupInfo必须包含uuid和authToken
	 * 返回的Group不含subGroupList
	 * @param uuidList
	 * @return Group中包含uuid,subGroupList
	 */
	public static List<Result> getGroupDirectSubs(List<Group> groups) {
		return getResults(GET_DIRECT_SUBGROUP_URL, groups);
	}

	/**
	 * 通过uuid列表获取组的信息（可以一次获取多个组的信息） 每个GroupInfo必须包含uuid和authToken
	 * 返回的Group不含subGroupList
	 * @param uuidList
	 * @return Group中包含uuid,subGroupList(subGroupList是包含嵌套关系的)
	 */
	public static List<Result> getGroupIndirectSubs(List<Group> groups) {
		return getResults(GET_SUBGROUP_URL, groups);
	}
	
	/**
	 * 判断直属群组关系，（一次可判断多组关系）
	 * 每个Relationship中，需包含父group的uuid和authToken，以及子group的uuid
	 * 
	 * @param relationList
	 * @return
	 */
	public static List<Result> judgeDirectRelation(
			List<Relationship> relationList) {
		return getRelationResults(JUDGE_DIRECT_RELATION_URL, relationList);
	}

	/**
	 * 判断间接属群组关系，（一次可判断多组关系）
	 * 每个Relationship中，需包含父group的uuid和authToken，以及子group的uuid
	 * 
	 * @param relationList
	 * @return
	 */
	public static List<Result> judgeIndirectRelation(
			List<Relationship> relationList) {
		return getRelationResults(JUDGE_RELATION_URL, relationList);
	}
	
	/**
	 * 通过uuid列表获取组的信息（可以一次获取多个组的信息） 每个GroupInfo必须包含uuid和authToken
	 * 
	 * @param uuidList
	 * @return Group中包含uuid,memberList
	 */
	public static List<Result> getGroupDirectMembers(List<Group> groups) {
		return getResults(GET_DIRECT_MEMBER_URL, groups);
	}

	/**
	 * 通过uuid列表获取组的信息（可以一次获取多个组的信息） 每个GroupInfo必须包含uuid和authToken
	 * 
	 * @param infoList
	 * @return Group中包含uuid,memberList(memberList不包含嵌套关系的)
	 */
	public static List<Result> getGroupIndirectMembers(List<Group> groups) {
		return getResults(GET_MEMBER_URL, groups);
	}
	
	/**
	 * 判断群组直属成员关系，（一次可判断多组关系） 每个Membership，需包含父group的uuid和authToken，以及成员的name
	 * 
	 * @param membershipList
	 * @return
	 */
	public static List<Result> judgeDirectMember(List<Membership> membershipList) {
		return getMemberResults(JUDGE_DIRECT_MEMBER_URL, membershipList);
	}

	/**
	 * 判断群组间接属成员关系，（一次可判断多组关系） 每个Membership，需包含父group的uuid和authToken，以及成员的name
	 * 
	 * @param membershipList
	 * @return
	 */
	public static List<Result> judgeIndirectMember(
			List<Membership> membershipList) {
		return getMemberResults(JUDGE_MEMBER_URL, membershipList);
	}

	/**
	 * 查找一个member在一个group下所有直属的组（一次可判断多组关系）
	 * 每个Membership，需包含父group的uuid和authToken，以及成员的name
	 * 每个Membership中如有多余一个成员name则忽略
	 * 返回的组列表在每个Result的 result键值对中
	 * @param membershipList
	 * @return 
	 */
	public static List<Result> findMemberDirectGroups(
			List<Membership> membershipList) {
		return getMemberResults(FIND_MEMBER_GROUP_URL, membershipList);
	}

}