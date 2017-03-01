package com.free4lab.utils.account;

import java.io.IOException;
import java.util.HashSet;
import java.util.UUID;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

public abstract class BaseLoginFilter implements Filter {

	final static Logger logger = Logger.getLogger(BaseLoginFilter.class);
	
	//failPage和excludeURIs,从配置文件中读取
	private String failPage = null;
	private HashSet<String> excludeURIs = new HashSet<String>();
	
	private String Scheme=""; 
	
	//抽象方法，返回client_id
	abstract protected String getClientId();
	//抽象方法，返回redirect_uri
	abstract protected String getRedirectUri();
	//抽象方法，返回session中的accessToken
	abstract protected String getAccessTokenInSession(HttpServletRequest request,
			HttpServletResponse response);
	
	/**
	 * destroy
	 */
	public void destroy() {
		failPage = null;
		excludeURIs = null;		
	}

	/**
	 * 验证权限或者检查是否在放行列表中<br/>
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
	    System.out.println("In BaseLoginFilter!");
		if ( excludeURIs.contains(req.getRequestURI()) || checkPermission(req, (HttpServletResponse)response) ) {
			
			System.out.println("do filter 放行");
			chain.doFilter(request, response);
		} else {
			logger.info("In PermissionFilter， 跳转登录...");
			try {
				
				System.out.println("req.getScheme="+req.getScheme());
				
				
				if(req.getScheme()=="https")
				{
					Scheme=AccountUtil.HTTPS_ACCOUNT;
				}
				else
				{
					Scheme=AccountUtil.URL_ACCOUNT;
				}
				
				String schemeServerPort2 = req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort();
				String schemeServerPort = req.getScheme() + "://" + AccountUtil.Nginx_URL;
				
				System.out.println("schemeServerPort="+schemeServerPort);
				System.out.println("schemeServerPort2="+schemeServerPort2);
				
				String state = UUID.randomUUID().toString().replace("-", "");
				req.getSession().setAttribute(AccountUtil.STATE_KEY, state);
				
				if(req.getQueryString() == null) {
					res.sendRedirect(Scheme+"api/oauth2/authorize?client_id="+getClientId()+"&state="+state+"&redirect_uri="
						+ java.net.URLEncoder.encode(schemeServerPort + req.getContextPath() + getRedirectUri()
						+ "?redirect_url=" + java.net.URLEncoder.encode(schemeServerPort + req.getRequestURI(),"utf-8"),"utf-8"));
				} else {
					res.sendRedirect(Scheme+"api/oauth2/authorize?client_id="+getClientId()+"&state="+state+"&redirect_uri="
						+ java.net.URLEncoder.encode(schemeServerPort + req.getContextPath() + getRedirectUri()
						+ "?redirect_url=" + java.net.URLEncoder.encode(schemeServerPort + req.getRequestURI() + "?" + req.getQueryString(),"utf-8"),"utf-8"));
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}		
	}

	/**
	 * 初始化
	 */
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
		
		logger.debug(config.getFilterName() + " Set context path as:" + contextPath);
		logger.info(config.getFilterName() + " Set fail page :" + failPage);
		logger.info(config.getFilterName() + "Set permission check exlude uris:" + uris);		
	}
	
	/**
	 * 检查权限
	 * @param request
	 * @param response
	 * @return
	 */
	protected boolean checkPermission(HttpServletRequest request,
			HttpServletResponse response) {
		logger.info("In the loginfilter, the request url is " + request.getRequestURI());
		String accessTokenInSession = getAccessTokenInSession(request, response);
		if( accessTokenInSession != null && !"".equalsIgnoreCase( accessTokenInSession )
				&& !"-1".equalsIgnoreCase( AccountUtil.getAccessTokenInfo(accessTokenInSession) ) ){
			return true;
		}
		return false;
	}
	
}
