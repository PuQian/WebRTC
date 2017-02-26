/*
 * Copyright (c) 2010 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 */
package com.webrtc.service;

import java.awt.dnd.Autoscroll;
import java.net.URI;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import javax.inject.Inject;

import org.cometd.annotation.Configure;
import org.cometd.annotation.Listener;
import org.cometd.annotation.Service;
import org.cometd.annotation.Session;
import org.cometd.bayeux.client.ClientSessionChannel;
import org.cometd.bayeux.server.BayeuxServer;
import org.cometd.bayeux.server.ConfigurableServerChannel;
import org.cometd.bayeux.server.ServerMessage;
import org.cometd.bayeux.server.ServerSession;

import org.cometd.server.authorizer.GrantAuthorizer;
import org.cometd.server.filter.DataFilter;
import org.cometd.server.filter.DataFilterMessageListener;
import org.cometd.server.filter.JSONDataFilter;
import org.cometd.server.filter.NoMarkupFilter;
import org.json.JSONException;
import org.json.JSONObject;

import com.webrtc.common.Constants;
import com.webrtc.common.ErrorType;
import com.webrtc.common.RoapType;
import com.webrtc.common.SessionStateType;
import com.webrtc.dao.SessionDAO;
import com.webrtc.dao.UserDAO;
import com.webrtc.domain.ArtiEndMessage;
import com.webrtc.domain.AutoEndMessage;
import com.webrtc.domain.RTCMessage;
import com.webrtc.service.WebrtcSessions.SessionInfo;

import org.apache.log4j.Logger;

@Service("http")
public class HttpService {
	private static final Logger logger = Logger.getLogger(HttpService.class);
	private static final ConcurrentMap<String, Map<String, String>> members = new ConcurrentHashMap<String, Map<String, String>>();
	@Inject
	private static BayeuxServer bayeuxServer;
	@Session
	private static ServerSession bayeuxSessions;

	private static UserDAO userDao;
	private static final int USER_TIMEOUT_DELAY = Integer.valueOf(Constants.USER_TIMEOUT_DELAY);
	
	// /////////////////////////////////////
	// 构建临时用户表，避免每次数据库查询
	private static HashMap<String, String> tempUsers = new HashMap<String, String>();
	public static  SocketService ss = null;
	
	private static SocketUDPService UDPss = null;
	
	// /////////////////////////////////////
	// retain the "room" conception
	private static final String defaultRoom = "webrtc";

	private static final URI BASE_URI = URI.create(Constants.SPE_URI);


	public HttpService() {

		userDao = new UserDAO();
		int WCS_TCP_PORT= Integer.parseInt(Constants.WCS_TCP_LISTEN_PORT);
		int WCS_UDP_PORT=Integer.parseInt(Constants.WCS_UDP_LISTEN_PORT);
		String WCS_NAME=Constants.WCS_NAME;
		ss = new SocketService(WCS_TCP_PORT,WCS_NAME);		
		ss.start();
		
		UDPss = new SocketUDPService(WCS_UDP_PORT);
		UDPss.start();
		// final ResourceConfig resourceConfig = new
		// ResourceConfig(RESTService1.class);
		// final HttpServer server =
		// GrizzlyHttpServerFactory.createHttpServer(BASE_URI, resourceConfig);

	}
	@SuppressWarnings("null")
	public static HashMap<String,String> getHttpServiceInformation()
	{
		HashMap<String,String>result = null;
		result.put("status","ok");
		return result;
	}

	// /////////////////////////////////////新增
	public static HashMap<String, String> getTempUsers() {
		return tempUsers;
	}

	public static ConcurrentMap<String, Map<String, String>> getMembers() {
		return members;
	}

	// /////////////////////////////////////
	public static String getDefaultRoom() {
		return defaultRoom;
	}
	
