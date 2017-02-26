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
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetEmailByUserIdAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(GetEmailByUserIdAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetEmailByUserIdAction.class);
	private String email = null;
	private String result;
	private String message = "success";
	
	@Profiled(tag="GetEmailByUserIdAction.execute")
	public String execute(){
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		result = "fail";
		setMessage("fail");
		String signature = "";
		String source = "";
		if(pMap.containsKey(Constants.PARAM_SIGNATURE) && pMap.containsKey(Constants.PARAM_SOURCE)){
			signature = ((String[]) pMap.get(Constants.PARAM_SIGNATURE))[0];
			source = ((String[]) pMap.get(Constants.PARAM_SOURCE))[0];
			if(signature.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(signature)){
				this.setMessage("参数不合法" + Constants.PARAM_SIGNATURE);
				return SUCCESS;
			}
			if(source.equalsIgnoreCase("") || !ParameterUtilManager.isStrings(source)){
				this.setMessage("参数不合法" + Constants.PARAM_SOURCE);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_SOURCE, source);
		}else{
			this.setMessage("缺少参数 " + Constants.PARAM_SIGNATURE + "，or " +Constants.PARAM_SOURCE );
            return SUCCESS;
		}
		String uid = "";
		if (!pMap.containsKey(Constants.PARAM_USER_ID)) {
            this.setMessage("缺少参数 " + Constants.PARAM_USER_ID);
            return SUCCESS;
        }else{
        	uid = ((String[]) pMap.get(Constants.PARAM_USER_ID))[0];
        	if(uid.equalsIgnoreCase("") || !ParameterUtilManager.isInt(uid)){
        		this.setMessage("参数不合法" + Constants.PARAM_USER_ID);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_USER_ID, uid);
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
		if (!pMap.containsKey(Constants.PARAM_USER_ID)) {
            this.setMessage("缺少参数 " + Constants.PARAM_USER_ID);
            return SUCCESS;
        }
		int userId = Integer.parseInt(uid);
		if(userId > 0){
			email = UserinfoModule.getEmailByUserId(userId);
			if(email == null || email.equalsIgnoreCase("")){
				this.setMessage(Constants.PARAM_USER_ID + "错误，不存在此用户");
//				lol.warn(0, "应用级根据" + Constants.PARAM_USER_ID + ":"  + userId + "获取email错误，不存在此用户", "用户", signature, source);
			}
//			lol.info(userId, "应用级根据" + Constants.PARAM_USER_ID + ":"  + userId + "获取email:" + email + ",result:"+result, "用户", signature, source);
			result = "success";
			message = "success";
		}else{
			this.setMessage(Constants.PARAM_USER_ID + "错误，小于等于0");
//			lol.error(0, "应用级根据" + Constants.PARAM_USER_ID + ":"  + userId + "获取email错误，uid小于等于0", "用户", signature, source);
		}
		logger.info("uid="+uid);
		
		
		
		
		
		return SUCCESS;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
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
