package com.free4lab.account.common;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

import com.free4lab.account.common.ConfigurationUtil;

public class Constants {
	/**
	 * userinfo登录后保存用户信息的session键值
	 */
	public final static String KEY_USER_ID = "uid";
    public final static String KEY_SCREEN_NAME = "screen_name";
    public final static String KEY_USER_EMAIL = "email";
    public final static String KEY_PROFILE_IMAGE_URL = "profile_image_url";
    public final static String KEY_ACCESSTOKEN = "access_token";
    public final static String KEY_ACCTOKEN = "acc_token";

    public final static String WebRTC_WMS_ID = "WebRTC";
    
	/**
     *API参数的信息
     */
    //add by yck
    public final static String PARAM_USERNAME = "userName";
	public final static String PARAM_STATE = "state";
	public final static String PARAM_CLIENT_ID = "client_id";
	public final static String PARAM_REDIRECT_URI = "redirect_uri";
	public final static String PARAM_CLIENT_SECRET = "client_secret";
	public static final String PARAM_CODE = "code";
	public static final String PARAM_GRAND_TYPE = "grand_type";
	public final static String PARAM_EMAIL = "email";
	public final static String PARAM_PSW_MD5 = "passwordMd5";
	public final static String PARAM_APP_ID = "aid";
	public final static String PARAM_USER_ID_LIST = "user_id_list";
	public final static String PARAM_ACCESS_TOKEN = "access_token";
	public final static String PARAM_USER_ID = "uid";
	public final static String PARAM_FRIEND_ID = "friend_id";
	public final static String PARAM_GROUP_ID = "group_id";
	public final static String PARAM_NAME = "name";
	public final static String PARAM_GROUP_NAME = "group_name";
	public final static String PARAM_NEW_GROUP_ID = "new_group_id";
	public final static String PARAM_OLD_GROUP_ID = "old_group_id";
	public final static String PARAM_COMPANY = "company";
	public static final String PARAM_PAGE_SIZE = "page_size";
	public static final String PARAM_PAGE = "page";
	public final static String PARAM_SCREEN_NAME = "screen_name";
	public final static String PARAM_AVATAR = "profile_image_url";
	public final static String PARAM_REAL_NAME = "real_name";
	public final static String PARAM_GENDER = "gender";
	public final static String PARAM_DESCRIPTION = "description";
	public final static String PARAM_PHONE = "phone";
	public final static String PARAM_QQ = "qq";
	public final static String PARAM_EMAIL_HOME = "email_home";
	public final static String PARAM_EMAIL_WORK = "email_work";
	public final static String PARAM_PHONE_HOME = "phone_home";
	public final static String PARAM_PHONE_WORK = "phone_work";
	public final static String PARAM_OLD_PWD = "old_pwd";
	public final static String PARAM_PWD = "pwd";
	public final static String PARAM_SIGNATURE = "signature";
	public final static String PARAM_SOURCE = "source";
	public final static String PARAM_USER_IDS = "uids";	
	public final static String PARAM_INVITER_EMAIL = "inviter_email";	
	public final static String PARAM_TEMP_TYPE = "temp_type";	
	public final static String PARAM_TEMP_EXTEND = "temp_extend";	
	public final static String PARAM_TEMP_URL = "temp_url";	
	public final static String PARAM_TEMP_BEGINTIME = "temp_begintime";	
	public final static String PARAM_TEMP_NAME = "temp_name";	

	/**
     * 计费模块，参数信息
     */
	public final static String PARAM_AMOUNT = "amount";
	public final static String PARAM_RECID = "recid";
	public final static String PARAM_TIMES = "times";
	public final static String PARAM_PNAME = "name";
	public final static String PARAM_PAYMENT_TYPE = "payment_type";
	public final static String PARAM_PRODUCT_TYPE = "product_type";
	public final static String PARAM_COUNT = "count";
	public final static String PARAM_REASON = "reason";
	public final static String PARAM_BILLING_TYPE = "billing_type";
	public final static String PARAM_BEGIN_TIME = "begin_time";
    public final static String PARAM_END_TIME = "end_time";
	
	public static final String SSO_LOGOUT_URL = "/logout";
    
    /**
     * account登录模块中保存session的key值
     */
	//add by yck
	public final static String SESSION_ID = "id";
	public final static String SESSION_USER_ID = "uid";
	public final static String SESSION_CLIENT_ID = "client_id";
    public final static String SESSION_REDIRECT_URI = "redirect_uri";
    public final static String SESSION_CODE = "code";
    public final static String SESSION_RANDOM = "random";
    public final static String SESSION_LOGIN_APP = "login_app";
    public final static String SESSION_CLIENT_SECRET = "client_secret";
    public final static String SESSION_GRANT_TYPE = "grant_type";
    public final static String SESSION_ACCESSTOKEN = "access_token";
    public final static String SESSION_CODE_TO_SEND = "code_to_send";
    public final static String SESSION_WCS_TOKEN = "wcs_token";
    
