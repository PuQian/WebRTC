package com.free4lab.account.action.account;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.AccountModule.LoginResult;
import com.free4lab.utils.action.BaseAction;
import com.free4lab.utils.hash.Md5Util;
import com.opensymphony.xwork2.ActionContext;

public class RegCheckAction extends BaseAction {

	/**
	 * 注册提交方法
	 * 第一步，填写用户数据
	 * 第二步，发送邮件至注册的邮箱
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(RegCheckAction.class);

	private String email = "";
	private String result = "fail";
	private String message = "注册失败";
	private String passwordMd5 = "";
	//前端传来的验证码
	private String code = "";
	/* private String redirect_uri = "";
	private String client_id = ""; */
	
	@Profiled(tag="RegCheckAction.execute")
	public String execute() throws Exception{
		Pattern pattern = Pattern.compile("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*.\\w+([-.]\\w+)*$");
		Matcher matcher = pattern.matcher(email);
		if(email.equalsIgnoreCase("") || passwordMd5.equalsIgnoreCase("") || !matcher.matches()){
			setMessage("输入非法字符！");
        	//result = "输入非法字符！";
        	return "fail";
		}
		Map<String, Object> session = ActionContext.getContext().getSession();
		if(!code.equalsIgnoreCase((String) session.get(Constants.SESSION_SECURITY_CODE))){
			this.message = "验证码输入错误，请重新输入！";
			return "fail";
		}
		
		
		
        String rootUrl = Constants.HTTPS_ACCOUNT;//其实就是account的地址
		/*HttpServletRequest request = ServletActionContext.getRequest();
        if ((request.getContextPath() == null || request.getContextPath().equals("")) && request.getServerPort() == 80) {
            rootUrl = request.getScheme() + "://" + request.getServerName() + "/";
        } else if ((request.getContextPath() == null || request.getContextPath().equals("")) && request.getServerPort() != 80) {
            rootUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/";
        } else if ((request.getContextPath() != null && !request.getContextPath().equals("")) && request.getServerPort() == 80) {
            rootUrl = request.getScheme() + "://" + request.getServerName() + request.getContextPath() + "/";
        } else {
            rootUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";
        }*/
        logger.info("rootUrl:"+rootUrl);
        //client_id和redirect_uri已经在转到登录页面的时候记录到session了
        //Map<String, Object> session = ActionContext.getContext().getSession();
        String client_id = (String) session.get(Constants.SESSION_CLIENT_ID);
        String redirect_uri = (String) session.get(Constants.SESSION_REDIRECT_URI);
        System.out.println("In RegCheckAction one client_id="+client_id);
        System.out.println("In RegCheckAction one redirect_uri="+redirect_uri);
        if (client_id == null || redirect_uri == null) {
            client_id = "userinfo";
            redirect_uri = rootUrl + "users/login?redirect_url="+rootUrl+"users/userinfo";
            session.put(Constants.SESSION_CLIENT_ID, client_id);
            session.put(Constants.SESSION_REDIRECT_URI, redirect_uri);
        }
        logger.info("client_id:"+client_id+";redirect_uri:"+redirect_uri);
        logger.info("rootUrl:"+rootUrl);
        //检查email是否已经注册过
        String pwdSalt = Md5Util.getMd5Standard(passwordMd5 + email);
        LoginResult isUserValid = AccountModule.valid(email,pwdSalt);
        logger.info("isUserValid:"+isUserValid);
        if(isUserValid == LoginResult.USERNAME_NOT_EXISTED){
        	if(AccountModule.register(client_id, redirect_uri, email, pwdSalt, rootUrl)){
        		result="success";
        		return SUCCESS;
        	}else{
        		setMessage("邮件发送失败！");
            	//result = "邮件发送失败";
            	return "fail";
        	}
        }else{
        	setMessage("该邮箱已被注册");
        	//result = "该邮箱已被注册";
            return "fail";
        }
        
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

	/*public String getClient_id() {
		return client_id;
	}

	public void setClient_id(String client_id) {
		this.client_id = client_id;
	}*/

	/*public String getRedirect_uri() {
		return redirect_uri;
	}

	public void setRedirect_uri(String redirect_uri) {
		this.redirect_uri = redirect_uri;
	}*/
	
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPasswordMd5() {
        return passwordMd5;
    }

    public void setPasswordMd5(String passwordMd5) {
        this.passwordMd5 = passwordMd5;
    }

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
