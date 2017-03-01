/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.action;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
/**
 * 基础Action
 * TODO:将获取用户信息的内容封进来，这样登录鉴权的一致了
 * @author yicou
 */
public class BaseAction extends ActionSupport {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
     * JSON数据的返回类型
     */
    public static final String JSON = "json";

    /**
     * 测试是否包含中文
     * @param str
     * @return
     */
    public boolean containsChn(String str) {
        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            if (ch >= '\u4e00' && ch <= '\u9fa5') {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取一个字符串的url解码后字符串，适配了ISO8859_1和GBK
     * @param str
     * @return
     */
    public String getDecodeString(String str) {
        String word = null;
        // 测试原文
        if (containsChn(str)) {
            return str;
        }
        // 测试ISO8859
        try {
            word = new String(str.getBytes("ISO8859_1"), "UTF8");
            if (containsChn(word)) {
                return word;
            }
        } catch(Exception ex) {
        }

        // 测试GBK
        try {
            word = new String(str.getBytes("GBK"), "UTF8");
            if (containsChn(word)) {
                return word;
            }
        } catch(Exception ex) {
        }

        // 如果都不包含中文，则返回原串
        return str;
    }

    /**
     * 获取key对应的参数列表
     * @param key
     * @return
     */
    protected List<String> getParameter(String key) {
        Map<String, Object> pMap = ActionContext.getContext().getParameters();
        List<String> list = new ArrayList<String>();
        if (pMap.containsKey(key)) {
            String [] array = (String[])pMap.get(key);
            for (String tag : array) {
                list.add(getDecodeString(tag));
            }
        }
        return list;
    }

    /**
     * 获取参数对应的第一个参数
     * @param key
     * @return
     */
    protected String getSingleParameter(String key) {
        List<String> list = getParameter(key);
        if (list != null && list.size() > 0) {
            return getDecodeString(list.get(0));
        } else {
            return null;
        }
    }

    /**
     * 查看是否含有某参数
     * @param key
     * @return
     */
    protected boolean containsParameter(String key) {
        List<String> list = getParameter(key);
        return (list != null && list.size() > 0);
    }
}