    public final static int PAYMENT_ONCE = 0;
    public final static int PAYMENT_YEAR = 1;
    public final static int PAYMENT_MONTH = 2;
    public final static int PAYMENT_DAY = 3;
    public final static int PAYMENT_TIMES = 4;
    
    public final static String SYSTEM_EASYCODE;
    public final static String OAUTHTOKEN_EXPIRE_TIME;
    public final static String ACCESSTOKEN_EXPIRE_TIME;
    public final static String PWDTOKEN_EXPIRE_TIME;
    public final static String EMAIL_EXPIRE_TIME;
    public final static String DEFAULT_AVATAR;
    public final static String SYSTEM_AVATARS;
    public final static String CLIENT_SECRET_KEY;
    public final static String CLIENT_ID;
    public final static String PLATFORM_EMAIL;//平台进账邮箱
    public final static int MAX_FREEACCOUNT_ATTEMPTS;
    public final static int BILLING_MOUNT;
    public final static String URL_ACCOUNT;
    
    //account https
    public final static String HTTPS_ACCOUNT;
    
    //CSS JS库
    public final static String CSS_JS_SERVER;
    
    //disk
    public final static String URL_DISK;
    public final static String DISK_UUID1;
    public final static String DISK_UUID2;
    
    //log
    public final static String URL_LOG;
    public final static String URL_LOG_PUSH_LOG;
    public final static String URL_LOG_GET_SEARCH;
    public final static String LOG_TOPIC_VALUE;
    public final static String LOG_SIZE_VALUE;
    public final static String LOG_TOPIC = "topic";
    public final static String LOG_USERID = "userId";
    public final static String LOG_ACTION = "action";
    public final static String LOG_SOURCE = "source";
    public final static String LOG_CONTENT = "content";
    public final static String LOG_CREATEDTIME = "createdTime";
    public final static String LOG_STATUS = "status";
    public final static String LOG_MESSAGE = "message";
    public final static String LOG_CLIENT_ID = "clientId";
	public static final String LOG_TRANSACTION_ID = "transactionId";
	public static final String LOG_SIZE = "size";
	public static final String LOG_RESULT = "result";
	public static final String LOG_OFFSET = "offset";
	public static final String LOG_IPADDRESS = "ipaddress";
	public static final String LOG_ACCESSTOKEN = "accessToken";
	public final static String LOG_TIME = "logTime";
	public final static String LOG_LEVEL = "logLevel";
	public static final int LOG_HTTPSTATUS_OK = 200;
	public final static String LOG_LEVEL_INFO = "info";
	public final static String LOG_LEVEL_ERROR = "error";
	public final static String LOG_LEVEL_DEBUG = "debug";
	public final static String LOG_LEVEL_WARN = "warn";
	public static final String LOG_BTIME = "btime";
	public static final String LOG_ETIME = "etime";
	public static final String LOG_TIMEASC= "timeasc";
	/*
	 * 定义两种分页的大小*/
	public static final Integer PAGE_SIZE_1 = 10;
	public static final Integer PAGE_SIZE_2 = 15;
	
	/*email配置*/
	public static final String EMAIL_FROM;
	public static final String EMAIL_PWD;
	public static final String EMAIL_HOST;
	
	//iaas登录页的链接
	public static final String IAAS_LOGIN_URL;
	
	public static final String SESSION_SECURITY_CODE = "securityCode";
	
	//add by yck
    public static final String ACL_URL; //总机客户端的请求地址
    public static final String SWITCHBOARD_WMS_ID; //总机客户端的标志
    
