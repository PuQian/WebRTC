package com.free4lab.account.action.account;

import org.perf4j.aop.Profiled;

import com.free4lab.utils.action.BaseAction;

public class PwdRetrieveAction extends BaseAction {

	/**
	 * 找回密码方法
	 * 返回找回密码页面
	 */
	private static final long serialVersionUID = 1L;
	//private static final Logger logger = Logger.getLogger(PwdRetrieveAction.class);
	private String message = "";
    /*private String client_id = "";
    private String redirect_uri = "";*/
	
	@Override
	@Profiled(tag="PwdRetrieveAction.execute")
    public String execute() throws Exception {
        /*Map<String, Object> session = ActionContext.getContext().getSession();        
        String client_id = (String) session.get(Constants.SESSION_CLIENT_ID);
        String redirect_uri = (String) session.get(Constants.SESSION_REDIRECT_URI);

        if (client_id != null && !client_id.equals("")) {
            if (session.get(Constants.SESSION_CLIENT_ID) == null) {
                session.put(Constants.SESSION_CLIENT_ID, client_id);
            } else {
                session.remove(Constants.SESSION_CLIENT_ID);
                session.put(Constants.SESSION_CLIENT_ID, client_id);
            }
        }
        
        if (redirect_uri != null && !redirect_uri.equals("")) {
            if (session.get(Constants.SESSION_REDIRECT_URI) == null) {
                session.put(Constants.SESSION_REDIRECT_URI, redirect_uri);           
            } else {
                session.remove(Constants.SESSION_REDIRECT_URI);
                session.put(Constants.SESSION_REDIRECT_URI, redirect_uri);
            }
        }
        
        logger.info("client_id:"+client_id+";redirect_uri:"+redirect_uri);*/
        return SUCCESS;
        
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String msg) {
        message = msg;
    }
    
	/*public String getClient_id() {
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
