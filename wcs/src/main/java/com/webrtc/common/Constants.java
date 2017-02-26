package com.webrtc.common;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;

public class Constants {
	//this five line not use
	public final static String MEDIA_SERVER_ADDR;
	public final static String WCS_RESTSEVER_PORT;
	public final static String WCS_RESTSEVER_ADDR;
	public final static String SPE_URI;
	public final static String SPE_PATH;
	
	public final static String WCS_TCP_LISTEN_PORT;
	public final static String WCS_UDP_LISTEN_PORT;
	public final static String WCS_NAME;
	
	public final static String WISG_FLAG;
	public final static String WCSG_FLAG;
	public final static String WISG_DOMAIN;
	public final static String WCSG_DOMAIN;
	
	public final static String USER_TIMEOUT_DELAY;
	public final static String WISG_TIMEOUT_DELAY_SECOND;
	public final static String WCSG_TIMEOUT_DELAY_SECOND ;
	
	public final static String AUTO_FLAG;
	public final static String ARTI_FLAG ;
	
	
	static {
		  final Logger logger = Logger.getLogger("App configuration");
	        logger.info("+++++++++++App configuration information++++++++++++");
		try {
			   Properties p = new ConfigurationUtil().getPropertyFileConfiguration("app.properties");
	            
			   WCS_TCP_LISTEN_PORT = p.getProperty("WCS_TCP_LISTEN_PORT");
	            logger.info("WCS_TCP_LISTEN_PORT:" + WCS_TCP_LISTEN_PORT);
	            
	            WCS_UDP_LISTEN_PORT = p.getProperty("WCS_UDP_LISTEN_PORT");
	            logger.info("WCS_UDP_LISTEN_PORT:" + WCS_UDP_LISTEN_PORT);
	            
	            WCS_NAME = p.getProperty("WCS_NAME");
	            logger.info("WCS_NAME:" + WCS_NAME);
	           
	            WISG_FLAG = p.getProperty("WISG_FLAG");
	            logger.info("WISG_FLAG:" + WISG_FLAG);
	            WCSG_FLAG = p.getProperty("WCSG_FLAG");
	            logger.info("WCSG_FLAG:" + WCSG_FLAG);
	            
	            WISG_DOMAIN = p.getProperty("WISG_DOMAIN");
	            logger.info("WISG_DOMAIN:" + WISG_DOMAIN);
	            
	            WCSG_DOMAIN = p.getProperty("WCSG_DOMAIN");
	            logger.info("WCSG_DOMAIN:" + WCSG_DOMAIN);
	            
	            USER_TIMEOUT_DELAY = p.getProperty("USER_TIMEOUT_DELAY");
	            logger.info("USER_TIMEOUT_DELAY:" + USER_TIMEOUT_DELAY);
	            
	            WISG_TIMEOUT_DELAY_SECOND = p.getProperty("WISG_TIMEOUT_DELAY_SECOND");
	            logger.info("WISG_TIMEOUT_DELAY_SECOND:" + WISG_TIMEOUT_DELAY_SECOND);
	            
	            WCSG_TIMEOUT_DELAY_SECOND = p.getProperty("WCSG_TIMEOUT_DELAY_SECOND");
	            logger.info("WCSG_TIMEOUT_DELAY_SECOND:" + WCSG_TIMEOUT_DELAY_SECOND);
	            
	            ARTI_FLAG = p.getProperty("ARTI_FLAG");
	            logger.info("ARTI_FLAG:" + ARTI_FLAG);
	            
	            AUTO_FLAG = p.getProperty("AUTO_FLAG");
	            logger.info("AUTO_FLAG:" + AUTO_FLAG);
	            
//			these 4 line not use
			MEDIA_SERVER_ADDR =  "1.1.1.1";
			WCS_RESTSEVER_PORT = "8082";
			SPE_URI = "http://10.109.247.136:8082/";
			SPE_PATH ="axis2/services/QoSV1/DynamicQoS";
			WCS_RESTSEVER_ADDR = WebrtcUtil.getHostAddress() + ":" + "8082";
			
			
		} catch (IOException e) {
           throw new RuntimeException("Failed to init app configuration", e);
        }
	}
}