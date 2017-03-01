package com.free4lab.account.manager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import org.apache.log4j.Logger;

import com.free4lab.account.common.Constants;
import com.free4lab.account.model.AccessToken;
import com.free4lab.account.model.AccessTokenDAO;

public class AccessTokenManager {
	
	/**
     * 过期时间:1天
     */
    public static final long EXPIRE_TIME = Long.parseLong(Constants.ACCESSTOKEN_EXPIRE_TIME);
    private static final Logger logger = Logger.getLogger(AccessToken.class); 
    /**
     * accessTokenDAO的静态实例
     */
    private static AccessTokenDAO accessTokenDAO = new AccessTokenDAO();
    
    /**
     * 根据oauthToken获取有效的accessToken
     * @param oauthToken
     * @return
     */
	public static AccessToken getAccessTokenByCode(String code){
		List<AccessToken> atList = accessTokenDAO.findByProperty("code", code);
		for (AccessToken at : atList) {
            if ((at.getBegin_time() + EXPIRE_TIME > System.currentTimeMillis()) && at.getValid() == 1) {
                return at;
            }
        }
        return null;
	}
	
	/**
	 * 根据accessToken获取userid，也是判断accessToken有效的方法
	 * @param accessToken
	 * @return
	 */
	public static int getUserIdByAccessToken(String access_token){
		List<AccessToken> atList = accessTokenDAO.findByProperty("access_token", access_token);
		if(atList != null && atList.size() >0){
			for (AccessToken at : atList) {
	            if ((at.getBegin_time() + EXPIRE_TIME > System.currentTimeMillis()) && at.getValid() == 1) {
	                return at.getUid();
	            }
	        }
		}
		return -1;
	}
	
	/**
	 * 根据16位的acc_token获取userId
	 * @param acc_token
	 * @return
	 */
	public static int getUserIdByAccToken(String acc_token){
		List<AccessToken> atList = accessTokenDAO.findByAccessTokenMiddle(acc_token);
		if(atList != null && atList.size() >0){
			for (AccessToken at : atList) {
	            if ((at.getBegin_time() + EXPIRE_TIME > System.currentTimeMillis()) && at.getValid() == 1) {
	                return at.getUid();
	            }
	        }
		}
		
		return -1;
	}

	//判断第三方平台用户信息是否已经在数据库中
	public static Vector FindThirdPartyUser(String email, String SPID){
        logger.info("马浩源是煞笔");
		List<AccessToken> li = accessTokenDAO.findByProperty2("user_id", email, "extend", SPID);
        Vector ve = new Vector(100);
        for(Iterator it=li.iterator();it.hasNext();){
//            List liId = new List();
            AccessToken liId= (AccessToken)it.next();
            logger.info(liId.getId());
            ve.add(liId.getId());
        }
        logger.info(ve.size());
        logger.info(ve.isEmpty());
        return ve;
	}
        //判断当前用户是在数据库中是否存有token值并返回id值
        public static Vector FindAccTokenByUserId(String email){
               List<AccessToken> li= accessTokenDAO.findByProperty("user_id", email);
               Vector ve = new Vector(100);
               for(Iterator it=li.iterator();it.hasNext();){
//                   List liId = new List();
                   AccessToken liId= (AccessToken)it.next();
                   ve.add(liId.getId());
               }
               return ve;
        }
        
        //删除当前用户在数据库中的记录值
        public static void deleteAccTokenByUserId(Vector ve){
                 for(Iterator it = ve.iterator();it.hasNext();){
                     int id = (Integer)it.next();
                     logger.info(id);
                  accessTokenDAO.deleteByPrimaryKey(id);
                 }
                      
        }
	/**
	 * 插入新的accessToken
	 * @param oauthToken
	 * @param accessToken
	 * @return
	 */
	public static AccessToken newAccessToken(int uid, String code, String access_token, 
			String client_id, String user_id) {
    	logger.info(" begin to write into access_token!");
    	
    	long time=System.currentTimeMillis();
    	
        AccessToken at = new AccessToken();   
        at.setUid(uid);
        at.setCode(code);
        at.setAccess_token(access_token);
        at.setBegin_time(time);
        at.setValid(1);
        at.setExtend(client_id);
        at.setServer_id(0);
        at.setUser_id(user_id);
        at.setStatus("offline");
        
        logger.info("uid="+uid+"\ncode="+code+"\naccess_token="+access_token+"\ntime"+time+"\nclient_id="+client_id+"\nuser_id="+user_id+"\n");
        try {
        	accessTokenDAO.save(at);
        	logger.info(at.getUser_id());
        	logger.info("write into access_token success!");
            return at;
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
        }
    }
	
