/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.http;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONObject;

/**
 * 参考:http://moinwiki.free4lab.com/FreeAccount/Api
 * @author yicou
 */
public class AccountUtil {
    /**
     * 默认的accounturl：http://authentication.free4lab.com/
     */
    private static String freeAccountUrl = "http://authentication.free4lab.com/";
    /**
     * 默认超时时间2s
     */
    private static int timeout = 2000;

    public static final String PARAS_KEY = "key";
    public static final String PARAS_OAUTH_TOKEN = "oauthToken";
    public static final String PARAS_MESSAGE = "message";
    public static final String PARAS_ACCESS_TOKEN = "accessToken";
    public static final String PARAS_USERID = "userId";
    public static final String PARAS_EMAIL = "email";

    public static final String GET_ACCESS_TOKEN_URL = "api/getAccessToken";
    public static final String GET_USER_INFO_URL = "api/getUserInfo";

    /**
     * 4、第三方通过oauthToken和secretKey（步骤一有具体对应值p.s.secretKey是一开始向统一认证服务器申请的，保密传输） 
     * @param secretKey
     * @param oauthToken
     * @return 当掉用失败的时候返回null
     */
    public static String getAccessTokenString(String secretKey, String oauthToken) {

        Map<String, List<String>> paras =
                new HashMap<String, List<String>>();
        // key是 secretKey
        List<String> list = new ArrayList<String>();
        list.add(secretKey);
        paras.put(PARAS_KEY, list);
        // oauthToken
        list = new ArrayList<String>();
        list.add(oauthToken);
        paras.put(PARAS_OAUTH_TOKEN, list);

        String content = HttpCrawler.getHtmlDoc(
                getFreeAccountUrl() + GET_ACCESS_TOKEN_URL,
                paras, getTimeout());

        return content;
    }

    /**
     * 4、第三方通过oauthToken和secretKey（步骤一有具体对应值p.s.secretKey是一开始向统一认证服务器申请的，保密传输） 
     * @param secretKey
     * @param oauthToken
     * @return 当掉用失败的时候返回null
     */
    public static JSONObject getAccessTokenJSON(String secretKey, String oauthToken) {
        try {
            return new JSONObject(getAccessTokenString(secretKey, oauthToken));
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * 4、第三方通过oauthToken和secretKey（步骤一有具体对应值p.s.secretKey是一开始向统一认证服务器申请的，保密传输）
     * @param secretKey
     * @param oauthToken
     * @return 
     */
    public static Map<String, String> getAccessTokenMap(String secretKey, String oauthToken) {
        Map<String, String> map = new HashMap<String, String>();
        try {
            JSONObject json = getAccessTokenJSON(secretKey, oauthToken);
            map.put(PARAS_MESSAGE, json.getString(PARAS_MESSAGE));
            map.put(PARAS_ACCESS_TOKEN, json.getString(PARAS_ACCESS_TOKEN));
        } catch (Exception ex) {
            map.put(PARAS_ACCESS_TOKEN, "");
            map.put(PARAS_MESSAGE, ex.getMessage());
        }
        return map;
    }


    /**
     * 5、通过获取的accessToken来获取用户的信息。
     * @param accessToken
     * @return 当掉用失败的时候返回null
     */
    public static String getUserInfoString(String accessToken) {

        Map<String, List<String>> paras =
                new HashMap<String, List<String>>();
        // key是 accessToken
        List<String> list = new ArrayList<String>();
        list.add(accessToken);
        paras.put(PARAS_KEY, list);

        String content = HttpCrawler.getHtmlDoc(
                getFreeAccountUrl() + GET_USER_INFO_URL,
                paras, getTimeout());

        return content;
    }

    /**
     * 5、通过获取的accessToken来获取用户的信息。
     * @param accessToken
     * @return 当掉用失败的时候返回null
     */
    public static JSONObject getUserInfoJSON(String accessToken) {
        try {
            return new JSONObject(getUserInfoString(accessToken));
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * 5、通过获取的accessToken来获取用户的信息。
     * @param accessToken
     * @return 
     */
    public static Map<String, String> getUserInfoMap(String accessToken) {
        Map<String, String> map = new HashMap<String, String>();
        try {
            JSONObject json = getUserInfoJSON(accessToken);
            map.put(PARAS_USERID, json.getString(PARAS_USERID));
            map.put(PARAS_EMAIL, json.getString(PARAS_EMAIL));
            map.put(PARAS_MESSAGE, json.getString(PARAS_MESSAGE));
        } catch (Exception ex) {
            map.put(PARAS_USERID, "-1");
            map.put(PARAS_EMAIL, "");
            map.put(PARAS_MESSAGE, ex.getMessage());
        }
        return map;
    }

    /**
     * @return the freeAccountUrl
     */
    public static String getFreeAccountUrl() {
        return freeAccountUrl;
    }

    /**
     * @param aFreeAccountUrl the freeAccountUrl to set
     */
    public static void setFreeAccountUrl(String aFreeAccountUrl) {
        freeAccountUrl = aFreeAccountUrl;
    }

    /**
     * @return the timeout
     */
    public static int getTimeout() {
        return timeout;
    }

    /**
     * @param aTimeout the timeout to set
     */
    public static void setTimeout(int aTimeout) {
        timeout = aTimeout;
    }
}
