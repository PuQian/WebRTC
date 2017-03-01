/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */
package com.free4lab.utils.http;

import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.log4j.Logger;
/**
 * 爬虫工具
 * @author yicou
 */
public class HttpCrawler {
	
	private static final Logger logger = Logger.getLogger(HttpCrawler.class);
	
    private static ThreadLocal<HttpClient> client = new ThreadLocal<HttpClient>() {
        protected synchronized HttpClient initialValue() {
            return new HttpClient();
        }
    };
    /**
     * 通过url和参数进行抓取
     * @param url 基础url
     * @param paras 参数map, 同一个key对应一个List参数列表
     * @return
     */
    public static String getHtmlDoc(String url, Map<String, List<String>> paras) {
        return getHtmlDoc(url, paras, 2000);
    }
    /**
     * 通过url和参数进行抓取
     * @param url 基础url
     * @param paras 参数map, 同一个key对应一个List参数列表
     * @return
     */
    public static String getHtmlDoc(String url, Map<String, List<String>> paras, int timeout) {
        String encodeUrl = url;
        if(paras!=null){
	        boolean flag = false;
	        for (String key : paras.keySet()) {
	            for (String value : paras.get(key)) {
	                if (!flag) {
	                    encodeUrl += "?";
	                    flag = true;
	                } else {
	                    encodeUrl += "&";
	                }
	                try {
	                encodeUrl += URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(value, "UTF-8");
	                } catch (Exception ex) {
	                	logger.warn("invalid url : "+ encodeUrl);
	                }
	            }
	        }
        }
        return getString(encodeUrl, timeout);
    }
    public static String getHtmlDoc(String url, Map<String, List<String>> paras, int timeout, int retrycount) {
    	String result = null;
		while (retrycount > 0) {
			result = getHtmlDoc(url, paras, timeout);
			retrycount--;
			if (result != null)
				break;
		}
        return result;
    }
    /**
     * 获得url的字符串流
     * @param url
     * @return
     */
    public static String getString(String url, int timeout) {
        byte[] bs = getBytes(url, timeout);
        try {
            return new String(bs, "utf-8");
        } catch (Exception ex) {
        	logger.warn(ex);
            return null;
        }
    }

    /**
     * 获取url的字节流
     * @param url String
     * @return
     */
    public static byte[] getBytes(String url) {
        return getBytes(url, 2000);
    }

    /**
     * 获取url的字节流
     * @param url String
     * @param timeout int 超时时间(单位ms)
     * @return
     */
    public static byte[] getBytes(String url, int timeout) {
        try {
            HttpMethod method = new GetMethod(url);
            method.setFollowRedirects(true);
            client.get().getHttpConnectionManager().getParams().setConnectionTimeout(timeout);
            method.getParams().
                    setParameter(HttpMethodParams.SO_TIMEOUT, timeout);
            int resCode = client.get().executeMethod(method);
            if (resCode != HttpStatus.SC_OK) {
            	logger.warn("get response code : "+ resCode);
                return null;
            }
            return method.getResponseBody();
        } catch (Exception e) {
        	logger.warn(e);
            return null;
        }
    }
}
