package com.free4lab.account.action.account;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.AccountModule.LoginResult;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class PwdRetrieveCheckAction extends BaseAction {

	/**
	 * 找回密码页面提交的方法
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(PwdRetrieveCheckAction.class);
	private String message = "";
	private String email = "";
	private String securitycode = "";
	/*private String client_id = "";
	private String redirect_uri = "";*/

	@Override
	@Profiled(tag="PwdRetrieveCheckAction.execute")
	public String execute() throws Exception {
		//获取account的地址
		String rootUrl = Constants.HTTPS_ACCOUNT;
    	/*HttpServletRequest request = ServletActionContext.getRequest();
    	if ((request.getContextPath() == null || request.getContextPath().equals("")) && request.getServerPort() == 80) {
            rootUrl = request.getScheme() + "://" + request.getServerName() + "/" ;
        } else if ((request.getContextPath() == null || request.getContextPath().equals("")) && request.getServerPort() != 80) {
            rootUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/";
        } else if ((request.getContextPath() != null && !request.getContextPath().equals("")) && request.getServerPort() == 80) {
            rootUrl = request.getScheme() + "://" + request.getServerName() + "/" + request.getContextPath() + "/";
        } else {
            rootUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()  + request.getContextPath()+"/";
        }*/
    	logger.info(rootUrl);
		//获取session信息
		Map<String, Object> session = ActionContext.getContext().getSession();
		String client_id = (String) session.get(Constants.SESSION_CLIENT_ID);
		String redirect_uri = (String) session.get(Constants.SESSION_REDIRECT_URI);
		System.out.println("client_id:"+client_id);
		System.out.println("redirect_uri:"+redirect_uri);
		if(!securitycode.equalsIgnoreCase((String) session.get(Constants.SESSION_SECURITY_CODE))){
			this.message = "验证码输入错误，请重新输入！";
			return "fail";
		}
        if (client_id == null || redirect_uri == null) {
        	client_id = "userinfo";
            redirect_uri = rootUrl + "users/login?redirect_url="+rootUrl+"users/userinfo";
            session.put(Constants.SESSION_CLIENT_ID, client_id);
            session.put(Constants.SESSION_REDIRECT_URI, redirect_uri);
        }
        //检查email是否已经注册过
        LoginResult isUserValid = AccountModule.valid(email,"");	        
        if (isUserValid == LoginResult.PASSWORD_ERROR) {
    		if(AccountModule.pwdretrieve(client_id, redirect_uri, email, rootUrl)){
    			return SUCCESS;
    		}else{
    			this.message = "邮件发送失败！";
            	return "fail";
    		}
        }else{
        	setMessage("该邮箱未注册！");
            return "fail";
        }
	 }
	 
	 public String getMessage() {
		 return message;
	 }

	 public void setMessage(String msg) {
	     message = msg;
	 }
	    
	 public String getEmail() {
		 return email;
	 }

	 public void setEmail(String email) {
	     this.email = email;
	 }
	 
	 public String getSecuritycode() {
			return securitycode;
		}

		public void setSecuritycode(String securitycode) {
			this.securitycode = securitycode;
		}

	    
	/* public String getClient_id() {
		 return client_id;
	 }

	 public void setClient_id(String client_id) {
		 this.client_id = client_id;
	 }   
		
	 public String getRedirect_uri() {
		 return redirect_uri;
	 }

	 public void setRedirect_uri(String redirect_uri) {
		 this.redirect_uri = redirect_uri;
	 }*/

}
