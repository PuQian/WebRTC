package com.webrtc.action;

import org.apache.log4j.Logger;
import java.util.Map;

import javax.ejb.EnterpriseBean;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.entity.Enterprise;
import com.free4lab.webrtc.entity.Enteruser;
import com.free4lab.webrtc.manager.AccountManager;
import com.free4lab.webrtc.manager.EnterpriseManager;
import com.free4lab.webrtc.manager.EnteruserManager;
import com.opensymphony.xwork2.ActionContext;

/**
 * add by yck
 * 进入企业管理前的预处理
 */
public class EnterAdministrationAction extends BaseAction{

	private static final long serialVersionUID = 1L;

	private final Logger logger = Logger.getLogger(EnterAdministrationAction.class);
	
	private Enteruser enteruser;
	private Enterprise enterprise;

	public String execute() throws Exception{
		
		//获取用户名（目前是email）
		Map<String, Object> session = ActionContext.getContext().getSession();
		String email = (String) session.get(SessionConstants.UserEmail);
		
		//根据用户名username查询
		if(email == null || email.equals(""))
			return ERROR;
		else
		{
			//根据username查Account表取得它的uid号
			Integer uid = AccountManager.getUserIdByEmail(email);
			
			//根据uid查询其对应的Enteruser实体对象
			enteruser = EnteruserManager.getByUid(uid);
			if(enteruser == null)
				return ERROR;
			else
			{
				//继续根据eid查找其所在企业的信息
				enterprise = EnterpriseManager.getEnterpriseByEid(enteruser.getEid());
				if(enterprise == null)
					return ERROR;
				else
					return SUCCESS;
			}
		}
	}

	public Enteruser getEnteruser() {
		return enteruser;
	}

	public void setEnteruser(Enteruser enteruser) {
		this.enteruser = enteruser;
	}
	
	public Enterprise getEnterprise() {
		return enterprise;
	}

	public void setEnterprise(Enterprise enterprise) {
		this.enterprise = enterprise;
	}
}
