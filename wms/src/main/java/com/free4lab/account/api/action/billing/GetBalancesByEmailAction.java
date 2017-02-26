package com.free4lab.account.api.action.billing;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.Balance;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.Client;
import com.free4lab.account.module.BillingModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetBalancesByEmailAction extends BaseAction {

	/**
	 * 通过用户email模糊查找用户id、email全称和余额
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(GetBalancesByEmailAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetBalancesByEmailAction.class);
	
	private String message = "fail";
	private List<Balance> balances = null;
	private int total = 0;
	private String result = "fail";
	
	@Profiled(tag="GetUidAndBalanceByEmailAction.execute")
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
		String email = "";
		if (!pMap.containsKey(Constants.PARAM_EMAIL)) {
            this.setMessage("缺少参数 " + Constants.PARAM_EMAIL);
            return SUCCESS;
        }else{
        	email = ((String[]) pMap.get(Constants.PARAM_EMAIL))[0];
        	if(email.equalsIgnoreCase("") || !ParameterUtilManager.isStrings(email)){
        		this.setMessage("参数不合法" + Constants.PARAM_EMAIL);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_EMAIL, email);
        }
		String strpage = "";
		if (!pMap.containsKey(Constants.PARAM_PAGE)) {
            this.setMessage("缺少参数 " + Constants.PARAM_PAGE);
            return SUCCESS;
        }else{
        	strpage = ((String[]) pMap.get(Constants.PARAM_PAGE))[0];
        	if(strpage.equalsIgnoreCase("") || !ParameterUtilManager.isInt(strpage)){
        		this.setMessage("参数不合法" + Constants.PARAM_PAGE);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_PAGE, strpage);
        }
		String strpage_size = "";
		if (!pMap.containsKey(Constants.PARAM_PAGE_SIZE)) {
            this.setMessage("缺少参数 " + Constants.PARAM_PAGE_SIZE);
            return SUCCESS;
        }else{
        	strpage_size = ((String[]) pMap.get(Constants.PARAM_PAGE_SIZE))[0];
        	if(strpage_size.equalsIgnoreCase("") || !ParameterUtilManager.isInt(strpage_size)){
        		this.setMessage("参数不合法" + Constants.PARAM_PAGE_SIZE);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_PAGE_SIZE, strpage_size);
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
			
		int page_size = Integer.parseInt(strpage_size);
		int page = Integer.parseInt(strpage);
		logger.info("email="+email);
		total = BillingModule.getTotalUidsByEmail(email);
		balances = BillingModule.getBalancesByEmailPage(email, page, page_size);
		if(balances == null || (balances != null && balances.size() == 0 )){
			this.setMessage("email错误，不存在此用户");
//			lol.error(0, "应用级根据用户邮箱获取余额等信息失败", "计费", signature, source);
		}else if(balances.size() > 0){
			this.setResult(SUCCESS);
			this.setMessage(SUCCESS);
//			lol.info(0, "应用级根据用户邮箱获取余额等信息成功", "计费", signature, source);
		}
		
		return SUCCESS;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public List<Balance> getBalances() {
		return balances;
	}

	public void setBalances(List<Balance> balances) {
		this.balances = balances;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
}