	public void printMembers(String room) {
		Map<String, String> roomMembers = members.get(room);
		Set<String> clientNames = roomMembers.keySet();
		System.out.println("Members:");
		for (String clientName : clientNames) {
			String clientId = roomMembers.get(clientName);
			System.out.println("ClientName[" + clientName + "], ClientId["
					+ clientId + "]");
		}
		System.out.println();
	}

	/*
	 * 配置broadcast channel
	 */
	@Configure({ "/room/**" })
	protected void configureChatStarStar(ConfigurableServerChannel channel) {
		// A MessageListener that applies DataFilters to the received messages.
		DataFilterMessageListener noMarkup = new DataFilterMessageListener(
				new NoMarkupFilter(), new BadWordFilter());
		channel.addListener(noMarkup);
		channel.addAuthorizer(GrantAuthorizer.GRANT_ALL);
	}

	/*
	 * 配置service channel
	 */
	@Configure("/service/members")
	protected void configureMembers(ConfigurableServerChannel channel) {
		channel.addAuthorizer(GrantAuthorizer.GRANT_PUBLISH);
		channel.setPersistent(true);
	}

	/*
	 * 创建/service/members监听器
	 */
	@Listener("/service/members") //收到connect以及disconnect请求后的处理动作
	public void handleMembership(ServerSession client, ServerMessage message) {
		
		System.out.println("*************/service/members   handleMembership begin*************");
		Map<String, Object> data = message.getDataAsMap();
		final String room = ((String) data.get("room")).substring("/room/"
				.length());
		// roomMembers存放一个room中存在的所有成员，由 <userName, clientID>标识
		Map<String, String> roomMembers = members.get(room);
		if (roomMembers == null) {
			Map<String, String> new_room = new ConcurrentHashMap<String, String>();
			roomMembers = members.putIfAbsent(room, new_room);
			if (roomMembers == null)
				roomMembers = new_room;
		}
		final Map<String, String> members = roomMembers;
		String userName = (String) data.get("user");

		if (members.containsKey(userName)) {
			String userIdStr = members.get(userName);
			if (!userIdStr.contains(client.getId())) {
				userIdStr += ("," + client.getId());
				members.put(userName, userIdStr);
			}
		} else {
			members.put(userName, client.getId());
		}
		// update the user table to reflect the online motion
		if (userDao.isUserExist(userName)) {
			userDao.updateServerID(userName,
					Integer.valueOf(SocketService.getServerId()));
			// userDao.updateServerID(userName, 1);
			userDao.updateStatus(userName, UserDAO.USER_STATUS_UNAUTH);
		} else {
			userDao.create(userName,
					Integer.valueOf(SocketService.getServerId()));
		}

		System.out.println("ClientName[" + userName + "]; ClientId["
				+ client.getId() + "] is online without auth!");
		Timer timer = new Timer();
		// start the timeout timer
		timer.schedule(new UserTimeoutTimer(userName, client, "webrtc"),
				USER_TIMEOUT_DELAY);

		client.addListener(new ServerSession.RemoveListener() {
			public void removed(ServerSession session, boolean timeout) {
				System.out.println("*************/service/members   client.addListener removed begin*************");
				
				
				String localId = session.getId();
				Set<String> clientNames = members.keySet();

				for (String clientName : clientNames) 
				{
					System.out.println("====================");
					String clientId = members.get(clientName);
					if (clientId.contains(localId)) {
						if (clientId.equals(localId)) {
							members.remove(clientName);
							userDao.updateStatus(clientName,UserDAO.USER_STATUS_OFFLINE);
							System.out.println("");
							// ///////////////////////////////////////
							// 通知其他服务器，该用户已下线（问题1）
							ss.imformOtherServers(clientName);

							// 从临时会话表中查询会话，并发送掉线通知（问题2）
							SessionDAO sessionDAO = new SessionDAO();
							Iterator iter = WebrtcSessions.getSessionHashMap()
									.entrySet().iterator();
							while (iter.hasNext()) {
								Map.Entry entry = (Map.Entry) iter.next();
								String offerSessionId = (String) entry.getKey();
								SessionInfo val = (SessionInfo) entry
										.getValue();
								
								
								
							
								if (val.getLocalUserName().equals(clientName)) {

									System.out.println("val.getLocalUserName()="+val.getLocalUserName());
									System.out.println("val.getRemoteUserName()="+val.getRemoteUserName());
									System.out.println("clientName="+clientName);
									
								
									
									
									sessionDAO
											.updateStatus(
													offerSessionId,
													SessionStateType.SESSION_STATUS_CLOSED);
									userDao.updateStatus(
											val.getLocalUserName(),
											UserDAO.USER_STATUS_OFFLINE);
									Date date = new Date();
									Timestamp ts = new Timestamp(date.getTime());
									sessionDAO.updateShutdownTime(
											offerSessionId, ts);
									RTCMessage rtcMsgFrom = null;
									ArrayList<ServerSession> peers = null;

									rtcMsgFrom = new RTCMessage(offerSessionId,
											val.getLocalUserName(), val
													.getRemoteUserName(),
											ErrorType.OFFLINE);
									peers = HttpService
											.getClientsFromClientName(val
													.getRemoteUserName());
									HttpService.forwardingMessage(
											rtcMsgFrom.getJSONObject(), peers);
									logger.info("connection message:"+rtcMsgFrom);
									WebrtcSessions.getSessionHashMap().remove(
											offerSessionId);
									
								} else if(val.getRemoteUserName().equals(clientName)){
									
									System.out.println("val.getLocalUserName()="+val.getLocalUserName());
									System.out.println("val.getRemoteUserName()="+val.getRemoteUserName());
									System.out.println("clientName="+clientName);
									sessionDAO.updateStatus(offerSessionId,SessionStateType.SESSION_STATUS_CLOSED);
									userDao.updateStatus(val.getRemoteUserName(),UserDAO.USER_STATUS_OFFLINE);
									Date date = new Date();
									Timestamp ts = new Timestamp(date.getTime());
									sessionDAO.updateShutdownTime(offerSessionId, ts);
									RTCMessage rtcMsgFrom = null;
									ArrayList<ServerSession> peers = null;

									rtcMsgFrom = new RTCMessage(offerSessionId,val.getRemoteUserName(), val.getLocalUserName(), ErrorType.OFFLINE);
									peers = HttpService.getClientsFromClientName(val.getLocalUserName());

									HttpService.forwardingMessage(rtcMsgFrom.getJSONObject(), peers);
									System.out.println(rtcMsgFrom.toString());
									WebrtcSessions.getSessionHashMap().remove(offerSessionId);
								}
								else
								{
									System.out.println("this SessionInfo val: \n"
											+ "val.getLocalUserName()="+val.getLocalUserName()+"\n"
											+"val.getRemoteUserName()="+val.getRemoteUserName()+"\n"
											+ "is not related with the clientName:"+clientName+"!\n"
											);
									
									System.out.println("this SessionInfo val is not related with the clientName:"+clientName+"!\n"
											);
									
									
									
								}
							}

							if (WebrtcSessions.getSessionHashMap().containsKey(
									clientId)) {

							}

							// //////////////////////////////

						} else {
							clientId = clientId.replace(localId + ",", "");
							clientId = clientId.replace("," + localId, "");
							members.put(clientName, clientId);
						}
						System.out.println("ClientName[" + clientName
								+ "], ClientId[" + localId + "] is offline!");
						printMembers("webrtc");
						
						
	
						System.out.println("===========ClientName退出，处理后事============");
						//删除与clientName所有可能相连的客户端的残留会话
						//目前只有自动总机、人工总机
						removeSessions(clientName);
						
						break;
					}					
				}
				// members.values().remove(session.getId());
				// broadcastMembers(room,members.keySet());
				
				System.out.println("*************/service/members   client.addListener removed end*************");
			}
		});
		printMembers("webrtc");
		// broadcastMembers(room,members.keySet());
		
		System.out.println("*************/service/members   handleMembership end*************");
	}

