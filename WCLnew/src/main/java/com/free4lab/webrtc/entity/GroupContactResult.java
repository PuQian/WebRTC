package com.free4lab.webrtc.entity;

import java.util.List;

import com.free4lab.webrtc.model.contact.Friend;

public class GroupContactResult{
private Integer groupId;
private String groupName;

private List<Friend> groupMembers;

public GroupContactResult()
{
}

public GroupContactResult(Integer id,String gname,List<Friend> friends)
{
this.groupId=id;
this.groupName=gname;
this.groupMembers=friends;
}

public void setGroupId(Integer groupId)
{
this.groupId=groupId;
}

public Integer getGroupId()
{
return this.groupId;
}
 
 public void setGroupName(String groupName)
 {
 this.groupName=groupName;
 }
 public String getGroupName()
 {
 return this.groupName;
 }
 public void setGroupMembers(List<Friend> groupMembers)
 {
 this.groupMembers=groupMembers;
 }
 public List<Friend> getGroupMembers()
 {
 return this.groupMembers;
 }
 }