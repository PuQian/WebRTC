package com.webrtc.service;

import java.io.IOException;
import java.net.URI;

import org.json.JSONException;
import org.json.JSONObject;

import javax.ws.rs.core.MediaType;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.json.JSONConfiguration;
import com.webrtc.common.Constants;
import com.webrtc.domain.RESTMessage;
import com.webrtc.domain.WebrtcSession;

public class RESTClient {

	private static final URI BASE_URI = URI.create(Constants.SPE_URI);
	private static ClientConfig clientConfig = new DefaultClientConfig();
	private static Client c = null;
	private static WebResource resource = null;
	
	public RESTClient() {
		clientConfig.getFeatures().put(JSONConfiguration.FEATURE_POJO_MAPPING, Boolean.TRUE); 
		System.out.println(clientConfig.getClasses());
		c = Client.create(clientConfig);
		resource = c.resource(BASE_URI).path(Constants.SPE_PATH);
	}
	
	public static void Send(WebrtcSession session) throws JSONException, IOException {
		RESTMessage msg = new RESTMessage(session.getOfferIP(), session.getAnswerIP(), session.getMediaType(), session.getMediaType(), session.getOfferPort(), session.getAnswerPort());
		if (!session.isCreated()) {
    		ClientResponse response = resource.type(MediaType.APPLICATION_JSON_TYPE).post(ClientResponse.class, msg.toString());
    		if (response.getStatus() == 201) {
    			session.setCreated(true);
    			JSONObject json = new JSONObject(response.getEntity(String.class));
    			session.setCorrelationId(json.getString("CorrelationId"));
    		}
    	} else if (session.getMediaType() != null){
    		ClientResponse response = resource.path(session.getCorrelationId()).type(MediaType.APPLICATION_JSON_TYPE).put(ClientResponse.class, msg.toString());
    		System.out.println(response);
    	} else {
    		System.out.println("hello");
    		resource.path(session.getCorrelationId()).delete();
    	}
		
		
    }
}