	private void broadcastMembers(String room, Set<String> members) {
		// Broadcast the new members list
		ClientSessionChannel channel = bayeuxSessions.getLocalSession()
				.getChannel("/members/" + room);
		channel.publish(members);
	}
	
//	@Configure("/service/sessionchange")
	
	@Configure("/service/privatechat")
	protected void configurePrivateChat(ConfigurableServerChannel channel) {
		DataFilterMessageListener noMarkup = new DataFilterMessageListener(
				new NoMarkupFilter(), new BadWordFilter());
		channel.setPersistent(true);
		channel.addListener(noMarkup);
		channel.addAuthorizer(GrantAuthorizer.GRANT_PUBLISH);
	}

	@Listener("/service/privatechat")
	//ServerSession client:477a2m60cxa3b1684j7ag0b0j7 - last connect 20000 ms ago
	//ServerMessage message:{id=390, data={data={"type":1,"from":"y","roap":{"type":8,"token":"123","offerSessionId":null,"seq":1,"sdp":null,"label":null,"moreComingFlag":null,"tiebreaker":null,"msgSize":null,"msgContent":null}},
	//room=/room/webrtc}, channel=/service/privatechat}
	protected void privateChat(ServerSession client, ServerMessage message) {
		System.out.println("*************/service/privatechat  privateChat begin*************");
		Map<String, Object> bayeuxMsg = message.getDataAsMap();
//		System.out.println("bayeuxMsg:"+bayeuxMsg);
		String room = ((String) bayeuxMsg.get("room")).substring("/room/".length());
		Map<String, String> membersMap = members.get(room);
		if (membersMap == null) 
		{
			Map<String, String> new_room = new ConcurrentHashMap<String, String>();
			membersMap = members.putIfAbsent(room, new_room);
			if (membersMap == null)
				membersMap = new_room;
		}
		try 
		{
			JSONObject msgObj = new JSONObject((String) bayeuxMsg.get("data"));
			System.out.println(msgObj.toString());

			// add by jxk
			String from = msgObj.getString("from");System.out.println("from="+from);
			String to = msgObj.getString("to");System.out.println("to="+to);

			//通过SocketService.socketConns表判断 后台各个客户端是否与自己已经建立好连接！！！！！
			//if
			//没在自己wcs上要向dms询问目标wcs换成wcsid（即server表的id字段）
			//根据返回wcsid找到与目标wcs通信的socket
			
			//else
			//才走下面
			
			//add by yck
			//先判断目的地是否为自动总机，防止json格式不一致导致获取到roap字段产生异常
			if((Constants.AUTO_FLAG).equals(to))
			{									
				//将数据发送给自动总机客户端处理
				sendMessageToServer(Constants.AUTO_FLAG,msgObj.toString());
			}
			else if((Constants.ARTI_FLAG).equals(to))
			{
				//将数据发送给人工总机客户端处理
				sendMessageToServer(Constants.ARTI_FLAG,msgObj.toString());
			}
			else
			{
				String token = msgObj.getJSONObject("roap").getString("token");
				//roap消息 类型为auth
				if (msgObj.getJSONObject("roap").getInt("type") == RoapType.AUTH) 
				{
					System.out.println("Receive auth message from " + from);
					System.out.println("msg:"+msgObj.toString());
					if (!userDao.verify(from, token))
					{
						// 断开连接
						System.out.println("from:"+from);
						System.out.println("token:"+token);
						
						System.out.println(from + " authenticate failed!");
						client.disconnect();
					} 
					else 
					{
	
						System.out.println(from + " authenticate successful!");		
						userDao.updateStatus(from, UserDAO.USER_STATUS_ONLINE);

						ArrayList<ServerSession> peers = getClientsFromClientName(from);
						
						//by shanxuan鉴权成功后向客户端下发消息，是否已经有相同用户登录并在会话中
						logger.info("peers:"+peers);				
						printMembers("webrtc");
						
	//					//auth成功后下发sessionToggle返回值
	//				    String remoteVideoingUser = null;
					
						JSONObject okMsg = msgObj;
						okMsg.put("from", "wcs");
						okMsg.getJSONObject("roap").put("type", 10);
						okMsg.getJSONObject("roap").put("msgContent","success");
						//遍历所有会话，输出所有from正在进行的通话
	                    logger.info(WebrtcSessions.getSessionHashMap());

	                     //getSessionHashMap() is like :"webrtc_4636834e7c294ca8767b9f525":"com.webrtc.service.WebrtcSessions$SessionInfo@598fffdd"
	                    //前面一个是offerSessionId
				
							
		             
	//	                    //遍历临时会话表，查看from作为主叫或者被叫是否在会话中
	//	                    Iterator iter = WebrtcSessions.getSessionHashMap().entrySet().iterator();
	//	                    while(iter.hasNext()){
	//	                           Map.Entry entry=(Map.Entry)iter.next();
	//	                           String sessionId = (String)entry.getKey();
	//	                           SessionInfo info = (SessionInfo)entry.getValue();
	//	                           if(info.getLocalUserName().equals(from)){
	//	                        	   remoteVideoingUser = info.getRemoteUserName();
	//                                    
	//	                               }
	//	                           else
	//	                        	   if(info.getRemoteUserName().equals(from)){
	//	                        		remoteVideoingUser = info.getLocalUserName();
	//	                        	    }
	//	                        
	//	                    }
	//	                    
	//	                    okMsg.getJSONObject("roap").put("msgContent",remoteVideoingUser);
	
						System.out.println("wcs return : "+okMsg.toString());
	//					RTCMessage okMsg = new RTCMessage(null,"wcs",from,10,remoteVideoingUser);					
						ServerMessage.Mutable forward = generateMessage(okMsg.toString());

						//重复的用户名最后一个登陆有效
						peers.get(peers.size()-1).deliver(peers.get(peers.size()-1), forward);
						
						//重复的用户名断开除最后一个之外的
						if(peers.size()>1){
							peers.get(peers.size()-2).disconnect();
						}
					}
				} 
				//roap消息为非auth类型
				else 
				{
					if (userDao.isUserAvailable(from) && userDao.verify(from, token))
					{
						//by shanxuan 	
						WebrtcSessions.changeSessionStatus(client,msgObj);
						System.out.println("privatechat中调用getClientsFromClientName函数");
						ArrayList<ServerSession> peers = getClientsFromClientName(to);
						System.out.println("privatechat中调用forwardingMessage函数");
						System.out.println("msgObj:"+ msgObj.toString()+"--peers:"+peers);
						forwardingMessage(msgObj, peers);
						System.out.println("privatechat中调用forwardingMessage函数结束");
					} 
					else 
					{
						System.out.println("user " + from + " is not available!");
					}
						
				}
			}
		} 
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.out.println("*************/service/privatechat  privateChat end*************");
	}

