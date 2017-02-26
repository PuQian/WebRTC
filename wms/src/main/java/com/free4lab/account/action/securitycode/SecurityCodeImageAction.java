package com.free4lab.account.action.securitycode;

import java.io.ByteArrayInputStream;

import org.apache.log4j.Logger;

/*import com.idc.action.common.BaseAction;
import com.idc.action.common.Constants;*/
import com.free4lab.utils.action.BaseAction;
import com.free4lab.account.common.Constants;
import com.opensymphony.xwork2.ActionContext;

public class SecurityCodeImageAction extends BaseAction{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(SecurityCodeImageAction.class);
	//图片流
    private ByteArrayInputStream imageStream;
    private String secode;
    public String getSecode() {
		return secode;
	}

	public void setSecode(String secode) {
		this.secode = secode;
	}

	public String execute() throws Exception {
        //如果开启Hard模式，可以不区分大小写
    	//String securityCode = SecurityCode.getSecurityCode(4,SecurityCodeLevel.Hard, false).toLowerCase();
        
        //获取默认难度和长度的验证码
        String securityCode = SecurityCode.getSecurityCode();
        secode = securityCode;
        imageStream = SecurityImage.getImageAsInputStream(securityCode);
        logger.info("SESSION_SECURITY_CODE :"+securityCode);
        //放入session中
        ActionContext.getContext().getSession().put(Constants.SESSION_SECURITY_CODE,securityCode);
        return SUCCESS;
    }

	public ByteArrayInputStream getImageStream() {
		return imageStream;
	}

	public void setImageStream(ByteArrayInputStream imageStream) {
		this.imageStream = imageStream;
	}
    
    
    
}
