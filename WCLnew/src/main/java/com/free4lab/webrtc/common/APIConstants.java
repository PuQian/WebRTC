package com.free4lab.webrtc.common;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

/**
 * 常量，其值待抽离出.properties文件
 * @author qiepei
 *
 */
public class APIConstants {
	//WMS中Account3.0认证地址
	public static final String WMS_URL;
	
	//WCS地址
	public static final String WCS_URL;
	
	//WEBIM地址
	public static final String WEBIM_URL;
	
	//WMS 外网地址
	public static final String URL_ACCOUNT;
	
	//NGINX 外网地址
	public static final String NGINX_ACCOUNT;

	//webrtc地址	
	public static final String SECRET_KEY;
	
	//freeaccount api前缀
	public static final String APIPrefix_FreeAccount;
	
	//front api地址 https
	public static final String APIPrefix_FreeFront;
	
	//front api地址 http
	public static final String APIPrefix_HTTP_FreeFront;
	
	//freeaccount api地址
	
	public static final String frAccountAPI_getUserInfo;
	public static final String frAccountAPI_getToken;
	public static final String frAccountAPI_loginurl;
	public static final String frAccountAPI_registerurl;
	
	static {
        final Logger logger = Logger.getLogger("App configuration");
        logger.info("+++++++++++App configuration information++++++++++++");
        try {
            Properties p = new ConfigurationUtil().getPropertyFileConfiguration("app.properties");
            
            SECRET_KEY = p.getProperty("SECRET_KEY");
            logger.info("SECRET_KEY:" + SECRET_KEY);
            
            APIPrefix_FreeFront = p.getProperty("APIPrefix_FreeFront");
            logger.info("APIPrefix_FreeFront:" + APIPrefix_FreeFront);
           
            APIPrefix_HTTP_FreeFront = p.getProperty("APIPrefix_HTTP_FreeFront");
            logger.info("APIPrefix_HTTP_FreeFront:" + APIPrefix_HTTP_FreeFront);
            
            
            APIPrefix_FreeAccount = p.getProperty("APIPrefix_FreeAccount");
            logger.info("APIPrefix_FreeAccount:" + APIPrefix_FreeAccount);
            
            WMS_URL = p.getProperty("WMS_URL");
            logger.info("WMS_AuthAddress:"+WMS_URL);

            WCS_URL = p.getProperty("WCS_URL");
            logger.info("WCS_AuthAddress:"+WCS_URL);
            
            WEBIM_URL = p.getProperty("WEBIM_URL");
            logger.info("WEBIM_AuthAddress:"+WEBIM_URL);
            
            URL_ACCOUNT = p.getProperty("URL_ACCOUNT");
            logger.info("URL_ACCOUNT_AuthAddress:"+URL_ACCOUNT);
            
            NGINX_ACCOUNT = p.getProperty("Nginx_URL");
            logger.info("NGINX_ACCOUNT_AuthAddress:"+NGINX_ACCOUNT);
            
            frAccountAPI_getUserInfo = 
        		APIPrefix_FreeAccount + "api/getUserInfo";
        	frAccountAPI_getToken = 
        		APIPrefix_FreeAccount + "api/getAccessToken";
        	frAccountAPI_loginurl = 
        		APIPrefix_FreeAccount + "login?customId=webrtc&handleUrl=";
        	frAccountAPI_registerurl = 
        		APIPrefix_FreeAccount + "register?customId=webrtc&handleUrl=";
        	
        } catch (IOException e) {
            logger.fatal("Failed to init app configuration", e);
            throw new RuntimeException("Failed to init app configuration", e);
        }
        logger.info("----------App configuration successfully----------");
    }
	
//	public static void main(String[] args){
//		System.out.println("ddddddddd");
//	}
}