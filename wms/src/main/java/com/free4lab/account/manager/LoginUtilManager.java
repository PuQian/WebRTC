package com.free4lab.account.manager;

import java.io.IOException;

import org.apache.struts2.ServletActionContext;

import com.free4lab.account.common.Constants;

public class LoginUtilManager {
	
	//登录验证和鉴权后重定向操作
	public static boolean redirectTo( String redirect_uri, String code ){
		String toUrl = "";
        if (redirect_uri.contains("?")) {
            toUrl = redirect_uri + "&"+Constants.PARAM_CODE+"=" + code;
        } else {
            toUrl = redirect_uri + "?"+Constants.PARAM_CODE+"=" + code;
        }

        try {
        	System.out.println("进入client："+toUrl);
			ServletActionContext.getResponse().sendRedirect(toUrl);
			return true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public static boolean redirectTo2( String redirect_uri, String code, String state ){
		String toUrl = "";
        if (redirect_uri.contains("?")) {
            toUrl = redirect_uri + "&"+Constants.PARAM_CODE+"=" + code + "&"+Constants.PARAM_STATE+"=" + state;
        } else {
            toUrl = redirect_uri + "?"+Constants.PARAM_CODE+"=" + code + "&"+Constants.PARAM_STATE+"=" + state;
        }
        try {
			ServletActionContext.getResponse().sendRedirect(toUrl);
			return true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//add by yck
	public static boolean redirectTo3( String redirect_uri, String code, String username ){
		String toUrl = "";
        if (redirect_uri.contains("?")) {
            toUrl = redirect_uri + "&"+Constants.PARAM_CODE+"=" + code + "&"+Constants.PARAM_USERNAME+"=" + username;
        } else {
            toUrl = redirect_uri + "?"+Constants.PARAM_CODE+"=" + code + "&"+Constants.PARAM_USERNAME+"=" + username;
        }
        try {
			ServletActionContext.getResponse().sendRedirect(toUrl);
			return true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}
	
}

