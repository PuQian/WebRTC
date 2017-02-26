package com.free4lab.account.api.action.userinfo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.UserManager;
import com.free4lab.account.model.User;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetUserInfosByCompanyAction extends BaseAction {

	/**
	 * 根据用户company获取用户信息的api接口
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(GetUserInfosByCompanyAction.class);
	
	private List<User> users = new ArrayList<User>();
	private String message = "success";
	private int total = 0;
	
	@Profiled(tag="GetUserInfosByCompanyAction.execute")
	public String execute(){
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		if (!pMap.containsKey(Constants.PARAM_COMPANY) || !pMap.containsKey(Constants.PARAM_PAGE)
				|| !pMap.containsKey(Constants.PARAM_PAGE_SIZE) 
				|| !pMap.containsKey(Constants.PARAM_EMAIL)
				|| !pMap.containsKey(Constants.PARAM_SCREEN_NAME)) {
            this.setMessage("缺少参数 ");
            return SUCCESS;
        }
		String company = ((String[]) pMap.get(Constants.PARAM_COMPANY))[0];
		int page = Integer.parseInt(((String[]) pMap.get(Constants.PARAM_PAGE))[0]);
		int pageSize = Integer.parseInt(((String[]) pMap.get(Constants.PARAM_PAGE_SIZE))[0]);
		String screenName = ((String[]) pMap.get(Constants.PARAM_SCREEN_NAME))[0];
		String email = ((String[]) pMap.get(Constants.PARAM_EMAIL))[0];
			
		total = UserManager.getUserByCompany(email, screenName, company).size();
		logger.info(total);
		
		List<User> tempUsers = UserManager.getUserByCompanyByPage(email, screenName, 
				company, page, pageSize);
		//一般的用户信息请求，只返回userId，email，username，avatar，intro
		for( User u : tempUsers ){
			User newUser = new User();
			newUser.setUid(u.getUid());
			newUser.setDescription(u.getDescription());
			newUser.setEmail(u.getEmail());
			if(u.getGender() != null && u.getGender().equals("a")){
				newUser.setGender(u.getGender());
			}
			if(u.getCompany() != null){
				newUser.setCompany(u.getCompany());
			}
			if( null == u.getScreen_name() || u.getScreen_name().length() < 1){
				int l = u.getEmail().indexOf('@');
				if(l == -1){
					newUser.setScreen_name(u.getEmail());
				}else{
					newUser.setScreen_name(u.getEmail().substring(0, l));
				}
			}else{
				newUser.setScreen_name(u.getScreen_name());
			}
			if( null == u.getProfile_image_url() || u.getProfile_image_url().length() < 1){
				newUser.setProfile_image_url(Constants.DEFAULT_AVATAR);
			}else{
				newUser.setProfile_image_url(u.getProfile_image_url());
			}
			users.add(newUser);
		}
		
		return SUCCESS;
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

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

}
