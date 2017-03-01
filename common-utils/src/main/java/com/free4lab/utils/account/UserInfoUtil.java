package com.free4lab.utils.account;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.struts2.json.JSONUtil;
import org.json.JSONException;
import org.json.JSONObject;

import com.free4lab.utils.http.HttpCrawler;

public class UserInfoUtil {
	private static final Logger logger = Logger.getLogger(UserInfoUtil.class);
	
	private static final int TIME_OUT = 3000;
	
	/**
	 * 通过用户的accessToken列表得到用户的全部userinfo
	 * @param accessToken
	 * @return
	 */
	public static UserInfo getUserinfoByAccesstoken(String accessToken){
		String action = AccountUtil.URL_USER_INFO;
		UserInfo user = new UserInfo();
		List<UserInfo> users = new ArrayList<UserInfo>();
		try{
			String param = "?" + AccountUtil.ACCESS_TOKEN_KEY + "=" + URLEncoder.encode(accessToken, "UTF-8");
			JSONObject ro = getResult(action, param);
			System.out.println("param:"+param);
			System.out.println("ro:"+ro);
			try {
				String result = ro.getString(AccountUtil.RESULT_KEY);
				if( ! result.equalsIgnoreCase(AccountUtil.SUCCESS_KEY)){
					return null;
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			users = UserInfo.getList(ro,AccountUtil.USER_KEY);
			if(users != null && users.size() >0 ){
				user = users.get(0);
			}
		}catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return user;
	}
	
	/**
	 * 通过用户的id列表得到用户的基本信息,包括id、头像、昵称、邮件
	 * @param accessToken
	 * @param userIdList
	 * @return List<UserInfo> 
	*/
	public static List<UserInfo> getUserInfoByUid(String source,String signature, List<Integer> userIdList){
		String action = AccountUtil.URL_USER_INFOS;
		List<UserInfo> users = new ArrayList<UserInfo>();
		try {
			String param = "?" + AccountUtil.SOURCE_KEY + "=" + URLEncoder.encode(source, "UTF-8")
							+ "&" + AccountUtil.SIGNATURE_KEY + "=" + URLEncoder.encode(signature, "UTF-8");
			if(userIdList != null && userIdList.size() > 0){
				param += "&" + AccountUtil.USER_ID_LIST_KEY+ "=" + URLEncoder.encode(JSONUtil.serialize(userIdList), "UTF-8");
			}
			JSONObject ro = getResult(action, param);
			try {
				String result = ro.getString(AccountUtil.RESULT_KEY);
				if( ! result.equalsIgnoreCase(AccountUtil.SUCCESS_KEY)){
					return null;
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			users = UserInfo.getList(ro,AccountUtil.USERS_KEY);
			
			
		} catch (org.apache.struts2.json.JSONException e) {
			logger.debug(action + " failed!", e);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return users;
	}
	
	private static JSONObject getResult (String action, String params){
		String url = getUserInfoURL() + action + params;
		String result = HttpCrawler.getHtmlDoc(url, null, TIME_OUT);
		if(result != null){
			try {
				return new JSONObject(result);
			} catch (JSONException e) {
				logger.error("failed in getResult", e);
			}
		}
		return new JSONObject();
	}
	
	private static String getUserInfoURL(){
		return AccountUtil.INURL_ACCOUNT;
	}

}
