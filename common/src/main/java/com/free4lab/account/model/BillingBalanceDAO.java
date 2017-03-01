package com.free4lab.account.model;

import java.util.Collections;
import java.util.List;
import java.util.logging.Level;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class BillingBalanceDAO extends AbstractDAO<BillingBalance> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<BillingBalance> getEntityClass() {
        return BillingBalance.class;
    }
    public static final String PU_NAME = "AccountPU";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }
    
    /**
     * 完成一次转账中的余额更新操作
     * @param uBalance
     * @param rBalance
     * @return
     */
    public boolean updateBalances( BillingBalance uBalance, BillingBalance rBalance ) {
    	
    	EntityManager em = getEntityManager();
		if (em.getTransaction().isActive()) {
			em.getTransaction().rollback();
		}
		em.getTransaction().begin();
		try {
			if( null != uBalance){
				update(uBalance);
			}
			if( null != rBalance ){
				update(rBalance);
			}
			em.getTransaction().commit();
			return true;
		} catch (RuntimeException re) {
			log("updating balances of " + uBalance.getUid() + " and " + rBalance.getUid() + " failed!",
					Level.INFO, re);
			em.getTransaction().rollback();
			return false;
		}
    }

	@SuppressWarnings("unchecked")
	public List<BillingBalance> findByProperties(String name, List<Integer> uids) {
		log("finding " + getClassName() + " instance with property:"+name+" , value: " 
    			+ uids, Level.INFO, null);
    	
    	if(uids.size() == 0){
    		return Collections.emptyList();
    	}

    	String queryString = "select model from " + getClassName() + " model where model."
    			+ name;
    	for (int i = 0; i < uids.size(); i++){
			if(i == 0){
				queryString += " = " + uids.get(i);
			}else{
				queryString += " or " + "model." + name + " = " + uids.get(i);
			}
		}

		try {
    		Query query = getEntityManager().createQuery(queryString);
			return query.getResultList();
        } catch (RuntimeException re) {
            log("findByProperties failed", Level.SEVERE, re);
            throw re;
        }
	}
}
