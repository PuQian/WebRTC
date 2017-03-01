package com.free4lab.utils.log;

import java.io.InputStream;
import java.util.Properties;

import org.apache.log4j.Logger;

public class LogConf {
	private static final Logger logger = Logger.getLogger(LogConf.class);
	
	public static String NEW_LINE;
	public static String LOG_PATH;
	public static String FILE_SUFFIX;
	public static String COMMON_URI;
	public static String PUT_URI;
	public static String GET_URI;
	public static String QUERY;
	public static String BATCH_CONTENT;
	public static String LOG_HTTPSTATUS_OK;
	public static String CONNECTION_TIMEOUT;
	public static String STATUS_CODE;
	public static String RESULT_STRING;
	public static String COUNT;
	public static String SEND_COUNT;
	public static String WAIT_TIME;
	public static String MODULER;
	public static String TOPIC;
	
	static {
		Properties p = new Properties();
		InputStream is = LogConf.class.getClassLoader().getResourceAsStream(
				"locallog.properties");
		Properties pc = new Properties();
		InputStream isc = LogConf.class.getClassLoader().getResourceAsStream(
				"app.properties");
		try {
			p.load(is);
			if(isLinux()) {
				NEW_LINE = p.getProperty("NEW_LINE_LINUX");
				LOG_PATH = p.getProperty("LOG_PATH_LINUX");
				FILE_SUFFIX = p.getProperty("FILE_SUFFIX_LINUX");
			} else if(isWindows()) {
				NEW_LINE = p.getProperty("NEW_LINE_WINDOWS");
				LOG_PATH = p.getProperty("LOG_PATH_WINDOWS");
				FILE_SUFFIX = p.getProperty("FILE_SUFFIX_WINDOWS");
			} else {
				throw new Exception("current system is not supported!");
			}
			
			PUT_URI = p.getProperty("PUT_URI");
			GET_URI = p.getProperty("GET_URI");
			QUERY = p.getProperty("QUERY");
			BATCH_CONTENT = p.getProperty("BATCH_CONTENT");
			LOG_HTTPSTATUS_OK = p.getProperty("LOG_HTTPSTATUS_OK").trim();
			CONNECTION_TIMEOUT = p.getProperty("CONNECTION_TIMEOUT").trim();
			STATUS_CODE = p.getProperty("STATUS_CODE");
			RESULT_STRING = p.getProperty("RESULT_STRING");
			COUNT = p.getProperty("COUNT").trim();
			SEND_COUNT = p.getProperty("SEND_COUNT").trim();
			WAIT_TIME = p.getProperty("WAIT_TIME").trim();
			
			pc.load(isc);
			COMMON_URI = pc.getProperty("COMMON_URI", "http://dc.free4lab.com");
			MODULER = pc.getProperty("MODULER", "default");
			TOPIC = pc.getProperty("TOPIC");
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}
	
	public static boolean isWindows() {
		String os = System.getProperty("os.name").toLowerCase();
		return os.indexOf("windows") >= 0;
	}
	
	public static boolean isLinux() {
		String os = System.getProperty("os.name").toLowerCase();
		return os.indexOf("linux") >= 0;
	}
	
	public static void main (String[] args) {
//		if(isLinux()) 
//			System.out.println("system is linux");
//		else if(isWindows())
//			System.out.println("system is windows");
//		else 
//			System.out.println("system is not supported");
		
//		System.out.println(NEW_LINE.equals("\r\n"));
//		System.out.println(LOG_PATH);
//		System.out.println(FILE_SUFFIX);
//		System.out.println(COMMON_URI);
//		System.out.println(PUT_URI);
//		System.out.println(BATCH_CONTENT);
//		System.out.println(LOG_HTTPSTATUS_OK);
//		System.out.println(CONNECTION_TIMEOUT);
//		System.out.println(STATUS_CODE);
//		System.out.println(RESULT_STRING);
//		System.out.println(COUNT);
//		System.out.println(SEND_COUNT);
	}
}
