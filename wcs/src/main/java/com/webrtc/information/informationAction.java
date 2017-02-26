package com.webrtc.information;

import java.io.IOException;  
import java.io.PrintWriter;  
import java.util.ArrayList;  
import java.util.List;  
  


import javax.servlet.ServletException;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.Map;
import java.util.Iterator;

import org.json.JSONException;
import org.json.JSONObject; 

import com.webrtc.service.HttpService;

public class informationAction extends HttpServlet{
	
	private static final long serialVersionUID = 1L;

	public informationAction() {
		super();
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html");
		response.setCharacterEncoding("utf-8");
		PrintWriter out = response.getWriter();
		JSONObject sendMsg = new JSONObject();
		
		HashMap<String,String> result =HttpService.getHttpServiceInformation();
		
		Iterator iter = result.entrySet().iterator();		
		
	
		 try {
			 while(iter.hasNext()){
		            Map.Entry entry = (Map.Entry) iter.next();
		            String key = (String)entry.getKey();
		          String value =(String)entry.getValue();
		          sendMsg.put(key, value);
		        }
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
           
        out.println(sendMsg);
        out.flush();
        out.close();
	}
}
