package com.free4lab.webrtc.dao;

import org.apache.log4j.Logger;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;
import com.free4lab.webrtc.model.contact.Grouplist;

//add , delete, modify the group
public class GroupDAO extends AbstractDAO<Grouplist> {
	private final Logger logger = Logger.getLogger(GroupDAO.class);
	public static final String PU_NAME = "WebrtcPU";
	private GroupDAO groupDao = null;
	@Override
	public Class getEntityClass() {
		// TODO Auto-generated method stub
		return Grouplist.class;
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
	
	//add 
	public Grouplist addGroup(String groupName){
		Grouplist group = new Grouplist(groupName);
		logger.info(group.getGroupId());
		save(group);
		return group;
	}
	
	//delete 
	
	//modify the group
	public boolean updateGroup(Integer groupId,String groupName)
	{
		groupDao=new GroupDAO();
		
		Grouplist group=new Grouplist(); //old 
		group.setGroupId(groupId);//构造group实体
		group.setGroupName(groupName);
		try{
		groupDao.update(group);
		return true;
		}
		catch(Exception e){
			//e.printStackTrace();
			logger.info("update group  failed!");			
			return false;
		}
		
	}
	
/*
 * 
 */

	public static void main(String[] args)
	{ 
		String name="nili";
	//(new GroupDAO()).addGroup(name);//group是数据库的关键字，不能用
	(new GroupDAO()).updateGroup(2, "测试");
	}
}
