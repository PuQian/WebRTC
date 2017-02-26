package com.webrtc.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;

import javax.persistence.Query;

import org.apache.log4j.Logger;


import com.webrtc.dao.*;

public class WcsService {
	
	private static SessionDAO sessionDAO=new SessionDAO();
	private static final Logger LOGGER = Logger.getLogger(WcsService.class);

	public static List<Session> findSessionByUsernameForPage(final Object userId,int page,int size){
		try{
			 List<Session> results = sessionDAO.findByUsernameForPage("offerer",userId,"answerer",userId,page,size);
			 if(results == null || results.size()==0){
				 System.out.println("no results or something error!");
				 return null;
			 }
			 return results;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	} 
	
	public static long countSessionByUsernameForPage(final Object userId){
		try{
			 long result = sessionDAO.countByProperty("offerer",userId,"answerer",userId);
			 if(result ==0){
				System.out.println("count is zero or something error!");
				 return 0;
			 }
			 return result;
		}catch (Exception e) {
			LOGGER.debug(e);
			return 0;
		}
	}
	
	public static void main (String[] args)
	{
		WcsService wcsServer =new WcsService();	
	}
	
   
}
