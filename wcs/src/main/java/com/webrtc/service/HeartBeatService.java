package com.webrtc.service;
import java.util.Timer;
import java.util.TimerTask;
public class HeartBeatService{
	private final Timer timer = new Timer();
	public  SocketHandler SocketHandler = null;	
	public  String remoteID = null;
	public  int count = 0;
	
	public HeartBeatService() {
	}
	
	public HeartBeatService(String _remoteID,SocketHandler _SocketHandler) {
		SocketHandler = _SocketHandler;
		remoteID = _remoteID;
	}
	
	public void start() {
		System.out.println(remoteID+" HeartBeat begin to start!");
        timer.schedule(new TimerTask() {
        	
            public void run() {
            	
            	int Time = HttpService.getTIMEOUT_DELAY_SECOND(remoteID);
            	//取不到超时时间，退出
            	if(-1 == Time){
            		SocketService.removeSocketHandlerThread(remoteID);
            		SocketHandler.closeSocket();
            		return;
            	}         	
            	//超时时间到
            	if(count == Time){
            		SocketService.removeSocketHandlerThread(remoteID);
            		SocketHandler.closeSocket();
            		return;
        		}

            	count+=1000;
            }    
        }, 0,1000);
    }
	
	public void cancel() {
		remoteID = null;
		setCountZero();
		if(SocketHandler !=null){
			SocketHandler.closeSocket();
			SocketHandler = null;		
		}
		if(this.timer != null ){
			this.timer.cancel();
		}
    }
	
	public void setCountZero(){
		count = 0;
	}
}
