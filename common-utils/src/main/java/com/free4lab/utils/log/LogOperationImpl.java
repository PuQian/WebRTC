package com.free4lab.utils.log;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class LogOperationImpl implements LogOperation{
	private static Logger logger = Logger.getLogger(LogOperationImpl.class);
	
	private static final int SEND_COUNT = Integer.valueOf(LogConf.SEND_COUNT);//一次发10条
	private static final String SEPARATOR = "_";
	private static final String FILE_SUFFIX= LogConf.FILE_SUFFIX;//文件后缀
	private static final int COUNT = Integer.valueOf(LogConf.COUNT);//满COUNT写入文件
	private static final int WAIT_TIME = Integer.valueOf(LogConf.WAIT_TIME);
	public static LinkedBlockingQueue<LogStruct> logQueue = new LinkedBlockingQueue<LogStruct>();
	public static LinkedBlockingQueue<LogStruct> urgentLogQuene = new LinkedBlockingQueue<LogStruct>();
	
	static {
		flushToFile();
		consumeLog();
		consumeUrgentLog();
	}
	
	public String getLog(String topic, Map<String,String> query) {
		JSONObject jObject = new JSONObject(query);
		String uri = null;
		try {
			uri =  LogConf.COMMON_URI
						+ LogConf.GET_URI
						+ CommonPropertyEnum.TOPIC 
						+ "="
						+ topic 
						+ "&"
						+ LogConf.QUERY 
						+ "="
						+ URLEncoder.encode(jObject.toString(), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage());
			return null;
		}
		
		Map<String, String> result = sendHttpRequest(uri);	
		if(result.get(LogConf.STATUS_CODE).equals(LogConf.LOG_HTTPSTATUS_OK)) {
			return result.get(LogConf.RESULT_STRING);
		} else {
			logger.error("get log from hbase failed");
			return null;
		}
	}	
	
	public boolean produceLog(String topic, Map<String, String> properties) {
		if(topic == null || topic.equals("")) {
			logger.error("topic can not be empty");
			return false;
		} else {
			JSONObject jObject = null;
			if(properties != null && properties.size() > 0) {
				String createTime = properties.get(CommonPropertyEnum.CREATE_TIME);
				if(createTime == null || "".equals(createTime)) {
					createTime = String.valueOf(System.currentTimeMillis());
					properties.put(CommonPropertyEnum.CREATE_TIME.toString(), createTime);
				}
				jObject = new JSONObject(properties);
			}
			
			LogStruct log = null;
			try {
				log = new LogStruct(topic, URLEncoder.encode(jObject.toString(),"UTF-8"));
			} catch (UnsupportedEncodingException e) {
				logger.error(e.getMessage());
			}
			
			if(log != null) {
				if(properties.containsKey("logLevel") && properties.get("logLevel").equalsIgnoreCase("error")) {
					return writeToUrgentBuff(log);
				} else {
					return writeToBuff(log);
				}
			} else {
				return false;
			}
		}
	}
	
	private boolean writeToBuff(LogStruct object) {
		if(object == null) {
			return true;
		} else {
			try{
				logQueue.put(object);
				return true;
			} catch(InterruptedException e) {
				logger.error("interrupted when waiting for empty space of log queue", e);
				return false;
			}
		}
	}
	
	private static boolean writeToUrgentBuff(LogStruct object) {
		if(object == null) {
			return true;
		} else {
			try{
				urgentLogQuene.put(object);
				return true;
			} catch(InterruptedException e) {
				logger.error("interrupted when waiting for empty space of log queue", e);
				return false;
			}
		}
	}
	
	public static void consumeUrgentLog() {
		new Thread(
			new Runnable() {
				@Override
				public void run() {
					LogStruct log = null;		
					while(true) {
						try {
							log = urgentLogQuene.take();
							if(log != null && log.topic != null) {
								String uri = LogConf.COMMON_URI + LogConf.PUT_URI + "topic=" + log.topic+ "&" + 
										LogConf.BATCH_CONTENT + "=" + URLEncoder.encode(log.jsonContent,"UTF-8");
								logger.info("send urgent log : " + sendHttpRequest(uri).get(LogConf.STATUS_CODE));
							}
						} catch (InterruptedException e) {
							e.printStackTrace();
						} catch (UnsupportedEncodingException e) {
							e.printStackTrace();
						}
					}
				}
			}).start();
	}

	private static void consumeLog(){
		new Thread(
				new Runnable(){
					@Override
					public void run() {
						File file = new File(LogConf.LOG_PATH + LogConf.TOPIC + SEPARATOR + LogConf.MODULER + FILE_SUFFIX);
						File consumeFile = new File(file.getAbsolutePath()+".tmp");
						try {
							while(true) {
								if(!file.exists() || file.length() == 0) {
									Thread.sleep(100);
									continue;
								}
								if(!consumeFile.exists()) {
									try {
										file.renameTo(consumeFile);
										if(!file.exists())
											file.createNewFile();
									} catch (Exception e) {
										logger.error(e.getMessage());
										return;
									}
								}
									
								ArrayList<String> contents = new ArrayList<String>();
								DataInputStream dis = new DataInputStream(new FileInputStream(consumeFile));
								String line = dis.readLine();
								int readline = 0;
								while(line != null) {
									if(line.trim().equals("")) {
										continue;
									} else {
										contents.add(line);
										readline++;
									}
									if(readline >= SEND_COUNT) {
										JSONArray jArray = new JSONArray();
										for(String content : contents) {
											jArray.put(new JSONObject(URLDecoder.decode(content, "UTF-8")));
										}
												
										String uri = LogConf.COMMON_URI + LogConf.PUT_URI + "topic=" + LogConf.TOPIC + "&" + 
												LogConf.BATCH_CONTENT + "=" + URLEncoder.encode(jArray.toString(),"UTF-8");
										logger.info(sendHttpRequest(uri).get(LogConf.STATUS_CODE));
										readline = 0;
										contents.clear();
									}
									line = dis.readLine();
									
								}
								dis.close();
								if(contents != null && contents.size() != 0) {
									JSONArray jArray = new JSONArray();
									for(String content : contents) {
										jArray.put(new JSONObject(URLDecoder.decode(content, "UTF-8")));
									}
									String uri = LogConf.COMMON_URI + LogConf.PUT_URI + "topic=" + LogConf.TOPIC + "&" + 
											LogConf.BATCH_CONTENT + "=" + URLEncoder.encode(jArray.toString(),"UTF-8");
									//sendHttpRequest(uri);
									logger.info(sendHttpRequest(uri).get(LogConf.STATUS_CODE));
								}
								consumeFile.delete();
								
								Thread.sleep(WAIT_TIME * 1000);
							}
						}catch(Exception e) {
							logger.error(e.getMessage(),e);
						}
					}
				}).start();
	}
	
	private static Map<String, String> sendHttpRequest(String uri) {
		HttpClient httpclient = new HttpClient();
		httpclient.getHttpConnectionManager().getParams().setConnectionTimeout(Integer.valueOf(LogConf.CONNECTION_TIMEOUT));
		GetMethod method = new GetMethod(uri);
		int statusCode;
		Map<String, String> result = new HashMap<String, String>();
		try {
			statusCode = httpclient.executeMethod(method);
			result.put(LogConf.STATUS_CODE, String.valueOf((statusCode)));
			if(statusCode != Integer.valueOf(LogConf.LOG_HTTPSTATUS_OK)){
				logger.info("HTTP访问失败！错误代码："+statusCode);
				result.put(LogConf.RESULT_STRING, "");
			}else{
				result.put(LogConf.RESULT_STRING, method.getResponseBodyAsString());
				return result;
			}
		} catch (HttpException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			httpclient.getHttpConnectionManager().closeIdleConnections(0);
		}
		return result;
	}
		
	private static void flushToFile() {
		new Thread(
				new Runnable(){
					@Override
					public void run() {
						try {
							File path = new File(LogConf.LOG_PATH);
							if(!path.exists())
								path.mkdirs();
							
							LogStruct log  = null;
							Map<String, String> topicContent = new HashMap<String,String>();
							while(true) {
								topicContent.clear();
								log = logQueue.take();
								
								int count = 0;
								while(log != null) {
									if(topicContent.containsKey(log.topic)) {
										topicContent.put(log.topic, topicContent.get(log.topic)+log.jsonContent+LogConf.NEW_LINE);
									} else {
										topicContent.put(log.topic, log.jsonContent+LogConf.NEW_LINE);
									}
									count++;
									if(count >= COUNT) 
										break;
									log = logQueue.poll(100,TimeUnit.MILLISECONDS);
								}		
								
								for(Map.Entry<String, String> entry : topicContent.entrySet()) {
									LogFileUtil.appendFile(
											new File(LogConf.LOG_PATH + entry.getKey()+ SEPARATOR + LogConf.MODULER + FILE_SUFFIX), 
											entry.getValue());
								}
							}
						} catch (InterruptedException e) {
							logger.error(e.getMessage());
						} catch (Exception e) {
							logger.error(e.getMessage());
						}
					}
				}).start();
	}
	
	public static void main(String[] args) throws JSONException, UnsupportedEncodingException, InterruptedException {
		LogOperationImpl op = new LogOperationImpl();
		Map<String, String> pros = new HashMap<String, String>();
		for(int k =0 ;k<5000;k++) {
			for(int i=0; i<10; i++) {
				pros.put("userId", "745");
				pros.put("purpose", "test final ok");
				pros.put("level", "info");
				op.produceLog("loltest", pros);
			}
			Thread.sleep(500);
		}
	}
}
