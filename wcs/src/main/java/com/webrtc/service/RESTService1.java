package com.webrtc.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.JSONObject;

@Path("axis2/services/QoSV1/DynamicQoS")
public class RESTService1 {
	@POST
	@Consumes("application/json")
	@Produces("application/json")
	public Response createMsg(String code) throws JSONException{
		System.out.println("post");	
		System.out.println(code);
		JSONObject response = new JSONObject();
		response.put("CorrelationId", "aabbccddeeff");
		return Response.status(Response.Status.CREATED).entity(response.toString()).build();
	}
	
	@GET
	@Produces("application/json")
	public Response receiveMsg(String code){
		System.out.println("get");
		String json = "world";
		return Response.ok(json, MediaType.APPLICATION_JSON).build();
		
	}
	
	@Path("/{CorrelationId}")
	@PUT
	@Consumes("application/json")
	@Produces("application/json")
	public Response put(String code,@PathParam("CorrelationId") String correlationId) throws JSONException{
		System.out.println("put");
		System.out.println(code + correlationId);
		JSONObject response = new JSONObject();
		response.put("CorrelationId", correlationId);
		return Response.ok(response.toString(), MediaType.APPLICATION_JSON).build();		
	}
	
	@Path("/{CorrelationId}")
	@DELETE
	public void delete(@PathParam("CorrelationId") String correlationId){
		System.out.println("delete");
		System.out.println(correlationId);
	}
}
