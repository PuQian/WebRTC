package com.webrtc.service;

import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.domain.WebrtcSession;



@Path("")
public class RESTService {
	@POST
	@Consumes("application/json")
	@Produces("application/json")
	public Response createMsg(String code) throws JSONException, IOException{
		System.out.println(code);
		JSONObject msgObj = new JSONObject(code);
		String CorrelationId = msgObj.getString("CorrelationId");
		WebrtcSession session = WebrtcSessions.getCorrelationId(CorrelationId);
		if(session != null) {
			int QoSStatus = msgObj.getInt("QoSStatus");
			if (QoSStatus == 5) {
				//to be added
			} else if (QoSStatus == 3) {
				//to be added
			} else {
		//		RESTClient.Send(session);
			}
			JSONObject response = new JSONObject();
			response.put("ResultCode", "0");
			response.put("ResultMessage", "Successful");
			response.put("CorrelationId", CorrelationId);
			return Response.ok(response.toString(), MediaType.APPLICATION_JSON).build();
		} else {
			JSONObject response = new JSONObject();
			response.put("ResultCode", "128");
			response.put("ResultMessage", "Event not subscribed");
			response.put("CorrelationId", CorrelationId);
			return Response.status(403).entity(response.toString()).build();
		}
	}
	
//	@GET
//	@Produces("application/json")
//	public Response receiveMsg(String code){
//		System.out.println("get");
//		String json = "world";
//		return Response.ok(json, MediaType.APPLICATION_JSON).build();
//		
//	}
//	
//	@Path("/{CorrelationId}")
//	@PUT
//	@Consumes("application/json")
//	@Produces("application/json")
//	public Response put(String code,@PathParam("CorrelationId") String correlationId) throws JSONException{
//		System.out.println("put");
//		System.out.println(code + correlationId);
//		JSONObject response = new JSONObject();
//		response.put("CorrelationId", correlationId);
//		return Response.ok(response.toString(), MediaType.APPLICATION_JSON).build();		
//	}
//	
//	@Path("/{CorrelationId}")
//	@DELETE
//	public void delete(@PathParam("CorrelationId") String correlationId){
//		System.out.println("delete");
//		System.out.println(correlationId);
//	}
}
