package com.free4lab.webrtc.manager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import com.free4lab.webrtc.common.APIConstants;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.dao.AccountDAO;
import com.free4lab.webrtc.entity.Account;
import com.free4lab.utils.account.UserInfo;
import com.free4lab.utils.account.UserInfoUtil;
import com.opensymphony.xwork2.ActionContext;

public class AccountManager {

	private static final Logger logger = Logger.getLogger(AccountManager.class);
	private static final String ACCESS_TOKEN = "accessToken";
	private static final String KEY = "key";

    /**
     * accountDAO的静态实例
     */
    private static AccountDAO accountDAO = new AccountDAO();
	
	/**
	 * 根据oauthToken和webrtc的secret_key向freeaccount获取用户accessToken
	 * 
	 * @param oauthToken
	 * @return accessToken
	 */
	public static String getAccessToken(String oauthToken) {
		logger.info("session中无accessToken，通过oauthToken获取");
		HashMap<String, List<String>> params = new HashMap<String, List<String>>();
		List<String> keyValue = new ArrayList<String>();
		// 构造参数变量
		keyValue.add(APIConstants.SECRET_KEY);
		keyValue.add(oauthToken);
		params.put(KEY, keyValue);

		String accessToken = null;
		String result = HttpApiManager.invokeApi(
				APIConstants.frAccountAPI_getToken, params);
		try {
			JSONObject obj = new JSONObject(result);
			accessToken = obj.getString(ACCESS_TOKEN);
		} catch (NullPointerException npe) {
			logger.debug("account api :return null", npe);
		} catch (JSONException je) {
			logger.debug("Analysis Json object failed!", je);
		}
		return accessToken;
	}

	/**
	 * 通过API向frAccount获取用户信息,检验session中的内容是否还有效
	 * 
	 * @param accessToken
	 * @return result 向account请求得到的结果
	 */
	public static String getUserInfoByAccessToken(String accessToken) {
		// 初始化
		HashMap<String, List<String>> params = new HashMap<String, List<String>>();
		List<String> valueList = new ArrayList<String>();
		// 构造参数变量
		valueList.add(accessToken);
		params.put("key", valueList);
		String result = HttpApiManager.invokeApi(
				APIConstants.frAccountAPI_getUserInfo, params);
		return result;
	}

	/**
	 * 通过API向frAccount获取用户信息
	 * 
	 * @param accessToken
	 * @return 成功获取,则返回获得的UserInfo；否则返回null
	 */
/*	public static UserInfo getUserInfo(String accessToken) {
		logger.info("通过accessToken向userInfo获取用户信息。accessToken :" + accessToken);
		String myUserInfo = getUserInfoByAccessToken(accessToken);
		//List<UserInfo> uiList = UserInfoUtil
		//		.getUserInfoByUid(accessToken, null);
		//if (uiList != null & uiList.size() > 0) {
			//UserInfo ui = uiList.get(0);
		
			return ui;
		//}else{
		//	logger.info("获取用户信息失败失败。");
		//	return null;
		//}
	}*/
	/**
	 * 把用户信息和accessToken写入到session
	 * 
	 * @return 
	 * 成功写入返回 true;否则返回false 
	 * 
	 */
	public static boolean writeToSession(JSONObject ui, String accessToken){
		if(ui != null){
			
			Map<String, Object> session = ActionContext.getContext()
					.getSession();
			try {
				session.put(SessionConstants.UserID, ui.getInt("userId"));
				session.put(SessionConstants.UserName, ui.getString("userName"));
				session.put(SessionConstants.UserEmail, ui.getString("email"));
				session.put(SessionConstants.Avatar, ui.getString("avatar"));		
				session.put(SessionConstants.AccessToken, accessToken);
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}			
			//session.put(SessionConstants.Groups, getGroupsUUIDS(ui.getUserId()));
			logger.info("获取用户信息并写入session。");
			
			return true;
		}else{
			
			return false;
		}
	}
	/*private static String getGroupsUUIDS(String userId){
		
		List<Group> groups =  GroupManager.getGroupsByUser(Integer.parseInt(userId));
		if(groups == null){
			groups = new ArrayList<Group>();
		}
		String groupString = "";
		for(Group g : groups){
			groupString += (g.getUuid() + ",");
		}
		if(groupString.length() > 1){
			return groupString.substring(0, groupString.length() - 1);
		}else
			return groupString;
	}*/
	
    /**
     * 根据用户邮箱获取数字id
     * @param email
     * @return
     */
    public static int getUserIdByEmail(String email){
    	List<Account> list = accountDAO.findByProperty("email", email);
    	if (list.size() <= 0) {
            return -1;
        } else {
            return list.get(0).getId();
        }
    }
}
