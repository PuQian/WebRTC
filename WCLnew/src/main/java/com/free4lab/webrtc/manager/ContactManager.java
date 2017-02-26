package com.free4lab.webrtc.manager;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;


import com.free4lab.webrtc.dao.FriendDAO;
import com.free4lab.webrtc.dao.GroupDAO;
import com.free4lab.webrtc.dao.GroupfriendDAO;
import com.free4lab.webrtc.dao.UsergroupDAO;
import com.free4lab.webrtc.entity.ContactInfo;
import com.free4lab.webrtc.model.contact.Friend;
import com.free4lab.webrtc.model.contact.Groupfriend;
import com.free4lab.webrtc.model.contact.Grouplist;
import com.free4lab.webrtc.model.contact.Usergroup;
//联系人管理 
public class ContactManager {
	private final Logger logger = Logger.getLogger(ContactManager.class);
	/*
	 * 将联系人加入根组,Friend组是联系人，friendId已有了，联系人存在 ;每个用户只有一个根组
	 * */
	public void addContactToRoot(Integer userId, Integer friendId){
		//获取用户的根组
		logger.info("userId="+userId+",friendId="+friendId);
		List<Usergroup> myUserGroupList = (new UsergroupDAO()).findRootGroup(userId);
		if(myUserGroupList != null && myUserGroupList.size() > 0){ //用户存在根组，获取根组id，将联系人和分组的关系存进去
			logger.info("myUserGroupList.get(0).getGroupId()="+myUserGroupList.get(0).getGroupId());
			
			Integer groupId = myUserGroupList.get(0).getGroupId();
			
			logger.info("groupId="+groupId+",friendId="+friendId);
			(new GroupfriendDAO()).addGroupFriend(groupId,friendId);//添加群组联系人关系
			//添加联系人到Friend表中 
			
		}else{//用户不存在根组，需要创建
			logger.info("用户不存在根组，需要创建");
			Grouplist myGroup = (new GroupDAO()).addGroup("我的联系人");
			if(myGroup != null){
				Integer groupId = myGroup.getGroupId();
				logger.info("groupId="+groupId);
				(new UsergroupDAO()).addUsergroup(userId,groupId,"0");//isRoot=0代表根组
				(new GroupfriendDAO()).addGroupFriend(groupId,friendId);
			}
		}
	}
	/*
	 * 将联系人加入某个群组
	 * */
	public boolean addContactToGroup(Integer userId, Integer friendId, Integer groupId){
		//验证该群组是某为该用户所拥有
		List<Usergroup> myUserGroupList = (new UsergroupDAO()).checkUserOwnGroup(userId, groupId);
		if(myUserGroupList != null){
			(new GroupfriendDAO()).addGroupFriend(groupId,friendId);
			return true;
		}else{
			return false;
		}		
	}
	