    static {
        final Logger logger = Logger.getLogger("App configuration");
        logger.info("+++++++++++App configuration information++++++++++++");
        try {
            Properties p = new ConfigurationUtil().getPropertyFileConfiguration("app.properties");
            
            OAUTHTOKEN_EXPIRE_TIME = p.getProperty("OAUTHTOKEN_EXPIRE_TIME");
            logger.info("OAUTHTOKEN_EXPIRE_TIME:" + OAUTHTOKEN_EXPIRE_TIME);

            ACCESSTOKEN_EXPIRE_TIME = p.getProperty("ACCESSTOKEN_EXPIRE_TIME");
            logger.info("ACCESSTOKEN_EXPIRE_TIME:" + ACCESSTOKEN_EXPIRE_TIME);
            
            EMAIL_EXPIRE_TIME  = p.getProperty("EMAIL_EXPIRE_TIME");
            logger.info("EMAIL_EXPIRE_TIME:" + EMAIL_EXPIRE_TIME);
            
            DEFAULT_AVATAR = p.getProperty("DEFAULT_AVATAR");
            logger.info("DEFAULT_AVATAR:" + DEFAULT_AVATAR);
            
            SYSTEM_AVATARS = p.getProperty("SYSTEM_AVATARS");
            logger.info("SYSTEM_AVATARS:" + SYSTEM_AVATARS);
            
            SYSTEM_EASYCODE = p.getProperty("SYSTEM_EASYCODE");
            logger.info("SYSTEM_EASYCODE:" + SYSTEM_EASYCODE);
            
            CLIENT_ID = p.getProperty("CLIENT_ID");
            logger.info("CLIENT_ID:" + CLIENT_ID);
            
            CLIENT_SECRET_KEY = p.getProperty("CLIENT_SECRET_KEY");
            logger.info("CLIENT_SECRET_KEY:" + CLIENT_SECRET_KEY);
            
            URL_ACCOUNT=p.getProperty("URL_ACCOUNT");
			logger.info("URL_ACCOUNT:" + URL_ACCOUNT);
            
            CSS_JS_SERVER = p.getProperty("CSS_JS_SERVER");
            logger.info("CSS_JS_SERVER:" + CSS_JS_SERVER);
            
            MAX_FREEACCOUNT_ATTEMPTS = Integer.parseInt(p.getProperty("MAX_FREEACCOUNT_ATTEMPTS"));
            logger.info("MAX_FREEACCOUNT_ATTEMPTS:" + MAX_FREEACCOUNT_ATTEMPTS);
            
            BILLING_MOUNT = Integer.parseInt(p.getProperty("BILLING_MOUNT"));
            logger.info("BILLING_AMOUNT:" + PARAM_AMOUNT);
            
            PLATFORM_EMAIL = p.getProperty("PLATFORM_EMAIL");
            logger.info("PLATFORM_EMAIL:" + PLATFORM_EMAIL);
            
            PWDTOKEN_EXPIRE_TIME = p.getProperty("PWDTOKEN_EXPIRE_TIME");
            logger.info("PWDTOKEN_EXPIRE_TIME:"+PWDTOKEN_EXPIRE_TIME);
            
            //disk
            URL_DISK = p.getProperty("URL_DISK");
            logger.info("URL_DISK:" + URL_DISK);
            
            DISK_UUID1 = p.getProperty("DISK_UUID1");
            logger.info("DISK_UUID1:" + DISK_UUID1);
            
            DISK_UUID2 = p.getProperty("DISK_UUID2");
            logger.info("DISK_UUID2:" + DISK_UUID2);
            
            //log
            URL_LOG = p.getProperty("URL_LOG");
            logger.info("URL_LOG:" + URL_LOG);
            
            URL_LOG_PUSH_LOG = URL_LOG + "push/batchlog";
            logger.info("URL_LOG_PUSH_LOG:" + URL_LOG_PUSH_LOG);
            
            URL_LOG_GET_SEARCH = URL_LOG + "get/search";
            logger.info("URL_LOG_GET_SEARCH:" + URL_LOG_GET_SEARCH);
            
            LOG_TOPIC_VALUE = p.getProperty("LOG_TOPIC_VALUE");
            logger.info("LOG_TOPIC_VALUE:" + LOG_TOPIC_VALUE);
            
            LOG_SIZE_VALUE = p.getProperty("LOG_SIZE_VALUE");
            logger.info("LOG_SIZE_VALUE:" + LOG_SIZE_VALUE);
            
            HTTPS_ACCOUNT = p.getProperty("HTTPS_ACCOUNT","https://account.free4lab.com/");
            logger.info("HTTPS_ACCOUNT:" + HTTPS_ACCOUNT);
            
            EMAIL_FROM = p.getProperty("EMAIL_FROM","free4lab@163.com");
            logger.info("EMAIL_FROM:" + EMAIL_FROM);
            
            EMAIL_PWD = p.getProperty("EMAIL_PWD","telestar");
            logger.info("EMAIL_PWD:" + EMAIL_PWD);
            
            EMAIL_HOST = p.getProperty("EMAIL_HOST","smtp.163.com");
            logger.info("EMAIL_HOST:" + EMAIL_HOST);
            
            IAAS_LOGIN_URL = p.getProperty("IAAS_LOGIN_URL","#");
            logger.info("IAAS_LOGIN_URL:" + IAAS_LOGIN_URL);
            
            ACL_URL = p.getProperty("ACL_URL");
            logger.info("ACL_URL:" + ACL_URL);
            
            SWITCHBOARD_WMS_ID = p.getProperty("SWITCHBOARD_WMS_ID");
            logger.info("SWITCHBOARD_WMS_ID:" + SWITCHBOARD_WMS_ID);
            
        } catch (IOException e) {
            logger.fatal("Failed to init app configuration", e);
            throw new RuntimeException("Failed to init app configuration", e);
        }
        logger.info("----------App configuration successfully----------");
    }
    
   
}
