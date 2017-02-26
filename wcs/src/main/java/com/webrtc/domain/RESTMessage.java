package com.webrtc.domain;

import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.common.Constants;

public class RESTMessage {
	private JSONObject msgObj= null;
	private JSONObject idObj = null;
	private JSONObject resourceObj = null;
	private JSONObject flowObj = null;
	
	public RESTMessage(String sourceIp, String destinationIp, String serviceId, String type, String sourcePort, String destinationPort) {
		try {
			this.msgObj = new JSONObject();
			this.idObj = new JSONObject();
			this.idObj.put("IP", sourceIp);
			this.msgObj.put("UserIdentifier", this.idObj);
			this.msgObj.put("ServiceId", serviceId);
			this.msgObj.put("CallBackURL", Constants.WCS_RESTSEVER_ADDR);
			
			this.resourceObj = new JSONObject();
			this.resourceObj.put("type", type);
			this.resourceObj.put("Priority", 15);
			
			this.flowObj = new JSONObject();
			this.flowObj.put("Direction", "bidirextional");
			this.flowObj.put("SourceIpAdress", sourceIp);
			this.flowObj.put("DestinationIpAdress", destinationIp);
			this.flowObj.put("SourcePort", sourcePort);
			this.flowObj.put("DestinationPort", destinationPort);
			this.flowObj.put("Protocol", "UDP");
			this.flowObj.put("MaximumUpStreamSpeedRate", 1000000);
			this.flowObj.put("MaximumDownStreamSpeedRate", 4000000);
			
			this.resourceObj.put("FlowProperties", this.flowObj);
		
			this.msgObj.put("ResourceFeatureProperties", this.resourceObj);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
	
	public RESTMessage(String sourceIp, String destinationIp, String serviceId, String type) {
		try {
			this.msgObj = new JSONObject();
			this.idObj = new JSONObject();
			this.idObj.put("IP", sourceIp);
			this.msgObj.put("UserIdentifier", this.idObj);
			this.msgObj.put("ServiceId", serviceId);
			
			this.resourceObj = new JSONObject();
			this.resourceObj.put("type", type);
			this.resourceObj.put("Priority", 15);
			
			this.flowObj = new JSONObject();
			this.flowObj.put("Direction", "bidirextional");
			this.flowObj.put("SourceIpAdress", sourceIp);
			this.flowObj.put("DestinationIpAdress", destinationIp);
			this.flowObj.put("Protocol", "UDP");
			this.flowObj.put("MaximumUpStreamSpeedRate", 1000000);
			this.flowObj.put("MaximumDownStreamSpeedRate", 4000000);
			
			this.resourceObj.put("FlowProperties", this.flowObj);
		
			this.msgObj.put("ResourceFeatureProperties", this.resourceObj);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}

	public JSONObject getJSONObject(){
		return this.msgObj;
	}

	public String toString(){
		return this.msgObj.toString();
	}
}

