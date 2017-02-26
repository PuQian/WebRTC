package com.free4lab.account.api.action.billing;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;
import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.manager.ShowBillingHistory;
import com.free4lab.account.model.BillingHistory;
import com.free4lab.account.model.Client;
import com.free4lab.account.model.User;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.BillingModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetBillingHistoryAction extends BaseAction {

	/**
	 * 获取历史记录
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(GetBillingHistoryAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetBillingHistoryAction.class);
	
	private List<ShowBillingHistory> records = new ArrayList<ShowBillingHistory>();
	private String message = "";
	private String result = "fail";
	private int total = 0;
	
	@Profiled(tag="GetBillingHistoryAction.execute")
	public String execute() throws Exception{
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		String accessToken = "";
		String signature = "";
		String source = "";
		String uid = "";
		result = "fail";
		if (pMap == null || !pMap.containsKey(Constants.PARAM_ACCESS_TOKEN)) {
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
		String product_type = "";
		if (!pMap.containsKey(Constants.PARAM_PRODUCT_TYPE)) {
            this.setMessage("缺少参数 " + Constants.PARAM_PRODUCT_TYPE);
            return SUCCESS;
        }else{
        	product_type = ((String[]) pMap.get(Constants.PARAM_PRODUCT_TYPE))[0];
        	if(product_type.equalsIgnoreCase("") || !ParameterUtilManager.isStringss(product_type)){
        		this.setMessage("参数不合法" + Constants.PARAM_PRODUCT_TYPE);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_PRODUCT_TYPE, product_type);
        }
		String billing_type = "";
		if (!pMap.containsKey(Constants.PARAM_BILLING_TYPE)) {
            this.setMessage("缺少参数 " + Constants.PARAM_BILLING_TYPE);
            return SUCCESS;
        }else{
        	billing_type = ((String[]) pMap.get(Constants.PARAM_BILLING_TYPE))[0];
        	if(billing_type.equalsIgnoreCase("") || !ParameterUtilManager.isString(billing_type)){
        		this.setMessage("参数不合法" + Constants.PARAM_BILLING_TYPE);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_BILLING_TYPE, billing_type);
        }
		String strbegin_time = "all";
		if (!pMap.containsKey(Constants.PARAM_BEGIN_TIME)) {
            this.setMessage("缺少参数 " + Constants.PARAM_BEGIN_TIME + "，默认值all");
        }else{
        	strbegin_time = ((String[]) pMap.get(Constants.PARAM_BEGIN_TIME))[0];
        	strbegin_time = java.net.URLDecoder.decode(strbegin_time,"utf8");
        	if(strbegin_time.equalsIgnoreCase("") || !ParameterUtilManager.isTime2(strbegin_time)){
        		this.setMessage("参数不合法" + Constants.PARAM_BEGIN_TIME);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_BEGIN_TIME, strbegin_time);
        }
		String strend_time = "all";
		if (!pMap.containsKey(Constants.PARAM_END_TIME)) {
            this.setMessage("缺少参数 " + Constants.PARAM_END_TIME + "，默认值all");
        }else{
        	
        	strend_time = ((String[]) pMap.get(Constants.PARAM_END_TIME))[0];
        	strend_time = java.net.URLDecoder.decode(strend_time,"utf8");
        	if(strend_time.equalsIgnoreCase("") || !ParameterUtilManager.isTime2(strend_time)){
        		this.setMessage("参数不合法" + Constants.PARAM_END_TIME);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_END_TIME, strend_time);
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
			int page = Integer.parseInt(strpage);
			int page_size = Integer.parseInt(strpage_size);
			Timestamp begin_time = null ;
			Timestamp end_time = null ;
			if(!strbegin_time.equalsIgnoreCase("all") && !strend_time.equalsIgnoreCase("all")){
				begin_time = Timestamp.valueOf(strbegin_time);
				end_time = Timestamp.valueOf(strend_time);
			}
			
			logger.info(begin_time);
			logger.info(end_time);
			
			//获取记录
			List<BillingHistory> historys = new ArrayList<BillingHistory>();
			List<String> product_typeList = new ArrayList<String>();
			if(product_type != null && ! product_type.equalsIgnoreCase("") && product_type.indexOf("-") != -1){
				String[] product_types = product_type.split("-");
				for(String str : product_types){
					product_typeList.add(str);
				}
			}else{
				product_typeList.add(product_type);
			}
			
			
			total = BillingModule.getBillingHistorySize(billing_type, product_typeList, userId, begin_time, end_time);
			historys = BillingModule.getBillingHistory(billing_type, product_typeList, userId, begin_time, end_time, page, page_size);
			historys = BillingModule.formatAmountOfBillingHistory(historys, userId);
			logger.info(total);
			logger.info(historys);
			//一次性获取user信息
			Map<Integer, User> userMap = BillingModule.getUserMap(historys);
			//产生返回记录
			records = BillingModule.showBillingHistory(historys, userMap);
			result = "success";
			this.setMessage("获取billinghistory成功");
			if(! accessToken.equalsIgnoreCase("")){
//				lol.info(userId, "用户级获取billinghistory成功", "计费", accessToken, AccountModule.getClientIdByUser(accessToken));
			}else if(! signature.equalsIgnoreCase("")){
//				lol.info(userId, "应用级获取billinghistory成功", "计费", signature, source);
			}
		}else{
			this.setMessage("获取"+Constants.PARAM_USER_ID+"错误！");
			if(! accessToken.equalsIgnoreCase("")){
//				lol.error(userId, "用户级获取billinghistory失败，uid错误", "计费", accessToken , null);
			}else if(! signature.equalsIgnoreCase("")){
//				lol.error(userId, "应用级获取billinghistory失败，uid错误", "计费", signature, source);
			}
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
	
	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public List<ShowBillingHistory> getRecords() {
		return records;
	}

	public void setRecords(List<ShowBillingHistory> records) {
		this.records = records;
	}

}
