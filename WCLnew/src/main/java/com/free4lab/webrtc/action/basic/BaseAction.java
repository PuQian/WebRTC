package com.free4lab.webrtc.action.basic;
/**
 * 自定义基类
 * 共用的session的方法
 * @author wenlele
 */
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.free4lab.webrtc.common.SessionConstants;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
public class BaseAction extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = -964640548675784243L;

	public static final String NOT_LOGINED = "notlogined";
	public static final String INDEX_FAILED = "indexfailed";
	public static final String STORE_ERROR = "storerror";
	
	public static final String NULL_QUERY = null;
	/**
	 * 返回用户名
	 * @return
	 */	
	public String getSessionUserName(){
		return (String)ActionContext.
			getContext().getSession().get(SessionConstants.UserName);
	}	

	public String getSessionToken(){
		return (String)ActionContext.
			getContext().getSession().get(SessionConstants.AccessToken);
	}
	
	public String getSessionEmail(){
		return (String)ActionContext.
			getContext().getSession().get(SessionConstants.UserEmail);
	}
	
	public Integer getSessionUID(){
		return (Integer)ActionContext.
			getContext().getSession().get(SessionConstants.UserID);
	}
	public String getSessionAvatar(){
		return (String)ActionContext.
			getContext().getSession().get(SessionConstants.Avatar);
	}
	public String[] getSessionGroups(){
		String uuidString= (String) ActionContext.
		getContext().getSession().get(SessionConstants.Groups);
		if(uuidString != null && uuidString.length() > 0){
			return uuidString.split(",");
		}else
			return new String[0];
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

        // 测试ASCII
        try {
            word = new String(str.getBytes("ASCII"), "UTF8");
            if (containsChn(word)) {
                return word;
            }
        } catch(Exception ex) {
        }
        
        // 如果都不包含中文，则返回原串
        return str;
    }
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
    
  //删除html标签
  	public String delhtml(String desc){
  		if(desc.length()>0){
  			System.out.println("In the BaseAction, the delhtml()" + desc);
  			String str = desc.replaceAll("\\&[a-zA-Z]{1,10};", "").replaceAll(
  					"<[^>]*>", "");
  			str = str.replaceAll("[(/>)<]", "");
  	  		System.err.println("the descriptin is " + str);
  	  		return str;
  		}
  		else
  			return "";
  	}
  	//取得第一张图片的src地址
  	public static String getImgSrc(String htmlStr){     
		String img="";
	    Pattern p_image;
	    Matcher m_image;
	    
	    String regEx_img = "<img.*src=(.*?)[^>]*?>"; //图片链接地址     
		p_image = Pattern.compile(regEx_img,Pattern.CASE_INSENSITIVE);     
  	    m_image = p_image.matcher(htmlStr);   
  	    while(m_image.find()){     
  	        img = img + "," + m_image.group();     
  	        Matcher m  = Pattern.compile("src=\"?(.*?)(\"|>|\\s+)").matcher(img); //匹配src  
  	        while(m.find()){  
  	        	img = m.group(1);
  	        	break;
  	        }  
  	    }
  	    return img;  
  	 }    
}