	class BadWordFilter extends JSONDataFilter {
		@Override
		protected Object filterString(String string) {
			if (string.indexOf("dang") >= 0)
				throw new DataFilter.Abort();
			return string;
		}
	}

	public static boolean isUserLogin(String clientName) {

		return true;
	}

	// 根据clientName获取用户
	public static ArrayList<ServerSession> getClientsFromClientName(
			String clientNameStr) {
		Map<String, String> membersMap = members.get(defaultRoom);

		String[] clientNames = clientNameStr.split(",");
		ArrayList<ServerSession> clients = new ArrayList<ServerSession>(
				clientNames.length);

		for (String clientName : clientNames) {

			String clientIdStr = membersMap.get(clientName);
			if (clientIdStr != null) {
				System.out.println("Send to the local user " + clientName
						+ ", client[" + clientIdStr + "]");
				String[] clientIds = clientIdStr.split(",");// 有多个重复的用户用逗号区分并转发
				for (String clientId : clientIds) {
					ServerSession client = bayeuxServer.getSession(clientId);
					if (client != null) {
						clients.add(client);
					}
				}
			}
		}

		return clients;
	}

	/**
	 * forwarding the message received to the local user or remote server
	 * 
	 * @param msgObj
	 *            : the message received in json object style
	 * @throws
	 * @return
	 */

