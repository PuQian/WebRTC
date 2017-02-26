package com.free4lab.account.api.action.userinfo;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.Client;
import com.free4lab.account.model.User;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetUserInfoAction extends BaseAction {

	/**
	 * 根据用户id获取用户信息的api接口
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(GetUserInfoAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetUserInfoAction.class);
	
	private User user = null;
	private String result;
	private String message;
	
	@Profiled(tag="GetUserInfosAction.execute")
	public String execute(){
		logger.info("获取用户信息");
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		result = "fail";
		String accessToken = "";
		String signature = "";
		String source = "";
		String uid = "";
		if (!pMap.containsKey(Constants.PARAM_ACCESS_TOKEN)) {
			if(pMap.containsKey(Constants.PARAM_SIGNATURE) && pMap.containsKey(Constants.PARAM_SOURCE) && pMap.containsKey(Constants.PARAM_USER_ID)){
				signature = ((String[]) pMap.get(Constants.PARAM_SIGNATURE))[0];
				source = ((String[]) pMap.get(Constants.PARAM_SOURCE))[0];
				uid = ((String[]) pMap.get(Constants.PARAM_USER_ID))[0];
				if(signature.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(signature)){
					this.setMessage("参数不合法" + Constants.PARAM_SIGNATURE);
					return SUCCESS;
				}
				if(source.equalsIgnoreCase("") || !ParameterUtilManager.isStrings(source)){
					this.setMessage("参数不合法" + Constants.PARAM_SOURCE);
					return SUCCESS;
				}
				tMap.put(Constants.PARAM_SOURCE, source);
				if(uid.equalsIgnoreCase("") || !ParameterUtilManager.isInt(uid)){
					this.setMessage("参数不合法" + Constants.PARAM_USER_ID);
					return SUCCESS;
				}
				tMap.put(Constants.PARAM_USER_ID, uid);
				}else{
					this.setMessage("缺少参数 " + Constants.PARAM_ACCESS_TOKEN +"，or 缺少参数："+ Constants.PARAM_SIGNATURE + "，" +Constants.PARAM_SOURCE + "，" + Constants.PARAM_USER_ID);
		            return SUCCESS;
				}
        }else{
        	accessToken = ((String[]) pMap.get(Constants.PARAM_ACCESS_TOKEN))[0];
        	if (accessToken.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(accessToken)) {
				this.setMessage("参数不合法" + Constants.PARAM_ACCESS_TOKEN);
				return SUCCESS;
			}
        }
		int userId = -1;
		if(! accessToken.equalsIgnoreCase("")){
			userId = UserinfoModule.getUserIdByAccessToken(accessToken);
		}else{
			Client client = ClientManager.getClientByClientId(source);
			if(client != null && client.getClient_secret() != null){
				String client_secret = client.getClient_secret();
				if( ! signature.equals(AccountUtil.getSignature(tMap, client_secret))){
					setMessage("验证" + Constants.PARAM_SIGNATURE + "错误");
					return SUCCESS;
				}else{
					userId = Integer.parseInt(uid);
				}
			}else{
				setMessage("根据" + Constants.PARAM_SOURCE + "查找client错误");
				return SUCCESS;
			}
			
		}
		if(userId > 0){
			user = new User();
			user = UserinfoModule.getUserByUserId(userId);
			user = UserinfoModule.getBasicUserInfo(user);
			if(user != null){
				result = "success" ;
				if( ! accessToken.equalsIgnoreCase("")){
					this.setMessage("根据" + Constants.PARAM_ACCESS_TOKEN + "获取User成功");
//					lol.info(userId, "用户级根据" + Constants.PARAM_ACCESS_TOKEN + ":" + accessToken+ "获取用户信息成功", "用户", accessToken, AccountModule.getClientIdByUser(accessToken));
				}else{
					this.setMessage("根据" + Constants.PARAM_SIGNATURE + "获取User成功");
//					lol.info(userId, "应用级根据" + Constants.PARAM_ACCESS_TOKEN + ":" + accessToken+ "获取用户信息成功", "用户", signature, source);
				}
			}else{
				this.setMessage("根据" + Constants.PARAM_ACCESS_TOKEN + "获取User错误");
				if(! accessToken.equalsIgnoreCase("")){
//					lol.warn(userId, "用户级获取用户信息失败", "用户", accessToken, AccountModule.getClientIdByUser(accessToken));
				}else if(! signature.equalsIgnoreCase("")){
//					lol.warn(0, "应用级获取用户信息失败", "用户", signature, source);
				}
				
			}
		}else{
			if(! accessToken.equalsIgnoreCase("")){
//				lol.error(-1, "用户级获取用户信息失败，userId错误","用户", accessToken, null);
			}else if(! signature.equalsIgnoreCase("")){
//				lol.error(-1, "用户级获取用户信息失败，userId错误", "用户", signature, source);
			}
			this.setMessage("accessToken invalid");
		}
		return SUCCESS;
	}
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
	
}
