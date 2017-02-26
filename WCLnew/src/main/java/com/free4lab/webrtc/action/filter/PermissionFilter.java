package com.free4lab.webrtc.action.filter;

import java.io.IOException;
import java.util.HashSet;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.free4lab.webrtc.common.APIConstants;

public abstract class PermissionFilter implements Filter{
	private String failPage = null;
	private HashSet<String> excludeURIs = new HashSet<String>();

	public void destroy() {
		failPage = null;
		excludeURIs = null;
	}

	/**
	 * 子类验证权限或者检查是否在放行列表中<br/>
	 * 常量定义 {@link APIConstants}
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse)response;
		if (excludeURIs.contains(req.getRequestURI()) || checkPermission(req, res)) {
			System.out.println(chain.getClass());
			chain.doFilter(request, response);
		} else {
			String schemeServerPort = req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort();
			if(req.getQueryString() == null) {
				System.out.println(APIConstants.APIPrefix_FreeAccount+"login?customId=webrtc&handleUrl="
						+ java.net.URLEncoder.encode(schemeServerPort + req.getContextPath() + "/login"
								+ "?redirectUrl=" + java.net.URLEncoder.encode(schemeServerPort + req.getRequestURI(),"utf-8"),"utf-8"));
				
				res.sendRedirect(APIConstants.APIPrefix_FreeAccount+"login?customId=webrtc&handleUrl="
					+ java.net.URLEncoder.encode(schemeServerPort + req.getContextPath() + "/login"
					+ "?redirectUrl=" + java.net.URLEncoder.encode(schemeServerPort + req.getRequestURI(),"utf-8"),"utf-8"));
			} else {
				System.out.println(APIConstants.APIPrefix_FreeAccount+"login?customId=webrtc&handleUrl="
						+ java.net.URLEncoder.encode(schemeServerPort + req.getContextPath() + "/login"
								+ "?redirectUrl=" + java.net.URLEncoder.encode(schemeServerPort + req.getRequestURI() + "?" + req.getQueryString(),"utf-8"),"utf-8"));
				
				res.sendRedirect(APIConstants.APIPrefix_FreeAccount+"login?customId=webrtc&handleUrl="
					+ java.net.URLEncoder.encode(schemeServerPort + req.getContextPath() + "/login"
					+ "?redirectUrl=" + java.net.URLEncoder.encode(schemeServerPort + req.getRequestURI() + "?" + req.getQueryString(),"utf-8"),"utf-8"));
			}
			
//			StringBuffer redirectUrl = new StringBuffer(req.getRequestURL());
//			String params = req.getQueryString();
//			System.out.println("redirectUrl in permissionfilter is " + redirectUrl);
//			if (params != null){
//				redirectUrl.append("?" + params);
//			}
//			String url = new String(redirectUrl);
//			url = failPage + "&redirectUrl=" + url;
//			
//			((HttpServletResponse) response).sendRedirect(url);
		}
	}

	public void init(FilterConfig config) throws ServletException {
		
		String contextPath = config.getServletContext().getContextPath();

		failPage = contextPath + config.getInitParameter("failPage");
		String excludeURIString = config.getInitParameter("excludeURIs");
		StringBuilder uris = new StringBuilder();
		if (excludeURIString != null && !excludeURIString.trim().equals("")) {
			excludeURIString = excludeURIString.replaceAll("[\t\n]", "");
			for (String uri : excludeURIString.split(";")) {
				uri = contextPath + uri.trim();
				excludeURIs.add(uri.trim());
				uris.append(uri);
				uris.append(';');
			}
			if (uris.length() > 0) {
				uris.deleteCharAt(uris.length() - 1);
			}		
		}		
	}

	abstract protected boolean checkPermission(HttpServletRequest request, HttpServletResponse response);
}
