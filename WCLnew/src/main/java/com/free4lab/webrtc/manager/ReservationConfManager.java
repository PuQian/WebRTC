package com.free4lab.webrtc.manager;

import org.apache.log4j.Logger;

import java.util.List;

import com.webrtc.dao.ReservationConf;
import com.webrtc.dao.ReservationConfDAO;

public class ReservationConfManager {
	private static ReservationConfDAO reservationconfDAO = new ReservationConfDAO();
	private static final Logger LOGGER = Logger.getLogger(ReservationConfManager.class);
	
	public static List<ReservationConf> findMeetingHistoryByUsername(String username, int page, int size){
		try{
			return reservationconfDAO.findMeetinghistorybyusername("creator",username,"members",page,size);
		}
		catch(Exception e){
			LOGGER.debug(e);
			return null;
		}
	}
	public static long countMeetingHistoryByUsername(String username){
		try{
			long result = reservationconfDAO.countMeetingHistoryByMembers(username);
			if(result == 0){
				System.out.println("MeetingHistoryCount is zero or something error!");
			}
			return result;
		}
		catch(Exception e){
			LOGGER.debug(e);
			return 0;
		}
	}
	public static List<ReservationConf> findMyMeetingByUsername(String username,int page,int size){
		try{
			return reservationconfDAO.findMymeetingbyusername("creator",username,"members",page,size);
		}
		catch(Exception e){
			LOGGER.debug(e);
			return null;
		}
	}
	public static long countMyMeetingByUsername(String username){
		try{
			return reservationconfDAO.countMymeetingbyusername(username);
		}
		catch(Exception e){
			LOGGER.debug(e);
			return 0;
		}
	}
	
    public static void main(String arg[]){
    	ReservationConfManager ResManager = new ReservationConfManager();
    	long Meetingcount = ResManager.countMeetingHistoryByUsername("webrtc1-163.com@WebRTC");
    	System.out.println(Meetingcount);
    }
}
