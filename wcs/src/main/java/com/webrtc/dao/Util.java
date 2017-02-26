package com.webrtc.dao;

import java.sql.Timestamp;
import java.util.Date;

public class Util {
	public static Timestamp currentTime(){
		Date date = new Date();
    	return new Timestamp(date.getTime());
	}
}
