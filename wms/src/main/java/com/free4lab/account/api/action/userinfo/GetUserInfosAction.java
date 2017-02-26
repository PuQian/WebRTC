package com.free4lab.account.api.action.userinfo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.Client;
import com.free4lab.account.model.User;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetUserInfosAction extends BaseAction {

	/**
	 * 根据用户id获取用户信息的api接口
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(GetUserInfosAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetUserInfosAction.class);
	
	private List<User> users = null;
	private String result ;
	private String message;
	
	@Profiled(tag="GetUserInfosAction.execute")
	public String execute(){
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		String signature = "";
		String source = "";
		String jUserIdList = "";
		if(pMap.containsKey(Constants.PARAM_SIGNATURE) && pMap.containsKey(Constants.PARAM_SOURCE) && pMap.containsKey(Constants.PARAM_USER_IDS)){
			signature = ((String[]) pMap.get(Constants.PARAM_SIGNATURE))[0];
			source = ((String[]) pMap.get(Constants.PARAM_SOURCE))[0];
			jUserIdList = ((String[]) pMap.get(Constants.PARAM_USER_IDS))[0];
			if(signature.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(signature)){
				this.setMessage("参数不合法" + Constants.PARAM_SIGNATURE);
				return SUCCESS;
			}
			if(source.equalsIgnoreCase("") || !ParameterUtilManager.isStrings(source)){
				this.setMessage("参数不合法" + Constants.PARAM_SOURCE);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_SOURCE, source);
			if(jUserIdList.equalsIgnoreCase("") || !ParameterUtilManager.isStrings(jUserIdList)){
				this.setMessage("参数不合法" + Constants.PARAM_USER_IDS);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_USER_IDS, jUserIdList);
		}else{
			this.setMessage("缺少参数 " + Constants.PARAM_SIGNATURE + "，or " +Constants.PARAM_SOURCE + "，or " + Constants.PARAM_USER_IDS);
            return SUCCESS;
		}
		
		Client client = ClientManager.getClientByClientId(source);
		if(client != null && client.getClient_secret() != null){
			String client_secret = client.getClient_secret();
			if( ! signature.equals(AccountUtil.getSignature(tMap, client_secret))){
				setMessage("验证" + Constants.PARAM_SIGNATURE + "错误");
				return SUCCESS;
			}
		}else{
			setMessage("根据" + Constants.PARAM_SOURCE + "查找client错误");
			return SUCCESS;
		}
		List<Integer> userIds = new ArrayList<Integer>();
		try {
			userIds = makeUserIdList(jUserIdList);
		} catch (JSONException e) {
			logger.debug("getUserIdList failed");
			e.printStackTrace();
		}
		if(userIds == null || userIds.size() == 0){
            this.setMessage(Constants.PARAM_USER_IDS+"的大小为0");
            return SUCCESS;
		}
        
		List<User> tempUsers = UserinfoModule.getUsersByIds(userIds);
		if(tempUsers != null){
			logger.info("tempUsers.size()="+tempUsers.size());
		}else{
			logger.info("tempUsers.size()="+tempUsers);
		}
		
		if(tempUsers != null && tempUsers.size() > 0){
			users = UserinfoModule.getBasicUserInfos(tempUsers);
			this.setMessage("根据" + Constants.PARAM_USER_IDS+"获取的user成功");
			setResult("success");
//			lol.warn(0, "应用级获取用户信息失败", "用户", signature, source);
		}else{
			this.setMessage("根据" + Constants.PARAM_USER_IDS+"获取的userlist为null");
		}
		return SUCCESS;
	}
	
	private List<Integer> makeUserIdList(String jUserIdList) throws JSONException{
		List<Integer> userIdList = new ArrayList<Integer>();
		JSONArray array = new JSONArray(jUserIdList);
		logger.info(array.length());
		for(int i=0;i<array.length();i++){
			logger.info(i + " : " + array.getString(i));//.getJSONObject(i));
			Integer userId = Integer.parseInt(array.getString(i));
			userIdList.add(userId);
		}
		return userIdList;
	}
	
	public List<User> getUsers() {
		return users;
	}
	public void setUsers(List<User> users) {
		this.users = users;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

}
