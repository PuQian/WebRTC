package com.free4lab.webrtc.common;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

import com.opensymphony.xwork2.ActionSupport;

//import com.free4lab.webrtc.action.basic.BaseAction;

public class ServerAddUtil extends ActionSupport {
    
	final Logger logger=Logger.getLogger(ServerAddUtil.class);
	private String webim_add;
    private String wcs_add;
    private String stun_add;
    private String wms_add;
    private String nginx_add;
    private String netty_add;
    private String ofs_add;
    
    public String execute() throws IOException{
    	Properties p=new ConfigurationUtil().getPropertyFileConfiguration("app.properties");
    	webim_add = p.getProperty("WEBIM_URL");
    	wcs_add = p.getProperty("WCS_URL");
    	
    	stun_add = p.getProperty("STUN_URL");
    	
    	wms_add = p.getProperty("URL_ACCOUNT");
    	nginx_add = p.getProperty("Nginx_URL");
    	netty_add = p.getProperty("NETTY_URL");
    	ofs_add = p.getProperty("OFS_URL");
    	
//    	System.out.println("read from utils:"+webim_add+"\n"+wcs_add+"\n"+wms_add+"\n"+nginx_add+"\n");
    	return SUCCESS;
    }

	public String getOfs_add() {
		return ofs_add;
	}

	public void setOfs_add(String ofs_add) {
		this.ofs_add = ofs_add;
	}

	public String getStun_add() {
		return stun_add;
	}

	public void setStun_add(String stun_add) {
		this.stun_add = stun_add;
	}

	public String getWcs_add() {
		return wcs_add;
	}

	public void setWcs_add(String wcs_add) {
		this.wcs_add = wcs_add;
	}

	public String getWebim_add() {
		return webim_add;
	}

	public void setWebim_add(String webim_add) {
		this.webim_add = webim_add;
	}

	public String getWms_add() {
		return wms_add;
	}

	public void setWms_add(String wms_add) {
		this.wms_add = wms_add;
	}

	public String getNginx_add() {
		return nginx_add;
	}

	public void setNginx_add(String nginx_add) {
		this.nginx_add = nginx_add;
	}

	public String getNetty_add() {
		return netty_add;
	}

	public void setNetty_add(String netty_add) {
		this.netty_add = netty_add;
	}
}
