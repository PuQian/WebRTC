package com.webrtc.dao;

import java.util.List;
import java.util.*;


import java.util.logging.Level;

import javax.persistence.Query;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class ServerDAO extends AbstractDAO<Server> {

	@Override
	public Class getEntityClass() {
		return Server.class;
	}

	public static final String PU_NAME = "WebrtcDemoPU";
	@Override
	public String getPUName() {
		return PU_NAME;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}
	
	public String getClassName() {
		return getEntityClass().getName();
	}
	
	// 
	public Server create(String serverAddr, Integer serverPort,String name){
		List<Server> servers = findByProperty("serverAddr", serverAddr);
		if(servers.isEmpty()){
			Server server = new Server();
			server.setServerAddr(serverAddr);
			server.setPort(serverPort);
			server.setName(name);
			save(server);
			return server;
		} else{
			Iterator iterator  = servers.iterator();  
			while(iterator.hasNext())
			{
				Server server = (Server)iterator.next();
				if(server.getPort().equals(serverPort))					
				{
					server.setName(name);
					update(server);
					return server;
				}
			}
			Server server=new Server();
			server.setServerAddr(serverAddr);
			server.setPort(serverPort);
			server.setName(name);
			save(server);
			return server;
		}
	}
	
	 @SuppressWarnings("unchecked")
	public List<Server> findByPropertys(String propertyName1,String serverAddr,String propertyName2,Integer serverPort){
	
  
		 
	 	String queryString = "select model from " + getClassName() + " model where"
    			+ " model." + propertyName1 + " = " + serverAddr+" and model." +propertyName2 + " = " + serverPort; 
    	try {
			Query query = getEntityManager().createQuery(queryString);
			return query.getResultList();
		}catch (RuntimeException re) {
            log("find server by serveraddr and port failed", Level.SEVERE, re);
            throw re;
        }
	}
	
	/**
	 * 由server id找到server地址
	 * @param serverID
	 * @throws IllegalArgumentException 如果由serverID找不到对应的server
	 * @return
	 */
	public String getServerAddr(Integer serverID) throws IllegalArgumentException {
		Server server = findById(serverID);
		if(server == null)
			throw new IllegalArgumentException("can not find a server by serverID");
		return server.getServerAddr();
	}
	
	/**
	 * 由server地址找到server id
	 * @param serverAddr
	 * * @throws IllegalArgumentException 如果由serverID找不到对应的serverAddr
	 * @return
	 */
	public Integer getServerID(String serverAddr,Integer serverPort)  throws IllegalArgumentException {
		List<Server> servers = findByProperty("serverAddr", serverAddr);
		if(servers.isEmpty())
			throw new IllegalArgumentException("can not find a server by serverAddr");
		else
		{
			for(int i=0;i<servers.size();i++)
			{
				if(servers.get(i).getPort().equals(serverPort))
				{
					return servers.get(i).getId();
				}
			}
		}
		return servers.get(0).getId();	
	}
	
	public List<Server> getServerList(){
		return findAll();
	}
	
	public static void test(){
		ServerDAO serverDAO = new ServerDAO();
	//	serverDAO.create("1.1.1.1",1111);
	//	serverDAO.create("1.1.1.1",2222);
	//	serverDAO.create("1.1.1.1",3333);
//		System.out.println(serverDAO.getServerID("localhost"));
//		System.out.println(serverDAO.getServerID("no"));
//		System.out.println(serverDAO.getServerAddr(1));
//		System.out.println(serverDAO.getServerAddr(2));
	}
	
	public static void main (String[] args)
	{
		//ServerDAO.test();
		ServerDAO serverDAO = new ServerDAO();
	
//		Server b =serverDAO.create("1.1.1.1", 1111,"wcs1");
//		Server a =serverDAO.create("1.1.1.1", 2222,"wcs2");
//		Server c =serverDAO.create("2.2.2.2", 2222,"wcs3");
		
		String server = serverDAO.getServerAddr(99);
		System.out.println(server);
	}
}