	// 向客户端发送消息,转发offer，answer消息等
	// peers是指需要将msgObj发送到的目的服务器peers上
	public static void forwardingMessage(JSONObject msgObj,
			ArrayList<ServerSession> peers) {

		Map<String, String> membersMap = members.get(defaultRoom);

		try {
			String from = msgObj.getString("from");
			String to = msgObj.getString("to");
			String offerSessionID = msgObj.getJSONObject("roap").getString(
					"offerSessionId");

			String clientIdStr = membersMap.get(from);

			ServerSession client = null;
			logger.info("Message : from[" + from + "], to[" + to + "]");
			System.out.println("forwardingMessage函数，Message : from[" + from + "], to[" + to + "]");
			
			if (clientIdStr != null) {
				client = bayeuxServer.getSession(clientIdStr.split(",")[0]);
			}

			
			// to字段标志的被叫属于 本WCS的 webrtc用户
			if (peers.size() > 0) {

				ServerMessage.Mutable forward = generateMessage(msgObj.toString());
				for (ServerSession peer : peers) {
					if (peer != client) {
							if (client != null ){
                            
							// by shanxuan
							// 当不是offer的时候转发根据指定的offersessionId和clientId转发
							if (msgObj.getJSONObject("roap").getInt("type") != RoapType.OFFER) {
								System.out.println("forwarding转发不是roap消息为offer的请求！");
								if (msgObj.getJSONObject("roap").getInt("type") == RoapType.CANDIDATE) {
									System.out.println("forwarding转发roap消息为candidate请求！");
									peer.deliver(client, forward);
									System.out.println("send candidate to :"+peer);
								}
								else if (msgObj.getJSONObject("roap").getInt("type") == RoapType.ERROR) {
									System.out.println("forwarding转发roap消息为error请求！");
									peer.deliver(client, forward);
									System.out.println("send error to :"+peer);
								}
								else if(msgObj.getJSONObject("roap").getInt("type") == RoapType.SHUTDOWN) {
									System.out.println("forwarding转发roap消息为shutdown请求！");
									peer.deliver(client, forward);
									System.out.println("send shutdown to :"+peer);
								}
								else{
									System.out.println("forwarding转发不是error和candidate的请求！");
									if (  WebrtcSessions.getSessionHashMap().get(offerSessionID)!=null											
											&&
										  ( WebrtcSessions.getSessionHashMap().get(offerSessionID).getCalleeClientId().equals(peer)
											||WebrtcSessions.getSessionHashMap().get(offerSessionID).getCallerClientId().equals(peer) )
										)
									    {  System.out.println("可以找到session!");
										   peer.deliver(client, forward);
										   System.out.println("send" + msgObj.getJSONObject("roap").getInt("type")+ "message to :" + peer);}
									else
									{   
										System.out.println("can not get the session,the session is null !!!");
									}
								}
								
							} 
							else
							{
								   peer.deliver(client, forward);
							       System.out.println("send offer message to :" + client);
						    }
						}	
						else
							peer.deliver(bayeuxSessions, forward);
							
					} else {
						System.out.println("Can't send to the local!");
					}
				}
			} else {

				//标志着to字段是否可达的标识量
				boolean isReachable = false;
				
				//to字段用户 通过规则判断隶属于 WISG
				if(isBelongWISG(to)){
					
				
					//取到WISG对应的SocketHandler 
					SocketHandler sh = SocketService
							.getSocketHandlerFromServerID(Constants.WISG_FLAG);
					
					if (sh != null) {
						
						int end = to.indexOf(Constants.WISG_DOMAIN);
						
						//to字段去掉  @open-ims.com
						//String tochange = to.substring(0,end);
						//msgObj.put("to",tochange);
						msgObj.put("to",to);
						
						// get the socket connection and send
						System.out.println("Send to the remote user " + to
								+ " on remote server '" + Constants.WISG_FLAG + "!");
						sh.send(msgObj.toString());

						isReachable = true;
						
						return;
					} else {
						System.out.println("Unknown remote server : "
								+ Constants.WISG_FLAG );
					}
				
				}
				
				//to字段用户 通过规则判断隶属于 WCSG
				else if(isBelongWCSG(to)){
					
					
					//取到WCSG对应的SocketHandler 
					SocketHandler sh = SocketService
							.getSocketHandlerFromServerID(Constants.WCSG_FLAG);
					
					if (sh != null) {
						
						int end = to.indexOf(Constants.WCSG_DOMAIN);
						
						//to字段去掉  @conf.com
						String tochange = to.substring(0,end);
						msgObj.put("to",tochange);
						
						// get the socket connection and send
						System.out.println("Send to the remote user " + tochange
								+ " on remote server '" + Constants.WCSG_FLAG + "!");
						sh.send(msgObj.toString());
						System.out.println("这里222");
						isReachable = true;
						
						return ;
					} else {
						System.out.println("Unknown remote server : "
								+ Constants.WCSG_FLAG );
					}
					
				}
				
				else{
				// ////////////////////////////
				// 如果临时用户表中存在该用户，则直接从表中读取，否则从数据库中读取，并将新用户添加入临时用户表
				String remoteServeId = null;
				if (!tempUsers.containsKey(to)) {
					//to字段用户在其他wcs上，并且有效，加入临时用户表
					if (userDao.isUserAvailable(to)) {
						remoteServeId = userDao.getServerAddr(to).toString();
						tempUsers.put(to, remoteServeId);
						System.out.println("from DataBase" + remoteServeId);
					}
				}

				//临时用户表中有to字段 用户 ，标志着 to字段 用户在其他的wcs上，并且有效
				// if(userDao.isUserAvailable(to)){
				if (tempUsers.containsKey(to)) {
					// String remoteServeId=null;
					if (tempUsers.containsKey(to)) {
						remoteServeId = tempUsers.get(to);
						System.out.println("from HashMap" + remoteServeId);
					} else {
						remoteServeId = userDao.getServerAddr(to).toString();
						tempUsers.put(to, remoteServeId);
						System.out.println("from DataBase" + remoteServeId);
					}
					// /////////////////////////////////

					// String remoteServeId =
					// userDao.getServerAddr(to).toString();
					SocketHandler sh = SocketService
							.getSocketHandlerFromServerID(remoteServeId);
					if (sh != null) {
						// get the socket connection and send
						System.out.println("Send to the remote user " + to
								+ " on remote server '" + remoteServeId + "!");
						sh.send(msgObj.toString());System.out.println("这里333");
						isReachable = true;
					} else {
						System.out.println("Unknown remote server : "
								+ remoteServeId);
					}
				}
				}
				
				//不可达
				if (isReachable == false && msgObj.getJSONObject("roap").getInt("type") != RoapType.CANDIDATE) {
					System.out.println("User '" + to + "' is offline or unreachable!");

					WebrtcSessions.removeSession(offerSessionID);
					WebrtcSessions.getSessionHashMap().remove(offerSessionID);
					
					System.out.println("Send the offline message to '" + from + "'!");
					RTCMessage rtcMsg = new RTCMessage(offerSessionID, to,from, ErrorType.OFFLINE);
					ServerMessage.Mutable forward = generateMessage(rtcMsg.toString());
					

					client.deliver(client, forward);
				}
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	//转发从总机获得的信息给前台（单人）
	public static void forwardingMessageFromSwitchBoard(JSONObject msgObj,ServerSession peer) {

			ServerMessage.Mutable forward = generateMessage(msgObj.toString());
			peer.deliver(bayeuxSessions, forward);
	}
	
	//转发从总机获得的信息给前台（多人）
	public static void forwardingMessageFromSwitchBoard(JSONObject msgObj,ArrayList<ServerSession> peers) {

			ServerMessage.Mutable forward = generateMessage(msgObj.toString());
			for(ServerSession peer : peers)
				peer.deliver(bayeuxSessions, forward);
	}
	
	
	public static ServerMessage.Mutable generateMessage(String data) {
		Map<String, Object> msg = new HashMap<String, Object>();

		msg.put("data", data);
		// msg.put("user", bayeuxMsg.get("user"));
		// msg.put("scope", "private");

		ServerMessage.Mutable forward = bayeuxServer.newMessage();
		forward.setChannel("/room/" + defaultRoom);
		forward.setData(msg);
		// forward.setId(message.getId());

		// test for lazy messages
		if (data.lastIndexOf("lazy") > 0)
			forward.setLazy(true);

		return forward;
	}

	/**
	 * the user timeout timer class
	 */
	public static class UserTimeoutTimer extends TimerTask {

		private String userID;
		private ServerSession client;
		private String room;

		public UserTimeoutTimer(String userID, ServerSession client, String room) {
			this.userID = userID;
			this.client = client;
			this.room = room;
		}

		@Override
		public void run() {
			// TODO Auto-generated method stub

			// roomMembers存放一个room中存在的所有成员，由 <userName, clientID>标识
			Map<String, String> roomMembers = members.get(room);
			if (roomMembers.containsKey(this.userID)) {
				if (!userDao.isUserAvailable(this.userID)) {
					System.out.println(this.userID + " has been timeout!");
					this.client.disconnect();
				}
			}
		}
	}
	
	//目前包含@open-ims.com的to字段都是属于WISG的
	public static boolean isBelongWISG(String to) {
		boolean result = false;
		
		if(to.indexOf(Constants.WISG_DOMAIN)!=-1)
		{
			result = true;
		}
			
		return result;
	}
	
	//目前包含@imsconf.com 的to字段都是属于WCSG的
	public static boolean isBelongWCSG(String to) {
		boolean result = false;
		
		if(to.indexOf(Constants.WCSG_DOMAIN)!=-1)
		{
			result = true;
		}
			
		return result;
	}
	
	
	//返回相应的超时时间
	public static int getTIMEOUT_DELAY_SECOND(String remoteId) {
		int result = -1;	
		if(remoteId.equals(Constants.WISG_FLAG))
		{
			result = Integer.valueOf(Constants.WISG_TIMEOUT_DELAY_SECOND);			
		}
		else if(remoteId.equals(Constants.WCSG_FLAG))
		{
			result = Integer.valueOf(Constants.WCSG_TIMEOUT_DELAY_SECOND);			
		}
		return result;
	}
	/**
	 * add by yck
	 */
	//逐一通知后端客户端删除与clientName相关的会话(在关闭浏览器、掉线时触发，closeListener回调函数里面)
	public void removeSessions(String clientName)
	{
		//自动总机
		sendMessageToServer(Constants.AUTO_FLAG,new AutoEndMessage(clientName).getMsgObj().toString());
		
		//人工总机
		sendMessageToServer(Constants.ARTI_FLAG,new ArtiEndMessage(clientName).getMsgObj().toString());
	}

	//向连接着wcs的serverName服务器(socket连接)发送消息msgObj消息
	public void sendMessageToServer(String serverName,String message)
	{
		SocketHandler socketHandler = SocketService.getSocketHandlerFromServerID(serverName);
		if(socketHandler != null)
		{
			socketHandler.send(message);
		}
	}

}
