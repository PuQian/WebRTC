package com.free4lab.webrtc.dao;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;
import com.free4lab.webrtc.model.contact.Groupfriend;

public class GroupfriendDAO  extends AbstractDAO<Groupfriend>{
	public static final String PU_NAME = "WebrtcPU";
	private GroupfriendDAO groupFriendDao = null;
	@Override
	public Class getEntityClass() {
		// TODO Auto-generated method stub
		return Groupfriend.class;
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
	public Groupfriend addGroupFriend( Integer groupId,Integer friendId){
		Groupfriend groupFriend = new Groupfriend(groupId, friendId);
		save(groupFriend);
		return groupFriend;
	}
	//findByProperty2(,)继承了
	//deleteByPrimaryKey(obj),继承了 
	public static void main(String[] args)
	{ 
	//(new GroupfriendDAO()).addGroupFriend(2, 2); //ok
		//(new GroupfriendDAO()).deleteByPrimaryKey(2);//ok
	
		Groupfriend gf=new Groupfriend();
	gf.setFriendId(3);
	gf.setGroupId(1);
	gf.setId(2);
	(new GroupfriendDAO()).update(gf);
	
	}
}
