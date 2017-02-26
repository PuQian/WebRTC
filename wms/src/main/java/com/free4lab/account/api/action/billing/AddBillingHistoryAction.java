package com.free4lab.account.api.action.billing;

import java.util.HashMap;
import java.util.Map;
import org.perf4j.aop.Profiled;
import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.manager.BillingBalanceManager.BalanceResult;
import com.free4lab.account.model.Client;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.BillingModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class AddBillingHistoryAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
//	private static final LogUtilManager lol = new LogUtilManager(AddBillingHistoryAction.class);
	
	private String result;
	private String message;
	
	@Profiled(tag="AddBillingHistoryAction.execute")
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
		String strrecid = "";
		if (!pMap.containsKey(Constants.PARAM_RECID)) {
            this.setMessage("缺少参数 " + Constants.PARAM_RECID);
            return SUCCESS;
        }else{
        	strrecid = ((String[]) pMap.get(Constants.PARAM_RECID))[0];
        	if (strrecid.equalsIgnoreCase("") ||!ParameterUtilManager.isInt(strrecid)) {
				this.setMessage("参数不合法" + Constants.PARAM_RECID);
				return SUCCESS;
			}
        	tMap.put(Constants.PARAM_RECID, strrecid);
        }
		
		String strtimes = "";
		if (!pMap.containsKey(Constants.PARAM_TIMES)) {
            this.setMessage("缺少参数 " + Constants.PARAM_TIMES + "，默认值为1");
            strtimes = "1";
        }else{
        	strtimes = ((String[]) pMap.get(Constants.PARAM_TIMES))[0];
        	if (strtimes.equalsIgnoreCase("") ||!ParameterUtilManager.isInt(strtimes)) {
				this.setMessage("参数不合法" + Constants.PARAM_TIMES);
				return SUCCESS;
			}
        	tMap.put(Constants.PARAM_TIMES, strtimes);
        }
		
		String stramount = "";
		if (!pMap.containsKey(Constants.PARAM_AMOUNT)) {
            this.setMessage("缺少参数 " + Constants.PARAM_AMOUNT);
            return SUCCESS;
        }else{
        	stramount = ((String[]) pMap.get(Constants.PARAM_AMOUNT))[0];
        	if(stramount.equalsIgnoreCase("") ||!ParameterUtilManager.isInt(stramount)){
        		this.setMessage("参数不合法" + Constants.PARAM_AMOUNT);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_AMOUNT, stramount);
        }
		
		String name = "";
		if (!pMap.containsKey(Constants.PARAM_PNAME)) {
            this.setMessage("缺少参数 " + Constants.PARAM_PNAME);
            return SUCCESS;
        }else{
        	name = ((String[]) pMap.get(Constants.PARAM_PNAME))[0];
        	if(name.equalsIgnoreCase("") ||!ParameterUtilManager.isStrings(name)){
        		this.setMessage("参数不合法" + Constants.PARAM_PNAME);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_PNAME, name);
        }
		
		String payment_type = "";
		if (!pMap.containsKey(Constants.PARAM_PAYMENT_TYPE)) {
            this.setMessage("缺少参数 " + Constants.PARAM_PAYMENT_TYPE);
            return SUCCESS;
        }else{
        	payment_type = ((String[]) pMap.get(Constants.PARAM_PAYMENT_TYPE))[0];
        	if(payment_type.equalsIgnoreCase("") ||!ParameterUtilManager.isStrings(payment_type)){
        		this.setMessage("参数不合法" + Constants.PARAM_PAYMENT_TYPE);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_PAYMENT_TYPE, payment_type);
        }
		String product_type = "";
		if (!pMap.containsKey(Constants.PARAM_PRODUCT_TYPE)) {
            this.setMessage("缺少参数 " + Constants.PARAM_PRODUCT_TYPE);
            return SUCCESS;
        }else{
        	product_type = ((String[]) pMap.get(Constants.PARAM_PRODUCT_TYPE))[0];
        	if(product_type.equalsIgnoreCase("") ||!ParameterUtilManager.isStrings(product_type)){
        		this.setMessage("参数不合法" + Constants.PARAM_PRODUCT_TYPE);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_PRODUCT_TYPE, product_type);
        }
		String strcount = "";
		if (!pMap.containsKey(Constants.PARAM_COUNT)) {
            this.setMessage("缺少参数 " + Constants.PARAM_COUNT);
            return SUCCESS;
        }else{
        	strcount = ((String[]) pMap.get(Constants.PARAM_COUNT))[0];
        	if(strcount.equalsIgnoreCase("") ||!ParameterUtilManager.isDouble(strcount)){
        		this.setMessage("参数不合法" + Constants.PARAM_COUNT);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_COUNT, strcount);
        }
		String reason = "";
		if (!pMap.containsKey(Constants.PARAM_REASON)) {
            this.setMessage("缺少参数 " + Constants.PARAM_REASON);
            return SUCCESS;
        }else{
        	reason = ((String[]) pMap.get(Constants.PARAM_REASON))[0];
        	if(reason.equalsIgnoreCase("") ||!ParameterUtilManager.isStrings(reason)){
        		this.setMessage("参数不合法" + Constants.PARAM_REASON);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_REASON, reason);
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
		int amount = Integer.parseInt(stramount);
		int recid = Integer.parseInt(strrecid);
		int times = Integer.parseInt(strtimes);
		double count = Double.parseDouble(strcount);
		/**
		 * 完成扣费
		 */
		BalanceResult status = BillingModule.recharge(userId,recid, amount);
		if(status == BalanceResult.INVALID_UID || status == BalanceResult.UID_NOT_EXIST){
			this.setMessage("付款账户不存在");
			if(! accessToken.equalsIgnoreCase("")){
//				lol.warn(userId, "用户级扣费转账失败，付款账户不存在", "计费", accessToken, AccountModule.getClientIdByUser(accessToken));
			}else if(! signature.equalsIgnoreCase("")){
//				lol.warn(userId, "应用级扣费转账失败，付款账户不存在", "计费", signature, source);
			}
			return SUCCESS;
		}else if(status == BalanceResult.UID_BALANCE_NOT_ENOUGH || status == BalanceResult.RECID_BALANCE_NOT_ENOUGH){
			this.setMessage("用户余额不足");
			if(! accessToken.equalsIgnoreCase("")){
//				lol.warn(userId, "用户级扣费转账失败，用户余额不足", "计费", accessToken, AccountModule.getClientIdByUser(accessToken));
			}else if(! signature.equalsIgnoreCase("")){
//				lol.warn(0, "应用级扣费转账失败，用户余额不足", "计费", signature, source);
			}
			return SUCCESS;
		}else if(status == BalanceResult.RECID_NOT_EXIST){
			this.setMessage("收款账户不存在");
			if(! accessToken.equalsIgnoreCase("")){
//				lol.warn(userId, "用户级扣费转账失败，收款账户不存在，recid："+recid, "计费", accessToken, AccountModule.getClientIdByUser(accessToken));
			}else if(! signature.equalsIgnoreCase("")){
//				lol.warn(0, "应用级扣费转账失败，收款账户不存在，recid："+recid, "计费", signature, source);
			}
			return SUCCESS;
		}else if(status == BalanceResult.UPDATE_FAIL){
			this.setMessage("数据库操作失败");
			if(! accessToken.equalsIgnoreCase("")){
//				lol.error(userId, "用户级扣费转账失败，数据库操作失败", "计费", accessToken, AccountModule.getClientIdByUser(accessToken));
			}else if(! signature.equalsIgnoreCase("")){
//				lol.error(0, "应用级扣费转账失败，数据库操作失败", "计费", signature, source);
			}
			return SUCCESS;
		}
		
		/**
		 * 插入一条交易记录
		 */
		result = BillingModule.addBillingHistory(userId,recid,product_type,name,reason,payment_type,times,count, amount);
		if( result.equals("success")){
			this.setMessage("本次交易和插入账户记录成功");
			if(! accessToken.equalsIgnoreCase("")){
//				lol.info(userId, "用户级扣费转账交易和插入账户记录成功", "计费", accessToken, AccountModule.getClientIdByUser(accessToken));
			}else if(! signature.equalsIgnoreCase("")){
//				lol.info(0, "应用级扣费转账交易和插入账户记录成功", "计费", signature, source);
			}
		}else{
			this.setMessage("插入账户记录失败");
			if(! accessToken.equalsIgnoreCase("")){
//				lol.error(userId, "用户级扣费转账成功，插入账户记录失败", "计费", accessToken, AccountModule.getClientIdByUser(accessToken));
			}else if(! signature.equalsIgnoreCase("")){
//				lol.error(0, "应用级扣费转账失败，插入账户记录失败", "计费", signature, source);
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
}
