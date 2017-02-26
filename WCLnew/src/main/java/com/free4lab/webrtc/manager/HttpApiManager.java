package com.free4lab.webrtc.manager;

import com.free4lab.utils.http.HttpCrawler;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

public class HttpApiManager {

	private static final Logger logger = Logger.getLogger(HttpApiManager.class);
	/**
	 * 由于API不稳定，简单做了个重发机制。每次请求返回null后，会重发请求，最多重传十次。
	 * 
	 * @param url
	 * @param params
	 * @return 搜索结果字符串
	 */
	public static String invokeApi(String url, Map<String, List<String>> params) {
		String result = null;
		try { 
			for(int i=0;i<10;i++){
				result = HttpCrawler.getHtmlDoc(url, params, 4000);
				if (null != result) {
					logger.info("the request is " + url + params + " api success: " + i);
					logger.info("返回结果为: " + result);
					break;
				} else {
					logger.info("返回结果为null，重新请求。");
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return result;
	}
}
