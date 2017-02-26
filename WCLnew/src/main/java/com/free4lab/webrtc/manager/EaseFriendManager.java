package com.free4lab.webrtc.manager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;

import com.webrtc.dao.EaseFriendDAO;
import com.webrtc.dao.EaseFriend;

public class EaseFriendManager {
    private static EaseFriendDAO friendDAO = new EaseFriendDAO();
    private static final Logger LOGGER = Logger.getLogger(EaseFriendManager.class);

    public static List<EaseFriend> findFriendsByHostName(String hostname){
        try{
            
            List<EaseFriend> result = friendDAO.findfriendsbyHostName("hostname", hostname);            
                    
            return result;
        }catch (Exception e) {
            LOGGER.debug(e);
            return null;
        }
    }
    public static List<EaseFriend> findFriendsByIds(List<Integer> id){
        try{
            
            List<EaseFriend> result = friendDAO.findfriendsbyIds("id", id);            
                    
            return result;
        }catch (Exception e) {
            LOGGER.debug(e);
            return null;
        }
    }
    //删除EaseFriend好友记录
    public static void DelFriendByHostnameandFriendName(String hostname,String friendname){
        try{
            
            friendDAO.delFriendbyhostnameAndfriendname(hostname, friendname);            
                    
        }catch (Exception e) {
            LOGGER.debug(e);
        }
    }
    //添加EaseFriend好友记录
    public static void AddEaseFriend(String hostname,String friendname){
        try{
            
            friendDAO.addEaseFriend(hostname, friendname);            
                    
        }catch (Exception e) {
            LOGGER.debug(e);
        }
    }
    
    public static void main(String[] args){
    	EaseFriendDAO friendDAO = new EaseFriendDAO();
    	List<EaseFriend> result = friendDAO.findfriendsbyHostName("hostname", "webrtc4-163.com");            
        for(EaseFriend friend:result)
        {
            int id = friend.getId();
            System.out.println(id);
        }
    }
}
