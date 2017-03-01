package com.free4lab.account.model;

import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class BillingHistoryDAO extends AbstractDAO<BillingHistory> {
	public String getClassName() {
        return getEntityClass().getName();
    }

    public Class<BillingHistory> getEntityClass() {
        return BillingHistory.class;
    }
    public static final String PU_NAME = "AccountPU";

    public String getPUName() {
        return PU_NAME;
    }

    public IEntityManagerHelper getEntityManagerHelper() {
        return new NoCacheEntityManagerHelper();
    }
    
    /**
     * 查询某个用户的全部交易记录，包括收入和支出
     * @param uid
     * @return
     */
    @SuppressWarnings("unchecked")
	public List<BillingHistory> getOnesHistory(int uid){
    	log("finding " + getClassName() + " instance with property: uid , value: " 
    			+ uid + ", or recid: " + uid, Level.INFO, null);
        try {
            final String queryString = "select model from " + getClassName() + " model where model.uid"
                    + " = :propertyValue1 or model.recid = :propertyValue2";
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("propertyValue1", uid);
            query.setParameter("propertyValue2", uid);
            return query.getResultList();
        } catch (RuntimeException re) {
            log("getOnesHistory failed",
                    Level.SEVERE, re);
            throw re;
        }
    }

	@SuppressWarnings("unchecked")
	public List<BillingHistory> findByPropertiesByPage(int uid, int recid, List<String> ptype, 
			Timestamp begin, Timestamp end, int page, int pageSize) {
		log("finding " + getClassName() + " instance with properties: value: " 
    			+ uid + recid + ptype + begin + page + pageSize, Level.INFO, null);
        try {
        	String queryString = "select model from " + getClassName() + " model where ";
        	if(uid > 0 && recid < 0){//支出
        		queryString += "model.uid = :propertyValue1 ";
        	}else if(uid < 0 && recid > 0){//收入或充值
        		queryString += "model.recid = :propertyValue2 ";
        	}else if(uid > 0 && recid > 0){//全部
        		queryString += "( model.uid = :propertyValue1 or model.recid = :propertyValue2 )";
        		
        	}else{
        		return Collections.emptyList();
        	}
        	
        	if(ptype != null && ! ptype.isEmpty() && ptype.size() >1){
    			queryString += " and ( ";
    			for(String type : ptype){
    				queryString += "model.product_type = '"+ type + "' or ";
    			}
    			queryString = queryString.substring(0,queryString.length() - 3) + " )";
    		}else if(ptype != null && ptype.size() == 1){
    			queryString += " and model.product_type = '"+ ptype.get(0) + "' ";
    		}
        	
        	if(begin != null && end != null){
        		queryString += " and model.time >= :propertyValue4  and model.time <= :propertyValue5";
        	}
        	queryString += " order by model.time desc";
            Query query = getEntityManager().createQuery(queryString);
            if(uid > 0 && recid < 0){//支出
            	logger.info("out:"+uid+","+recid+","+ptype);
            	query.setParameter("propertyValue1", uid);
        	}else if(uid < 0 && recid > 0){//收入或充值
        		logger.info("in:"+uid+","+recid+","+ptype);
        		query.setParameter("propertyValue2", recid);
        	}else if(uid > 0 && recid > 0){//全部
        		logger.info("all:"+uid+","+recid+","+ptype);
        		query.setParameter("propertyValue1", uid);
                query.setParameter("propertyValue2", recid);
        	}
            if(begin != null && end != null){
            	query.setParameter("propertyValue4", begin);
            	query.setParameter("propertyValue5", end);
            }
            query.setMaxResults(pageSize).setFirstResult((page-1) *pageSize);
            return query.getResultList();
        } catch (RuntimeException re) {
            log("findByPropertiesByPage failed", Level.SEVERE, re);
            throw re;
        }
	}

	@SuppressWarnings("unchecked")
	public List<BillingHistory> findByProperties(int uid, int recid,
			List<String> ptype, Timestamp begin, Timestamp end) {
		log("finding " + getClassName() + " instance with properties: value: " 
    			+ uid + recid + ptype + begin, Level.INFO, null);
        try {
        	String queryString = "select model from " + getClassName() + " model where ";
        	if(uid > 0 && recid < 0){//支出
        		queryString += "model.uid = :propertyValue1 ";
        	}else if(uid < 0 && recid > 0){//收入或充值
        		queryString += "model.recid = :propertyValue2 ";
        	}else if(uid > 0 && recid > 0){//全部
        		queryString += "( model.uid = :propertyValue1 or model.recid = :propertyValue2 )";
        	}else{
        		return Collections.emptyList();
        	}
        	
        	if(ptype != null && ptype.size() > 0){
    			queryString += " and ( ";
    			for(String type : ptype){
    				queryString += "model.product_type = '"+ type + "' or ";
    			}
    			queryString = queryString.substring(0,queryString.length() - 3) + " ) ";
    		}else if(ptype != null && ptype.size() == 1){
    			queryString += " and model.product_type = '"+ ptype.get(0) +"' ";
    		}
        	
        	logger.info(queryString);
        	if(begin != null && end != null){
        		queryString += " and model.time >= :propertyValue4 and model.time <= :propertyValue5";
        	}
        	queryString += " order by model.time desc";
      
            Query query = getEntityManager().createQuery(queryString);
            if(uid > 0 && recid < 0){//支出
            	logger.info("out:"+uid+","+recid+","+ptype);
            	query.setParameter("propertyValue1", uid);
        	}else if(uid < 0 && recid > 0){//收入或充值
        		logger.info("in:"+uid+","+recid+","+ptype);
        		query.setParameter("propertyValue2", recid);
        	}else if(uid > 0 && recid > 0){//全部
        		logger.info("all:"+uid+","+recid+","+ptype);
        		query.setParameter("propertyValue1", uid);
                query.setParameter("propertyValue2", recid);
        	}
            if(begin != null && end != null){
            	query.setParameter("propertyValue4", begin);
            	query.setParameter("propertyValue5", end);
            }
            return query.getResultList();
        } catch (RuntimeException re) {
            log("findByProperties failed", Level.SEVERE, re);
            throw re;
        }
	}

	@SuppressWarnings("unchecked")
	public List<BillingHistory> findByProperties1(int uid, int recid,
			List<String> ptypeList, Timestamp begin, Timestamp end) {
		log("finding " + getClassName() + " instance with properties: value: " 
    			+ uid + recid + ptypeList + begin, Level.INFO, null);
        try {
        	String queryString = "select model from " + getClassName() + " model where ";
        	if(uid > 0 && recid < 0){//支出
        		if(ptypeList.size() == 0){
        			queryString += "model.uid = :propertyValue1";
        		}else{
        			queryString += "model.uid = :propertyValue1 and ( model.ptype = ";
        			for(int i = 0; i < ptypeList.size(); i ++){
        				if(i == 0){
        					queryString += ":propertyValue3"+i;
        				}else{
        					queryString += " or model.ptype = :propertyValue3"+i;
        				}
        			}
        			queryString +=" )";
        		}
        		
        	}else if(uid < 0 && recid > 0){//收入或充值
        		if(ptypeList.size() == 0){
        			queryString += "model.recid = :propertyValue2";
        		}else{
        			queryString += "model.recid = :propertyValue2 and ( model.ptype = ";
        			for(int i = 0; i < ptypeList.size(); i ++){
        				if(i == 0){
        					queryString += ":propertyValue3"+i;
        				}else{
        					queryString += " or model.ptype = :propertyValue3"+i;
        				}
        			}
        			queryString +=" )";
        		}
        	}else if(uid > 0 && recid > 0){//全部
        		if(ptypeList.size() == 0){
        			queryString += "( model.uid = :propertyValue1 or model.recid = :propertyValue2 )";
        		}else{
        			queryString += "( model.uid = :propertyValue1 or model.recid = :propertyValue2 )"
        					+ " and ( model.ptype =";
        			for(int i = 0; i < ptypeList.size(); i ++){
        				if(i == 0){
        					queryString += ":propertyValue3"+i;
        				}else{
        					queryString += " or model.ptype = :propertyValue3"+i;
        				}
        			}
        			queryString +=" )";
        		}
        		
        	}else{
        		return Collections.emptyList();
        	}
        	if(begin != null && end != null){
        		queryString += " and model.time >= :propertyValue4 and model.time <= :propertyValue5";
        	}
        	queryString += " order by model.time desc";
        	log(queryString, Level.INFO, null);
            Query query = getEntityManager().createQuery(queryString);
            if(uid > 0 && recid < 0){//支出
            	logger.info("out:"+uid+","+recid+","+ptypeList);
            	query.setParameter("propertyValue1", uid);
            	if(ptypeList.size()>0){
            		for(int i = 0; i < ptypeList.size(); i ++){
            			query.setParameter("propertyValue3"+i, ptypeList.get(i));
            		}
            	}
        	}else if(uid < 0 && recid > 0){//收入或充值
        		logger.info("in:"+uid+","+recid+","+ptypeList);
        		query.setParameter("propertyValue2", recid);
        		if(ptypeList.size()>0){
            		for(int i = 0; i < ptypeList.size(); i ++){
            			query.setParameter("propertyValue3"+i, ptypeList.get(i));
            		}
            	}
        	}else if(uid > 0 && recid > 0){//全部
        		logger.info("all:"+uid+","+recid+","+ptypeList);
        		query.setParameter("propertyValue1", uid);
                query.setParameter("propertyValue2", recid);
                if(ptypeList.size()>0){
            		for(int i = 0; i < ptypeList.size(); i ++){
            			query.setParameter("propertyValue3"+i, ptypeList.get(i));
            		}
            	}
        	}
            if(begin != null && end != null){
            	query.setParameter("propertyValue4", begin);
            	query.setParameter("propertyValue5", end);
            }
            return query.getResultList();
        } catch (RuntimeException re) {
            log("findByProperties failed", Level.SEVERE, re);
            throw re;
        }
	}

	@SuppressWarnings("unchecked")
	public List<BillingHistory> findByPropertiesByPage1(int uid, int recid,
			List<String> ptypeList, Timestamp begin, Timestamp end,
			int page, int pageSize) {
		log("finding " + getClassName() + " instance with properties: value: " 
    			+ uid + recid + ptypeList + begin, Level.INFO, null);
        try {
        	String queryString = "select model from " + getClassName() + " model where ";
        	if(uid > 0 && recid < 0){//支出
        		if(ptypeList.size() == 0){
        			queryString += "model.uid = :propertyValue1";
        		}else{
        			queryString += "model.uid = :propertyValue1 and ( model.ptype = ";
        			for(int i = 0; i < ptypeList.size(); i ++){
        				if(i == 0){
        					queryString += ":propertyValue3"+i;
        				}else{
        					queryString += " or model.ptype = :propertyValue3"+i;
        				}
        			}
        			queryString +=" )";
        		}
        		
        	}else if(uid < 0 && recid > 0){//收入或充值
        		if(ptypeList.size() == 0){
        			queryString += "model.recid = :propertyValue2";
        		}else{
        			queryString += "model.recid = :propertyValue2 and ( model.ptype = ";
        			for(int i = 0; i < ptypeList.size(); i ++){
        				if(i == 0){
        					queryString += ":propertyValue3"+i;
        				}else{
        					queryString += " or model.ptype = :propertyValue3"+i;
        				}
        			}
        			queryString +=" )";
        		}
        	}else if(uid > 0 && recid > 0){//全部
        		if(ptypeList.size() == 0){
        			queryString += "( model.uid = :propertyValue1 or model.recid = :propertyValue2 )";
        		}else{
        			queryString += "( model.uid = :propertyValue1 or model.recid = :propertyValue2 )"
        					+ " and ( model.ptype =";
        			for(int i = 0; i < ptypeList.size(); i ++){
        				if(i == 0){
        					queryString += ":propertyValue3"+i;
        				}else{
        					queryString += " or model.ptype = :propertyValue3"+i;
        				}
        			}
        			queryString +=" )";
        		}
        		
        	}else{
        		return Collections.emptyList();
        	}
        	if(begin != null && end != null){
        		queryString += " and model.time >= :propertyValue4 and model.time <= :propertyValue5";
        	}
        	queryString += " order by model.time desc";
        	log(queryString, Level.INFO, null);
            Query query = getEntityManager().createQuery(queryString);
            if(uid > 0 && recid < 0){//支出
            	logger.info("out:"+uid+","+recid+","+ptypeList);
            	query.setParameter("propertyValue1", uid);
            	if(ptypeList.size()>0){
            		for(int i = 0; i < ptypeList.size(); i ++){
            			query.setParameter("propertyValue3"+i, ptypeList.get(i));
            		}
            	}
        	}else if(uid < 0 && recid > 0){//收入或充值
        		logger.info("in:"+uid+","+recid+","+ptypeList);
        		query.setParameter("propertyValue2", recid);
        		if(ptypeList.size()>0){
            		for(int i = 0; i < ptypeList.size(); i ++){
            			query.setParameter("propertyValue3"+i, ptypeList.get(i));
            		}
            	}
        	}else if(uid > 0 && recid > 0){//全部
        		logger.info("all:"+uid+","+recid+","+ptypeList);
        		query.setParameter("propertyValue1", uid);
                query.setParameter("propertyValue2", recid);
                if(ptypeList.size()>0){
            		for(int i = 0; i < ptypeList.size(); i ++){
            			query.setParameter("propertyValue3"+i, ptypeList.get(i));
            		}
            	}
        	}
            if(begin != null && end != null){
            	query.setParameter("propertyValue4", begin);
            	query.setParameter("propertyValue5", end);
            }
            query.setMaxResults(pageSize).setFirstResult((page-1) *pageSize);
            return query.getResultList();
        } catch (RuntimeException re) {
            log("findByProperties failed", Level.SEVERE, re);
            throw re;
        }
	}
}
