package com.webrtc.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.omg.CORBA.INTERNAL;

import com.free4lab.webrtc.manager.EaseFriendManager;
import com.webrtc.dao.EaseFriend;
import com.free4lab.webrtc.action.basic.BaseAction;
import com.free4lab.utils.search.Keyword;
import com.free4lab.utils.search.KeywordSearcher;

public class SearchEaseFriendsbykeyword extends BaseAction{
    /**
     * 显示信息
     */
    private static final long serialVersionUID = 1L;
    private static final Logger logger = Logger.getLogger(SearchEaseFriendsbykeyword.class);
    
    //返回好友集合
    private List<EaseFriend> easefriends;
    
    private String keyword;
    private String hostname;
    
    private String result="error";
    
    public String execute() throws Exception{

    	KeywordSearcher keywordSearcher = new KeywordSearcher();

        //1.获取指定UserName获取他的所有好友
        List<EaseFriend> friendList = EaseFriendManager.findFriendsByHostName(hostname);

        //2.获取所有成员的id和所有字段 组成的多关键字列表
        for(EaseFriend friend:friendList)
        {
            int id = friend.getId();
            keywordSearcher.addKeyword(friend.getFriendname(), id);
            //keywordSearcher.addKeyword(ectac.getSex(), id);
            //keywordSearcher.addKeyword(ectac.getNc(), id);
        }

        //3.产生与keyword匹配的关键字结果
        List<Integer> resultIds = keywordSearcher.searchKeywords(keyword);

        //4.根据ids再次查询Encontact表并返回最终结果
        easefriends = EaseFriendManager.findFriendsByIds(resultIds);
        if(easefriends != null  && easefriends.size()>0)
        {
            result = "success";
        }
        return SUCCESS;     
    }
    
    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }
    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
	public List<EaseFriend> getEasefriend() {
		return easefriends;
	}

	public void setEasefriends(List<EaseFriend> easefriends) {
		this.easefriends = easefriends;
	}
}