	/**
	 * 根据accessToken将数据库中的accessToken置为无效
	 * @param accessToken
	 * @return
	 */
	public static List<AccessToken> expireAccessTokenByAccessToken(String access_token) {
		List<AccessToken> atList = accessTokenDAO.findByProperty("access_token", access_token);
		if(atList.size() <= 0) {
            return Collections.emptyList();
        }
		for (AccessToken at : atList) {
            if ((at.getBegin_time() + EXPIRE_TIME > System.currentTimeMillis()) && at.getValid() == 1) {
                at.setValid(0);
                accessTokenDAO.update(at);                
            }
        }
        return atList;
    }   
	
	/**
	 * 根据accessToken中间16位将数据库中的accessToken置为无效
	 * @param accessToken
	 * @return
	 */
	public static List<AccessToken> expireAccessTokenByAccessTokenMiddle(String access_token) {
        List<AccessToken> atList = accessTokenDAO.findByAccessTokenMiddle(access_token);
        if(atList.size() <= 0) {
            return Collections.emptyList();
        }
        for (AccessToken at : atList) {
            if ((at.getBegin_time() + EXPIRE_TIME > System.currentTimeMillis()) && at.getValid() == 1) {
                at.setValid(0);
                accessTokenDAO.update(at);                
            }
        }
        return atList;
    }

    /**
     * 通过accessToken获取AccessToken实例, 如果过期或者不存在返回null
     * @param accessToken
     * @return
     */
    public static AccessToken getAccessTokenByAccessToken(String access_token) {
        List<AccessToken> atList = accessTokenDAO.findByProperty("access_token", access_token);
        for (AccessToken at : atList) {
            if ((at.getBegin_time() + EXPIRE_TIME > System.currentTimeMillis()) && at.getValid() == 1) {
                return at;
            }
        }
        return null;
    }
    
    public static String getCodeByAccessToken(String access_token){
		List<AccessToken> atList = accessTokenDAO.findByProperty("access_token", access_token);
		for (AccessToken at : atList) {
            if ((at.getBegin_time() + EXPIRE_TIME > System.currentTimeMillis()) && at.getValid() == 1) {
                return at.getCode();
            }
        }
		return null;
	}
    
    public static List<AccessToken> getAccessTokens(String access_token) {
    	List<AccessToken> atList = new ArrayList<AccessToken>();
    	if (access_token != null && access_token.length() == 32) {
    		atList = accessTokenDAO.findByProperty("access_token", access_token);
    		
        } else if (access_token != null && access_token.length() == 16) {
        	atList =  accessTokenDAO.findByAccessTokenMiddle(access_token);
        }
    	if(atList.size() <= 0) {
            return Collections.emptyList();
        }
    	return atList;
     }
    
	public static String getCodeByUserId(String user_id) {
		List<AccessToken> atList = accessTokenDAO.findByProperty("user_id",user_id);
		if (atList != null && atList.size() > 0) {
			for (AccessToken at : atList) {
				if ((at.getBegin_time() + EXPIRE_TIME > System
						.currentTimeMillis()) && at.getValid() == 1) {
					return at.getCode();
				}
			}
			
		}
		return null;

	}
	
	public static String getAccessTokenByUserId(String user_id) {
		List<AccessToken> atList = accessTokenDAO.findByProperty("user_id",user_id);
		if (atList != null && atList.size() > 0) {
			for (AccessToken at : atList) {
				if ((at.getBegin_time() + EXPIRE_TIME > System
						.currentTimeMillis()) && at.getValid() == 1) {
					return at.getAccess_token();				}
			}
			
		}
		return null;

	}
	
	//add by yck
	//通过id找到uid
	public static Integer getIdByAccessToken(String access_token){
		List<AccessToken> list = accessTokenDAO.findByProperty("access_token", access_token);
		if(list == null || list.size() <= 0)
			return -1;
		else 
			return list.get(0).getId();
	}
	
	
	
	
	public static void main(String[] args){

		String result=getAccessTokenByUserId("woshikelebaobao@163.com");
		System.out.println(result);
	
 	}

}
