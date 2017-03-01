package com.free4lab.account.manager;

import java.sql.Time;
import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.model.Enteruser;
import com.free4lab.account.model.EnteruserDAO;

public class EnteruserManager {
	private static EnteruserDAO enteruserDAO = new EnteruserDAO();
	private static final Logger LOGGER = Logger.getLogger(EnteruserManager.class);
	
	public static final String EID= "eid";
	public static final String UID= "uid";
	public static final String MAXCALLTIME= "maxcalltime";	
	public static final String ISADMIN= "isadmin";
	public static final String ISARTI= "isarti";
	public static final String MAXSERVINGNUM= "maxservingnum";	
	public static final String PRIORITY= "priority";
	public static final String ISBINDTIMER= "isbindtimer";
	public static final String LOGINTIME= "loginTime";
	public static final String LOGOUTTIME= "logoutTime";
	
	public static Enteruser getByUid(Integer uid)
	{
		List<Enteruser> list = enteruserDAO.findByProperty(UID, uid);
		if(list != null && list.size() > 0)
			return list.get(0);
		else 
			return null;
	}
	
	//通过eid查询旗下所有企业用户
	public static List<Enteruser> getByEid(Integer eid)
	{
		List<Enteruser> list = enteruserDAO.findByProperty(EID, eid);
		if(list != null && list.size() > 0)
			return list;
		else
			return Collections.emptyList();
	}
	
	//通过eid，page,size分页查询旗下所有企业用户
	public static List<Enteruser> getByEidForPage(Integer eid,int page,int size)
	{
		List<Enteruser> list = enteruserDAO.findByProperty(EID, eid, page, size);
		if(list != null && list.size() > 0)
			return list;
		else
			return Collections.emptyList();
	}
	
	//根据uids找一组企业用户
	public static List<Enteruser> getByUids(List<Integer> uids)
	{
		try{	
			return enteruserDAO.findByIds(UID, uids);
		}catch (Exception e) {
			return Collections.emptyList();
		}
	}
	
	//修改企业用户信息(主要是配置信息)
	public static Enteruser updateEnteruser(Integer id,Integer maxcalltime,Integer isadmin,Integer isarti,Integer isbindtimer,Integer priority,Integer maxservingnum,Time loginTime,Time logoutTime)
	{
		//找到原来 的
		Enteruser enteruser = enteruserDAO.findById(id);
		if(enteruser == null) return null;
		
		//更新新字段
		enteruser.setMaxcalltime(maxcalltime);
		enteruser.setIsadmin(isadmin);
		enteruser.setIsarti(isarti);
		enteruser.setIsbindtimer(isbindtimer);
		enteruser.setPriority(priority);
		enteruser.setMaxservingnum(maxservingnum);
		enteruser.setLoginTime(loginTime);
		enteruser.setLogoutTime(logoutTime);
		
		try{	
			return enteruserDAO.update(enteruser);
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
}
