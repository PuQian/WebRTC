package com.free4lab.webrtc.action.contact;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.dao.FriendDAO;
import com.free4lab.webrtc.dao.GroupfriendDAO;
import com.free4lab.webrtc.entity.GroupContactResult;
import com.free4lab.webrtc.manager.ContactManager;
import com.free4lab.webrtc.model.contact.Friend;
import com.free4lab.webrtc.model.contact.Groupfriend;
import com.free4lab.webrtc.model.contact.Grouplist;
import com.opensymphony.xwork2.ActionContext;

public class GetContactByGroupAction extends BaseAction {
//点击联系人，分组显示联系人
	private final Logger logger = Logger.getLogger(GetContactByGroupAction.class);
	
	//按分组获得联系人信息
	private List<GroupContactResult> groupContactlist=new ArrayList<GroupContactResult>();

	public String execute() throws Exception{
		
		Integer userId = (Integer)ActionContext.
				getContext().getSession().get(SessionConstants.UserID);
		logger.info("userId="+userId);	
		/*
		 * 根据userId，获得所有分组，对每一个分组分别获取组员
		 */
	 //获取所有的分组
		List<Grouplist> allGroups=(new ContactManager()).getContactgroupList(userId);
	//构造GroupContactResult对象
		logger.info("有"+allGroups.size()+"组");
		
		
		
		if(!allGroups.isEmpty()){
				
				for(Grouplist group:allGroups)//获取每一个分组的成员
				{	Integer groupId;
					String groupName;
					List<Friend> groupMembers=new ArrayList<Friend>();
					
					groupId=group.getGroupId();
					groupName=group.getGroupName();
					logger.info("groupId"+groupId+",groupName="+groupName);
					List<Groupfriend> gf=(new GroupfriendDAO()).findByProperty("groupId", groupId);
					if(!gf.isEmpty())
					{
						for(Groupfriend groupfriend:gf)
						{   
							Integer friendId=groupfriend.getFriendId();
							
							List<Friend> myfriend=(new FriendDAO()).findByProperty("friendId", friendId);
							if(!myfriend.isEmpty())
							{
								groupMembers.add(myfriend.get(0));
								
							}
						}
					}
					
					GroupContactResult myGroupContactlist=new GroupContactResult(groupId,groupName,groupMembers);
					groupContactlist.add(myGroupContactlist);
				}
		}
		else{
			//返回为空，没有联系人
			
		}
		
		JSONArray result = new JSONArray(groupContactlist, false);

		logger.info(result.toString());
		return SUCCESS;
	}

	public void setGroupContactlist(List<GroupContactResult> groupContactlist)
	{
		this.groupContactlist=groupContactlist;
	}
	
	public List<GroupContactResult>  getGroupContactlist()
	{
		return this.groupContactlist;
	}
	
}

