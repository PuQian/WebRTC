package com.free4lab.account.manager;

import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;

import com.free4lab.account.model.AccessToken;
import com.free4lab.account.model.AccessTokenDAO;
import com.free4lab.account.model.ExterAccount;
import com.free4lab.account.model.ExterAccountDAO;

public class ExterAccountManager {

    private static final Logger logger = Logger.getLogger(ExterAccount.class); 
    /**
     * accessTokenDAO的静态实例
     */
    private static ExterAccountDAO exterAccountDAO = new ExterAccountDAO();
    
	/**
	 * 插入新的外部临时用户
	 */
	public static ExterAccount newExternalUser(String client_id) {
		
    	logger.info(" begin to write into exter_account!");
    	    	
        ExterAccount ea = new ExterAccount();  
        ea.setName(UUID.randomUUID().toString().replace("-","")+"@A");
        ea.setExtend(client_id);
        
        try {
        	exterAccountDAO.save(ea);
            return ea;
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
        }
    }
	
	/**
	 * 通过name获取id
	 */
	public static int getExternalUserIdByName(String name)
	{
		List<ExterAccount> eaList = exterAccountDAO.findByProperty("name", name);
		if(eaList == null || eaList.size() <= 0)
			return -1;
		else
			return eaList.get(0).getId();
	}
	
	/**
	 * 通过id删除外部用户
	 */
	public static void deleteExterAccountById(int id)
	{
		exterAccountDAO.deleteByPrimaryKey(id);
	}
}
