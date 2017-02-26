package com.free4lab.account.api.action.userinfo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

public class SearchUserInfoAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
//	private static final LogUtilManager lol = new LogUtilManager(SearchUserInfoAction.class);
	
	private List<User> users = null;
	private String result;
	private String message;
	private Integer total;
	
	@Profiled(tag="SearchUserInfoAction.execute")
	public String execute(){
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		result = "fail";
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
		String company = "";
		if(pMap.containsKey(Constants.PARAM_COMPANY)){
			company = ((String[]) pMap.get(Constants.PARAM_COMPANY))[0];
			if(!ParameterUtilManager.isStrings(company)){
				this.setMessage("参数不合法" + Constants.PARAM_COMPANY);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_COMPANY, company);
		}
		String email = "";
		if(pMap.containsKey(Constants.PARAM_EMAIL)){
			email = ((String[]) pMap.get(Constants.PARAM_EMAIL))[0];
			if(!ParameterUtilManager.isStrings(email)){
				this.setMessage("参数不合法" + Constants.PARAM_EMAIL);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_EMAIL, email);
		}
		String real_name = "";
		if(pMap.containsKey(Constants.PARAM_REAL_NAME)){
			real_name = ((String[]) pMap.get(Constants.PARAM_REAL_NAME))[0];
			if(!ParameterUtilManager.isLetterChinese(real_name)){
				this.setMessage("参数不合法" + Constants.PARAM_REAL_NAME);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_REAL_NAME, real_name);
		}
		String description = "";
		if(pMap.containsKey(Constants.PARAM_DESCRIPTION)){
			description = ((String[]) pMap.get(Constants.PARAM_DESCRIPTION))[0];
			if(!ParameterUtilManager.isStrings(description)){
				this.setMessage("参数不合法" + Constants.PARAM_DESCRIPTION);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_DESCRIPTION, description);
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
		int page = Integer.parseInt(strpage);
		int page_size = Integer.parseInt(strpage_size);
		total = UserinfoModule.searchUsersTotal(email, real_name, company, description);
		users = UserinfoModule.searchUsersByPage(email, real_name, company, description, page, page_size);
		if(users != null && users.size() > 0){
			users = UserinfoModule.getBasicUserInfos(users);
		}
//		lol.info(0, "应用级根据用户各项信息获取用户信息（需分页）成功，email:"+email+",company:"+company+",real_name:"+real_name+",description:"+description+",page:"+page+"/"+page_size+",total:"+total, "用户", signature, source);
		result = "success";
		return SUCCESS;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
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

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}
	
	
}