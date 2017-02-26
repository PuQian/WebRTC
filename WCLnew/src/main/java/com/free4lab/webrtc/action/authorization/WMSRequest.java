package com.free4lab.webrtc.action.authorization;

import java.net.InetAddress;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.json.JSONException;
import org.json.JSONObject;

import com.free4lab.webrtc.common.*;
import com.free4lab.webrtc.common.SessionConstants;
//import com.free4lab.freeshare.URLConst;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.account.UserInfo;
import com.free4lab.utils.http.HttpCrawler;
import com.opensymphony.xwork2.ActionContext;

public class WMSRequest {
	final static Logger logger = Logger.getLogger(WMSRequest.class);
	final static int MAX_FREEACCOUNT_ATTEMPTS = 10;

	final static String URL_ACCOUNT = APIConstants.WMS_URL;

	// 生成认证参数
	public static String WMSAuthPara() throws NoSuchAlgorithmException,
			UnknownHostException {
		if (ActionContext.getContext().getSession()
				.get(SessionConstants.UserID) != null) {
			// 先判断在第三方Account是否登陆成功，若登陆成功，携带以下参数向WMS里的Account3.0发起认证
			logger.info("++++++++++++本地Account认证成功！向WMS发起认证++++++++++++++++++");
			String SPID = SessionConstants.WMSAuth_ID;
			String UserAccount = (String) ActionContext.getContext()
					.getSession().get(SessionConstants.UserEmail);// 用户在第三方的账户
			// String UserAccount="cadobe@qq.com";
			InetAddress address = InetAddress.getLocalHost();
			String UserIP = address.getHostAddress();
			String ReturnURL = "10.108.113.230:8081";
			// 时间戳，从1970年1月1日0时开始的毫秒数
			Date d = new Date();
			long TimeStamp = d.getTime();

			String strSha1 = Encryption.SHA1(ReturnURL + "$" + TimeStamp);
			String Digest = Encryption.getBase64(strSha1);

			@SuppressWarnings("deprecation")
			ThreeDES des = new ThreeDES(); // 实例化一个对像
			des.getKey("sortec2008"); // 生成密匙
			String WebRTCLoginRequestValue = URLEncoder.encode(SPID
					+ "$"
					+ Encryption.getBase64(new String(des
							.getEncString(UserAccount + "$" + UserIP + "$"
									+ ReturnURL + "$" + TimeStamp + "$"
									+ Digest))));

			logger.info(new String(des.getEncString((UserAccount + "$" + UserIP
					+ "$" + ReturnURL + "$" + TimeStamp + "$" + Digest))));

			// String testValue = SPID + "$" +ReturnURL;
			// return testValue;
			return WebRTCLoginRequestValue;
		} else
			return null;
	}

	//

	// 根据action和参数返回json对象
	public static JSONObject getTargetValue(String url)
			throws NoSuchAlgorithmException, UnknownHostException {

		Map<String, List<String>> params = new HashMap<String, List<String>>();
		Map<String, String> param = new HashMap<String, String>();
		String str = WMSRequest.WMSAuthPara();
		param.put("WebRTCLoginRequestValue", str);
		List<String> encryptionParam = new ArrayList<String>();
		encryptionParam.add(str);
		params.put("WebRTCLoginRequestValue", encryptionParam);
		String result = null;
		logger.info("flag2");
		int i = 0;// 获取result，共测试MAX_FREEACCOUNT_ATTEMPTS次

		System.out.print("WMSRequest URL_ACCOUNT=" + URL_ACCOUNT + "\n");
		url = URL_ACCOUNT + url;

		logger.info("第" + i + "次尝试: 请求 ： url=" + url + "  params:" + params);
		result = HttpCrawler.getHtmlDoc(url, params);

		logger.info("第" + i + "次尝试: 响应：" + result);

		while ((result == null || "".equalsIgnoreCase(result))
				&& i <= MAX_FREEACCOUNT_ATTEMPTS) {
			i++;
			logger.info("第" + i + "次尝试: 请求 ： url=" + url + "  params:" + params);
			result = HttpCrawler.getHtmlDoc(url, params);
			logger.info("第" + i + "次尝试: 响应：" + result);

		}
		try {
			logger.info(result);
			return new JSONObject(result);
		} catch (JSONException e) {
			return new JSONObject();
		}
	}

	public WMSRequest() {
	}
}
