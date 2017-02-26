package com.free4lab.account.action.account;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.EmailStatusManager;
import com.free4lab.account.model.EmailStatus;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;


public class PwdRetrieveConfirmingAction extends BaseAction {

	/**
	 * 修改密码方法
	 * 返回修改密码页面
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(PwdRetrieveConfirmingAction.class);
	private String message = "";
    private String uuid = "";
    private String email = "";
    
    @Override
    @Profiled(tag="PwdRetrieveConfirmingAction.execute")
    public String execute() throws Exception {
    	EmailStatus emailStatus = null;
		try {        	
        	emailStatus = EmailStatusManager.SetValidAndfindByUuid(uuid,EmailStatus.TYPE_FINDBACK);
        }catch (Exception ex) {
        	this.message = ex.getMessage();
        	return ERROR;
        }
		if(emailStatus == null){
        	this.message = "找回密码确认流程失败！";
        	return ERROR;
        }
		Map<String, Object> session = ActionContext.getContext().getSession();
		session.put(Constants.SESSION_CLIENT_ID,emailStatus.getClientId());
        session.put(Constants.SESSION_REDIRECT_URI, emailStatus.getRedirectUri());
		String client_id = (String) session.get(Constants.SESSION_CLIENT_ID);
	    String redirect_uri = (String) session.get(Constants.SESSION_REDIRECT_URI);
	    logger.info("client_id:"+client_id+";redirect_uri:"+redirect_uri);
		if (client_id == null || redirect_uri == null) {
            client_id = "userinfo";
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
            redirect_uri = rootUrl + "users/login?redirect_url="+rootUrl+"users/userinfo";
            session.put(Constants.SESSION_CLIENT_ID, client_id);
            session.put(Constants.SESSION_REDIRECT_URI, redirect_uri);
        }
        
		email = emailStatus.getEmail();
		return SUCCESS;
    }
    
    public String getMessage() {
        return message;
    }

    public void setMessage(String msg) {
        message = msg;
    }

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
    
}
