package com.free4lab.webrtc.dao;
import java.util.List;
import java.util.logging.Level;

import javax.persistence.Query;

import org.apache.log4j.Logger;

import com.free4lab.webrtc.model.contact.Usergroup;
import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;
import com.free4lab.webrtc.model.contact.Usergroup;
public class UsergroupDAO extends AbstractDAO<Usergroup>{
	private final Logger logger = Logger.getLogger(UsergroupDAO.class);
	public static final String PU_NAME = "WebrtcPU";//
	private UsergroupDAO usergroupDao = null;
	@Override
	public Class getEntityClass() {
		// TODO Auto-generated method stub
		return Usergroup.class;
	}

	@Override
	public String getPUName() {
		// TODO Auto-generated method stub
		return PU_NAME;
	}
	
	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

	public String getClassName() {
		return getEntityClass().getName();
	}
	//添加 
	public Usergroup addUsergroup(Integer userId, Integer groupId, String isRoot){
		Usergroup usergroup = new Usergroup(userId, groupId, isRoot);
		save(usergroup);
		return usergroup;
	}
	//查找用户的根组 
	public List<Usergroup> findRootGroup(Integer userId){
		this.log("finding " + this.getClassName() + 
				" instance:findRootGroup", Level.INFO, null);
		try {
			final String qlString = "select model from " + 
					this.getClassName() + " model where model.isRoot=0 and model.userId=" + userId; 
			logger.info("qlString="+qlString);
			
			Query query = getEntityManager().createQuery(qlString);
			logger.info("result="+(List<Usergroup>)query.getResultList());
			return (List<Usergroup>)query.getResultList();
		} catch(Exception e) {
			this.log("findRootGroup failed", Level.INFO, e);
			return null;
		}
	}
	//检查用户拥有的组
	public List<Usergroup> checkUserOwnGroup(Integer userId,Integer groupId){
		this.log("finding " + this.getClassName() + 
				" checkUserOwnGroup", Level.INFO, null);
		try {
			final String qlString = "select model from " + 
					getClassName() + " model where model.userId=" + userId+" and model.groupId=" + groupId; 
			Query query = getEntityManager().createQuery(qlString);

			return (List<Usergroup>)query.getResultList();
		} catch(Exception e) {
			this.log("checkUserOwnGroup failed", Level.INFO, e);
			return null;
		}
	}
	//test
	
	public static void main(String[] args)
	{
		
		UsergroupDAO ugd=new UsergroupDAO();
		Usergroup ug=new Usergroup();
		Integer userId=1;
		Integer groupId=1;
		String isRoot="0";
		//ugd.addUsergroup(userId, groupId, isRoot);//save success
		//ugd.findByProperty("userId", 1);
		//ugd.findRootGroup(1);
		ugd.deleteByPrimaryKey(2);//删除成功
		
	}
	
}