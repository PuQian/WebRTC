package com.free4lab.account.api.action.account;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccountManager;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.Client;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.AccountModule.LoginResult;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class DelUserAction extends BaseAction {
	/**
	 * 删除用户
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(DelUserAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(DelUserAction.class);
	private String message = "";
	private String result = "fail";
	
	@Profiled(tag="DelUserAction.execute")
	public String execute() throws Exception{
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> hashMap = new HashMap<String, String>();
		String email = "";
		if (!pMap.containsKey(Constants.PARAM_EMAIL)) {
			this.setMessage("缺少参数" + Constants.PARAM_EMAIL);
			return SUCCESS;
		}else{
			email = ((String[]) pMap.get(Constants.PARAM_EMAIL))[0];
			if(email.equalsIgnoreCase("") || !ParameterUtilManager.isEmail(email)){
				this.setMessage("参数不合法" + Constants.PARAM_EMAIL);
				return SUCCESS;
			}
			hashMap.put(Constants.PARAM_EMAIL, email);
		}
		
		String source = "";
		if (!pMap.containsKey(Constants.PARAM_SOURCE)) {
			this.setMessage("缺少参数" + Constants.PARAM_SOURCE);
			return SUCCESS;
		}else{
			source = ((String[]) pMap.get(Constants.PARAM_SOURCE))[0];
			if(source.equalsIgnoreCase("") || !ParameterUtilManager.isString(source)){
				this.setMessage("参数不合法" + Constants.PARAM_SOURCE);
				return SUCCESS;
			}
			hashMap.put(Constants.PARAM_SOURCE, source);
		}
		
		String signature = "";
		if (!pMap.containsKey(Constants.PARAM_SIGNATURE)) {
			this.setMessage("缺少参数" + Constants.PARAM_SIGNATURE);
			return SUCCESS;
		}else{
			signature = ((String[]) pMap.get(Constants.PARAM_SIGNATURE))[0];
			if(signature.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(signature)){
				this.setMessage("参数不合法" + Constants.PARAM_SIGNATURE);
				return SUCCESS;
			}
		}
		Client client = ClientManager.getClientByClientId(source);
		if(client != null && client.getClient_secret() != null){
			String client_secret = client.getClient_secret();
			if( ! signature.equals(AccountUtil.getSignature(hashMap, client_secret))){
				setMessage("验证" + Constants.PARAM_SIGNATURE + "错误");
				return SUCCESS;
			}else if(client.getNeed_author() != null && client.getNeed_author().equals("1")){
				LoginResult result = AccountModule.valid(email, "");
		        if (result == LoginResult.PASSWORD_ERROR) { 
		        	logger.info("删除账户成功");
		        	int uid = AccountManager.getUserIdByEmail(email);
		        	if(AccountModule.destroyUser(email)){
		        		this.setResult("success");
	                	this.setMessage("删除成功");
//	                	lol.info(0, "应用级删除用户成功，email:"+email + ",uid:"+uid, "账号", signature, source);
		        	}else{
		        		this.setResult("fail");
		            	this.setMessage("删除失败");
//		            	lol.error(0, "应用级删除用户失败，email:"+email, "账号", signature, source);
		        	}
		        } else {
		        	this.setResult("fail");
		        	this.setMessage("该用户未注册");
//		        	lol.warn(0, "应用级删除用户失败，该用户未注册，email:"+email, "账号", signature, source);
		        }
			}else{
				setMessage(Constants.PARAM_SOURCE+":"+source + "没有权限");
//				lol.error(0, "应用级删除用户失败，"+ Constants.PARAM_SOURCE+":"+source + "没有权限", "账号", signature, source);
				return SUCCESS;
			}
		}else{
			this.setResult("fail");
			this.setMessage("根据" + Constants.PARAM_SOURCE + "查找client错误");
		}
		return SUCCESS;
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
