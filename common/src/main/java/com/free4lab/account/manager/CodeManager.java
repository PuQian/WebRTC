package com.free4lab.account.manager;

import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.common.Constants;
import com.free4lab.account.model.Code;
import com.free4lab.account.model.CodeDAO;

public class CodeManager {
	
	/**
	 * ClientDAO的静态实例
	 */
	private static CodeDAO codeDAO = new CodeDAO();
	private static final Logger logger = Logger.getLogger(CodeManager.class);
	
	/**
     * 过期时间为1天
     */
    public static final long EXPIRE_TIME = Long.parseLong(Constants.OAUTHTOKEN_EXPIRE_TIME);
    
	/**
	 * oauthToken表中新增一条记录
	 * @param oauthToken
	 * @param oauthTokenSso
	 * @return
	 */
	public static Code newCode(String client_secret, String code, String code_sso) {
		Code codeEntity = new Code();
		codeEntity.setClient_secret(client_secret);
		codeEntity.setCode(code);
		codeEntity.setCode_sso(code_sso);
		codeEntity.setBegin_time(System.currentTimeMillis());
		codeEntity.setValid(1);
        try {
        	codeDAO.save(codeEntity);
            return codeEntity;
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
        }
    }

    /**
     * 通过Ssotoken获取oauthToken, 如果过期或者不存在返回null
     * @param token
     * @return
     */
    public static Code getCode(String codeSso) {
        List<Code> codeList = codeDAO.findByProperty("code_sso", codeSso);
        if(codeList != null && codeList.size() > 0){
        	logger.info("CodeManager:find by code::size="+codeList.get(0).getValid());
            for (Code code : codeList) {
                if ((code.getBegin_time() + EXPIRE_TIME > System.currentTimeMillis()) && (code.getValid() == 1)) {
                	code.setValid(0);
                	codeDAO.update(code);
                    return code;
                }
            }
        }
        
        return null;
    }
    
    public static Code getCodeBycode(String code) {
        List<Code> codeList = codeDAO.findByProperty("code", code);
        if(codeList != null && codeList.size() > 0){
        	logger.info("CodeManager:find by code::size="+codeList.get(0).getValid());
            for (Code c : codeList) {
                if ((c.getBegin_time() + EXPIRE_TIME > System.currentTimeMillis()) ) {
                    return c;
                }
            }
        }
        
        return null;
    }
    
    
   /* 
    public static Code setCodeInValid(Code codeEntity){
    	codeEntity.setValid(0);
    	try {
    		codeDAO.update(codeEntity);
            return codeEntity;
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
        }
    }*/
}
