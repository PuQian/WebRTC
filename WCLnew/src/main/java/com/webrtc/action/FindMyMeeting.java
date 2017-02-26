package com.webrtc.action;

	
import java.util.ArrayList;
import java.util.List;

import com.free4lab.webrtc.action.basic.BaseAction;
import org.apache.log4j.Logger;

import com.opensymphony.xwork2.ActionSupport;

import com.free4lab.webrtc.manager.ReservationConfManager;
import com.webrtc.dao.ReservationConfDAO;
import com.webrtc.dao.ReservationConf;

public class FindMyMeeting extends ActionSupport{
	private static final Logger logger = Logger.getLogger(FindMeetingHistory.class);
		
		private List<ReservationConf> groups =new ArrayList<ReservationConf>();
		//请求第几页
		private int page;
		//每页记录数
		private int size;
		//数据总条数
		private int count;
		//数据总页数
		private int total=0;
		
		private String username ="";
		
		private String result = "success";
		
		public String execute() throws Exception{	
			System.out.println(username+page+size);
			
			//返回第page页长度为size的数据
			//(page-1)*size为记录开始的位置，setFirstResult()
			groups = ReservationConfManager.findMyMeetingByUsername(username,page-1,size);
			if(groups == null){
				return result;
			}	
			//返回我的会议总数
			count = (int)ReservationConfManager.countMyMeetingByUsername(username);
			if(count == -1){
				return result;
			}	
			if(count <=size){
				total = 1;    //数据总页数为1
			}
			else if(count%size==0) {   //总数据是每页数据数的倍数
				total=count/size;
			}
			else {                 
				total=count/size+1;
			}	
			
			size = groups.size();
			
			return result;
		}

		public List<ReservationConf> getGroups() {
			return groups;
		}

		public void setGroups(List<ReservationConf> groups) {
			this.groups = groups;
		}

		public int getPage() {
			return page;
		}

		public void setPage(int page) {
			this.page = page;
		}

		public int getSize() {
			return size;
		}

		public void setSize(int size) {
			this.size = size;
		}

		public int getCount() {
			return count;
		}

		public void setCount(int count) {
			this.count = count;
		}

		public int getTotal() {
			return total;
		}

		public void setTotal(int total) {
			this.total = total;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public String getResult() {
			return result;
		}

		public void setResult(String result) {
			this.result = result;
		}
		
}