	/*
	 * 查找某个用户的某个群组
	 */
	public List<Grouplist> findGroup(Integer userId,String groupName)
	{
		List<Grouplist> mygroups=new ArrayList<Grouplist>();
		logger.info("userId="+userId);
		Integer groupId;
		List<Usergroup> usergroup=(new UsergroupDAO()).findByProperty("userId", userId);
		if(!usergroup.isEmpty())
		{
			for(Usergroup ug:usergroup)
			{
				groupId=ug.getGroupId();
				List<Grouplist> mygroup=(new GroupDAO()).findByProperty("groupId", groupId);
				if(mygroup.get(0).getGroupName().equals(groupName)){
					logger.info("find");
					mygroups.add(mygroup.get(0));	
				}
					
			}
		}
		return mygroups;
	}
	/*
	 * 检查某个组是不是某个用户的
	 */
	boolean checkUserGroup(Integer userId,Integer groupId)
	{
		List<Usergroup> usergroup=(new UsergroupDAO()).findByProperty2("userId", userId, "groupId", groupId);
		if(!usergroup.isEmpty())
			
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	/*
	 * 检查是不是我的联系人
	 */
	boolean checkUserContact(Integer userId,Integer friendId)
		{
			//联系人所在的群组
			//String groupIdList="";
			boolean isExist=false;
			List<Usergroup> myUserGroupList = (new UsergroupDAO()).findByProperty("userId", userId);
			//存在好友列表
			if(myUserGroupList != null){
				//List<Integer> groupIdList = new ArrayList<Integer>();
				
				for(Usergroup itemUserGroup:myUserGroupList){
					Integer groupId = itemUserGroup.getGroupId();
					List<Groupfriend> myGroupFriend = (new GroupfriendDAO()).findByProperty("groupId", groupId);
					if(myGroupFriend != null){
						for(Groupfriend itemGroupFriend:myGroupFriend){
							if(friendId == itemGroupFriend.getFriendId()){
								//groupIdList.add(itemGroupFriend.getGroupId());
								//groupIdList += itemGroupFriend.getGroupId()+",";
								isExist=true;
							}						
						}
					}				
				}
			}
			return isExist;
		}
	
	/*
	 * 1, 添加联系人，一是在群组中添加联系人，二是直接添加联系人并选择添加到哪一个组；
	 */
	public boolean addContact(Integer userId,String groupName,String nickname,String email,String qq,String webrtc,String phone)
	{   //添加Friend表
		logger.info("userId="+userId+",groupname="+groupName+",nickname="+nickname);
		Friend friend=(new FriendDAO()).addContact(nickname, email, qq, webrtc, phone);//添加联系人到联系人表
		
		Integer friendId=friend.getFriendId();//获取friendId
		logger.info("friendId="+friendId);
		logger.info("groupNmae="+groupName);
		//添加groupfriend关系,首先根据群组名查找组groupId
		//查询userId用户的群组，
		List<Grouplist> group=findGroup(userId,groupName);
		//List<Grouplist> group=(new GroupDAO()).findByProperty("groupName", groupName); //结果应该是唯一的 
		
		if(group!= null && group.size() > 0){
			logger.info("group.get(0).getGroupId()="+group.get(0).getGroupId());
			Integer groupId = group.get(0).getGroupId();//获得groupId
			
			logger.info("groupId="+groupId+",friendId="+friendId);
			(new GroupfriendDAO()).addGroupFriend(groupId, friendId);//添加群组联系人关系
			return true;
		}else{
			logger.info("null");
			return false;
		}		
	
	}
	
	/*
	 * 2, 获取某人的联系人列表
	 * */
	public List<Friend> getContactList(Integer userId){
		List<Friend> mycontacts=new ArrayList<Friend>();
		List<Usergroup> myUserGroupList = (new UsergroupDAO()).findByProperty("userId", userId);
		//存在联系人列表
		logger.info("userId"+userId);
		if(myUserGroupList != null){
			List<Integer> friendIdList = new ArrayList<Integer>();
			for(Usergroup itemUserGroup:myUserGroupList){
				Integer groupId = itemUserGroup.getGroupId();
				logger.info("groupId"+groupId);
				List<Groupfriend> myGroupFriend = (new GroupfriendDAO()).findByProperty("groupId", groupId);
				if(myGroupFriend != null){
					for(Groupfriend itemGroupFriend:myGroupFriend){
						friendIdList.add(itemGroupFriend.getFriendId());
					}
				}				
			}
			if(friendIdList != null){
				//List<UserInfo> friendUserInfoList=(new GroupManager()).getUserInfo(friendIdList);
				//List<Friend> contactsInfoList=(new GroupManager()).getUserInfo(friendIdList);
				
				
				for(Integer friendId:friendIdList)
				{      logger.info("friendId="+friendId);
					List<Friend> friend=(new FriendDAO()).findByProperty("friendId", friendId);
					mycontacts.add(friend.get(0));
					
				}
				logger.info("myfriends="+mycontacts);
				return mycontacts;
			}else{//好友列表为空
				return null;
			}
		}else{
			//好友列表为空
			return null;
		}
	}
	
	/*
	 * 3, 删除联系人
	 *
	 * */
	
	public boolean delContact(Integer userId, Integer friendId){
		
		
		List<Groupfriend> myGroupFriend = (new GroupfriendDAO()).findByProperty("friendId", friendId);
		
		Integer groupId;	
		boolean isExist;
		
			if(myGroupFriend != null){//找到了该群组-好友关系，一个联系人属于一个分组，
				//判断群组是不是用户的群组,check(userId,gruopId)
				groupId=myGroupFriend.get(0).getGroupId();
				isExist=checkUserGroup(userId,groupId);
				if(isExist)
				{   logger.info("delete");
					(new GroupfriendDAO()).deleteByPrimaryKey(myGroupFriend.get(0).getId());
					(new FriendDAO()).deleteByPrimaryKey(friendId);//删除Friend联系人
					logger.info("删除联系人");
					//
					//查询联系人所在群组，是否为空
					List<Groupfriend> groupfriend2=(new GroupfriendDAO()).findByProperty("groupId", groupId);
					if(groupfriend2==null||groupfriend2.isEmpty()){
						//群组空了，删除群组
						(new GroupDAO()).deleteByPrimaryKey(groupId);
						logger.info("删除群组"+groupId);
						//用户群组关系中删除关系
						List<Usergroup> usergroup=(new UsergroupDAO()).findByProperty2("userId", userId, "groupId", groupId);
						if(usergroup!=null){
							Integer id=usergroup.get(0).getId();
							
							(new UsergroupDAO()).deleteByPrimaryKey(id); // 
							logger.info("删除"+userId+"的群组"+usergroup.get(0).getGroupId());
							
						}
					
					}
					//
					return true;
				}
				else{
					logger.info("error!");
					return false;
				}	
			}
			else{
				return false;
			}			
	}
	
	/*
	 * 4, 修改联系人信息...friendId
	 */
	public boolean updateContact(Integer userId,String groupName,final Integer friendId,String nickname,String email,String qq,String webrtc,String phone){
		FriendDAO friendDao=new FriendDAO();
		GroupfriendDAO gfDao =new GroupfriendDAO();
		GroupDAO groupDao=new GroupDAO();
		//检查联系人是不是用户的checkUserContact(userId,friendId)
		if(checkUserContact(userId,friendId)){
				
					
					friendDao.updateContact(friendId,nickname,email,qq,webrtc,phone);//更新联系人 
					//如果变更了分组，找到旧的群组联系人关系
					List<Groupfriend> oldGroupfriend=gfDao.findByProperty("friendId",friendId);
					
					if(!oldGroupfriend.isEmpty())
					{   
						Integer oldGroupId=oldGroupfriend.get(0).getGroupId();
						List<Grouplist> oldGroup=groupDao.findByProperty("groupId", oldGroupId);
						if(!oldGroup.isEmpty()){
							String oldname=oldGroup.get(0).getGroupName();
							if(oldname.equals(groupName))
							{
								logger.info("群组未作修改!");
								return true;
							}
							else{
							//群组修改了
								//找到用户是否存在改组
								List<Grouplist> group=this.findGroup(userId, groupName);
									//如果用户存在该分组
								if(!group.isEmpty()){
									//添加新的群组联系人关系
									Integer newGroupId=group.get(0).getGroupId();
									gfDao.addGroupFriend(newGroupId, friendId);
									gfDao.deleteByPrimaryKey(oldGroupfriend.get(0).getId());
									//判断删除联系人之后的群组是否为空，空就删除群组
									
									//根据 oldGroupId找到旧的分组是否为空。
																		
									List<Groupfriend>  oldGF=(new GroupfriendDAO()).findByProperty("groupId", oldGroupId);
																		
									if(oldGF.isEmpty())
																		
									{
																			
										//如果就组为空了，删除群组
																				
										(new GroupDAO()).deleteByPrimaryKey(oldGroupId);
										//删除用户群组关系，
										List<Usergroup> oldUserGroup= (new UsergroupDAO()).findByProperty2("userId", userId, "groupId", oldGroupId);
										if(!oldUserGroup.isEmpty()){
											Integer id=oldUserGroup.get(0).getId();
											(new UsergroupDAO()).deleteByPrimaryKey(id);
										}
									
									
																		
									}
									
									return true;
								}
								else{
									logger.info("error");
									return false;
								}
							}
						}
						else
						{
							logger.info("error1");
							return false;
						}
					}
					else{
						logger.info("error!，找不到用户所属群组!");
						return false;
					}
				}
				else{
					logger.info("不是用的联系人!");
					return false;
				}
		
	}
	
	/*
	 * 检查某人是不是我的联系人
	 * */
	public String checkContactById(Integer userId, Integer friendId){
		//好友所在的群组
		String groupIdList="";
		
		List<Usergroup> myUserGroupList = (new UsergroupDAO()).findByProperty("userId", userId);
		//存在好友列表
		if(myUserGroupList != null){
			//List<Integer> groupIdList = new ArrayList<Integer>();
			
			for(Usergroup itemUserGroup:myUserGroupList){
				Integer groupId = itemUserGroup.getGroupId();
				List<Groupfriend> myGroupFriend = (new GroupfriendDAO()).findByProperty("groupId", groupId);
				if(myGroupFriend != null){
					for(Groupfriend itemGroupFriend:myGroupFriend){
						if(friendId == itemGroupFriend.getFriendId()){
							//groupIdList.add(itemGroupFriend.getGroupId());
							groupIdList += itemGroupFriend.getGroupId()+",";
						}						
					}
				}				
			}
		}
		return groupIdList;
	}
	
	/*
	 * 创建非根组的群组，
	 * */
	public void addGroup(Integer userId, String groupName){
		Grouplist myGroup = (new GroupDAO()).addGroup(groupName);
		if(myGroup != null){
			Integer groupId = myGroup.getGroupId();
			(new UsergroupDAO()).addUsergroup(userId,groupId,"1");//isRoot=1代表非根组
		}
	}
	
	/*
	 * 删除群组，把群组中的联系人都移到根组，然后删除群组,findGroup(Integer userId,String groupName)
	 */
	
	public boolean deleteGroup(Integer userId,String groupName)
	{	logger.info("grouName="+groupName);
		//首先根据userId，和groupName找到群组，某个用的群组名字是不同的，唯一的
		//List<Grouplist> myGroup=(new GroupDAO()).findByProperty("groupName", groupName);
		List<Grouplist> myGroup=findGroup( userId,groupName);

		if(myGroup!=null){
			Integer groupId=myGroup.get(0).getGroupId();
			logger.info("groupId"+groupId);
			(new GroupDAO()).deleteByPrimaryKey(myGroup.get(0).getGroupId());//delete the group
			logger.info("group delete"+groupId);
			List<Usergroup> usergroup=(new UsergroupDAO()).findByProperty2("userId", userId, "groupId", groupId);
			
				if(usergroup!=null){
					(new UsergroupDAO()).deleteByPrimaryKey(usergroup.get(0).getId());//delete the usergroup
					logger.info("usergrop delete");
				
					List<Groupfriend> myGroupfriends=(new GroupfriendDAO()).findByProperty("groupId", groupId);//find the groupfriend
		
					if(myGroupfriends!=null)
			
					{
						for(Groupfriend groupfriend:myGroupfriends)
							{ //删除联系人==》不删除联系人，而是移动到根组；
								Integer friendId=groupfriend.getFriendId();
								//(new FriendDAO()).deleteByPrimaryKey(friendId);
								this.addContactToRoot(userId,friendId);
								
								logger.info("friend move to the root group!=>"+friendId);
								//删除旧的联系人群组关系
								Integer id=groupfriend.getId();
								(new GroupfriendDAO()).deleteByPrimaryKey(id);
								logger.info("groupfriend delete"+id);
							}
						return true;
					}
		
					else{
						return true;
					}
					
				}
				else{
				//usergroup is null
				return false;
				}
				//myGroup is not null
			
			
		}
		//myGroup is null
		else{
			logger.info("null group");
			return true;
		}
	
	}


/*
 * 修改群组
 * 
 */
public boolean updateGroup(Integer userId,Integer groupId, String groupName)
{
	logger.info("userId="+userId+",groupId"+groupId);
	
	
	try{
	
		(new GroupDAO()).updateGroup(groupId, groupName);
		 return true;
	}
	catch(Exception e)
	{
		logger.info("fail to modify the group!");
		return false;
	}
}

/*
 * 获取用户的所有分组
 */

public List<Grouplist>  getContactgroupList(Integer userId){
	
	//List<Grouplist> mygrouplist=(new GroupDAO()).findAll();
	List<Grouplist> mygrouplist=new ArrayList<Grouplist>();//
	List<Usergroup> myUsergroup=(new UsergroupDAO()).findByProperty("userId", userId);
	if(!myUsergroup.isEmpty())
		
	{
		for(Usergroup usergroup:myUsergroup)
		{
			Integer groupId=usergroup.getGroupId();
			logger.info("groupId="+groupId);
			Grouplist mygroup=(new GroupDAO()).findById(groupId);
			logger.info("grouplist="+mygroup.getGroupId()+","+mygroup.getGroupName());
			if(mygroup!=null)
			{	//logger.info("add");
				mygrouplist.add(mygroup);
				//logger.info("add");
			}
			
		}
	}
	//不存在分组,新建根组
	else{

		//用户不存在根组，需要创建
		logger.info("用户不存在根组，需要创建");
		Grouplist group = (new GroupDAO()).addGroup("我的联系人");
		if(group != null){
			Integer groupId = group.getGroupId();
			logger.info("groupId="+groupId);
			(new UsergroupDAO()).addUsergroup(userId,groupId,"0");//isRoot=0代表根组
			mygrouplist.add(group);//添加根组到分组列表
		}
	}
	return mygrouplist;
	
}
/*
 * 检查联系人和分组 是否存在,实际是在前端js实现检查的
 */
public String checkContact(Integer userId,String nickname)
{	String name=null;
	logger.info("nickname="+nickname);
	List<Usergroup> myUserGroupList = (new UsergroupDAO()).findByProperty("userId", userId);
	//存在好友列表
	if(myUserGroupList != null){
		
		for(Usergroup itemUserGroup:myUserGroupList){
			Integer groupId = itemUserGroup.getGroupId();
			List<Groupfriend> myGroupFriend = (new GroupfriendDAO()).findByProperty("groupId", groupId);
			if(myGroupFriend != null&&myGroupFriend.size()>0){
				for(Groupfriend itemGroupFriend:myGroupFriend){
					Integer friendId=itemGroupFriend.getFriendId();
					List<Friend> myfriend=(new FriendDAO()).findByProperty("friendId", friendId);
					if(myfriend!=null&&myfriend.size()>0)
					{
						if(nickname==myfriend.get(0).getNickname()) //find
							
						{
							name=myfriend.get(0).getNickname();
							logger.info("name="+name);
						}						
					}
			}				
		}
	}
	
}
	logger.info("name="+name+"over");
	return name;
}

//
public String checkContactGroup(Integer userId,String groupName)
{
	String gname=null;
	logger.info("groupname="+groupName);
	List<Usergroup> myUserGroupList = (new UsergroupDAO()).findByProperty("userId", userId);
	//存在好友列表
	if(myUserGroupList != null){
		for(Usergroup itemUserGroup:myUserGroupList){
			Integer groupId=itemUserGroup.getGroupId();
			List<Grouplist> grouplist=(new GroupDAO()).findByProperty("groupId", groupId);
			if(grouplist!=null&&grouplist.size()>0)//find
			{
				//唯一的
				Grouplist mygroup=grouplist.get(0);
				if(groupName.equals(mygroup.getGroupName()))
				{
					//find
					gname=groupName;
					logger.info("groupName="+groupName);
				}
			}
		}
	}
	logger.info("gname="+gname);
	return gname;
}
//按分组获得联系人
public List<Friend> getContactByGroup(Integer userId,String groupName){
	    logger.info("groupName="+groupName);
	    List<Friend> mycontacts=new ArrayList<Friend>();
	    
	    List<Grouplist>  myGroup=(new GroupDAO()).findByProperty("groupName", groupName);
	    if(!myGroup.isEmpty()){
	    	Integer groupId=myGroup.get(0).getGroupId();
	    	logger.info("groupId="+groupId);
	    	List<Groupfriend> myfriends=(new GroupfriendDAO()).findByProperty("groupId", groupId);
	    	if(!myfriends.isEmpty())
	    	{
	    		for(Groupfriend gf:myfriends)
	    		{
	    			Integer friendId=gf.getFriendId();
	    			List<Friend> friends=(new FriendDAO()).findByProperty("friendId", friendId);
	    			if(!friends.isEmpty()){
	    				mycontacts.add(friends.get(0));
	    				
	    			}
	    		}
	    	}
	    }
	    return mycontacts;
	
}
//根据联系人的id获得联系人的信息，包括群组信息
public List<ContactInfo> getContactById(Integer userId,Integer friendId)
{
	List<ContactInfo> contact=new ArrayList<ContactInfo>();//联系人信息列表
	
	logger.info("friendId="+friendId);
	List<Groupfriend> groupFriend=(new GroupfriendDAO()).findByProperty("friendId", friendId);
	if(!groupFriend.isEmpty()){
		
		Integer groupId=groupFriend.get(0).getGroupId();//对应唯一的groupId
		if(this.checkUserGroup(userId, groupId)){
			List<Grouplist> group=(new GroupDAO()).findByProperty("groupId", groupId);
			if(!group.isEmpty()){
				//找到组
				String groupName=group.get(0).getGroupName();
				List<Friend> friend=(new FriendDAO()).findByProperty("friendId", friendId);
				if(!friend.isEmpty()){
					//找到friend
					//构造联系人信息类，虽是类表List<Friend>但是其实就只有一个联系人
					ContactInfo contactinfo=new ContactInfo(groupName,friend);
					contact.add(contactinfo);				
					return contact;
				}
				
			}
		}
		
	}
	return null;
}

/*
 * test test
 */

public static void main(String args[])
{
 
	ContactManager cm=new ContactManager();
	List<Friend> mycontacts=new ArrayList<Friend>();
	
	List<ContactInfo> list=cm.getContactById(140, 68);
	System.out.println("list="+list.get(0).getGroupName());
	
}

}
