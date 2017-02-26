package com.free4lab.webrtc.dao;

import java.util.List;

import org.apache.log4j.Logger;


import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;
import com.free4lab.webrtc.model.contact.Friend;

//add,delete,update the contact
public class FriendDAO extends AbstractDAO<Friend>{
	private final Logger logger = Logger.getLogger(FriendDAO.class);
	public static final String PU_NAME = "WebrtcPU";
	private FriendDAO friendDao = null;
	
	@Override
	public Class getEntityClass() {
		// TODO Auto-generated method stub
		return Friend.class; //写错了
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
	
   //add contact(Friend)
	public Friend addContact(String nickname ,String email,String qq,String webrtc,String phone)
	
	{
		//friendId anto-generated
		Friend contact=new Friend(nickname,email,qq,webrtc,phone);
		save(contact);
		logger.info("friendId="+contact.getFriendId());
		return contact;
		
		
	}
	/*
	 * *
	//delete contacts
	public boolean deleteContactById(Integer friendId)
	{ 
		friendDao=new FriendDAO();
		
		try{
			friendDao.deleteByPrimaryKey(friendId);
				return true;
		}
			
		catch(Exception e){
			//e.printStackTrace();
			logger.info("delete friend  failed!");
			return false;
		}
	}
	*/	
	
	//update,friendId 不发生变化，要传过来.
	
	public boolean updateContact(final Integer friendId,String nickname,String email,String qq,String webrtc,String phone){
		//构造Friend
		Friend contact=new Friend();//不能直接赋值为空null
		
		friendDao=new FriendDAO();
		//System.out.println("**");
		contact.setFriendId(friendId);
		
		contact.setEmail(email);
		contact.setNickname(nickname);
		contact.setQq(qq);
		contact.setWebrtc(webrtc);
		contact.setPhone(phone);
		logger.info("contact="+contact);
		try{
		friendDao.update(contact);
		return true ;
		}
		catch(Exception e){
			e.printStackTrace();
			e.toString();
		return false;
		}
	}
	
	/*
	 * TEST
	 */
	public static void main(String[] args)
	{  FriendDAO fd=new FriendDAO();
		// Friend f=(new FriendDAO()).addContact("nili-1","ddd","ddd","ddd","ddd");//ADD success
			//Integer id=1;
		
		 /*
			Friend contact=new Friend();
			
			contact.setFriendId(20);
			contact.setEmail("tt");
			contact.setNickname("tt");
			contact.setQq("tt");
			contact.setWebrtc("tt");
			contact.setPhone("tt");
			fd.update(contact);
			*/
	//	fd.updateContact(44, "wode","ddd","ddd","ddd","ddd");
			//(new FriendDAO()).deleteByPrimaryKey(5);
		//Integer key= 8;
	/*
		fd.findByPrimaryKey(8);
		List<Friend> friends = fd.findAll();
		for(Friend fri:friends){
			System.out.println(fri.getNickname());
		}
		*/
	}
	 
}
