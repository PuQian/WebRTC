package com.free4lab.account.api.action.billing;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.Client;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.BillingModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetBalanceAction extends BaseAction {

	/**
	 * 获取余额
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(GetBalanceAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetBalanceAction.class);
	private String result = "fail";
	private String message = "";
	private Integer balance;
	
	@Profiled(tag="GetBalanceAction.execute")
	public String execute(){
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		String accessToken = "";
		String signature = "";
		String source = "";
		String uid = "";
		result = "fail";
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
		if( ! accessToken.equalsIgnoreCase("")){
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
		if(userId > 0 ){
			balance = BillingModule.getBalance(userId);
			if( balance != null){
				result = "success";
				this.setMessage("获取balance成功！");
				if(! accessToken.equalsIgnoreCase("")){
//					lol.info(userId, "用户级获取balance成功", "计费", accessToken, AccountModule.getClientIdByUser(accessToken));
				}else if(! signature.equalsIgnoreCase("")){
//					lol.info(userId, "应用级获取balance成功", "计费", signature, source);
				}
			}else{
				this.setMessage("获取balance失败！");
				if(! accessToken.equalsIgnoreCase("")){
//					lol.warn(userId, "用户级获取balance失败", "计费", accessToken, AccountModule.getClientIdByUser(accessToken));
				}else if(! signature.equalsIgnoreCase("")){
//					lol.warn(userId, "应用级获取balance失败", "计费", signature, source);
				}
			}
			logger.info("balance:"+balance);
		}else{
			this.setMessage("获取用户失败！");
			if(! accessToken.equalsIgnoreCase("")){
//				lol.error(-1, "用户级获取用户失败", "计费", accessToken, null);
			}else if(! signature.equalsIgnoreCase("")){
//				lol.error(-1, "应用级获取用户失败", "计费", signature, source);
			}
		}
		
		return SUCCESS;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Integer getBalance() {
		return balance;
	}

	public void setBalance(Integer balance) {
		this.balance = balance;
	}
	
}
