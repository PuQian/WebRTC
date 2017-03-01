package com.free4lab.account.manager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.free4lab.account.model.Client;
import com.free4lab.account.model.ClientDAO;


public class ClientManager {
	
	/**
	 * ClientDAO的静态实例
	 */
	private static ClientDAO clientDAO = new ClientDAO();
	 
	/**
	 * 根据customId返回custom数据
	 * @param customId
	 * @return
	 */
	public static Client getClientByClientId(String client_id){
		List<Client> list = clientDAO.findByProperty("client_id", client_id);
		if (list.size() <= 0) {
            return null;
        }
		return list.get(0);
	}
	
	/**
	 * 根据Secretkey返回client数据
	 * @param customId
	 * @return
	 */
	public static Client getClientByClientSecret(String client_secret){
		List<Client> list = clientDAO.findByProperty("client_secret", client_secret);
		if (list.size() <= 0) {
            return null;
        }
		return list.get(0);
	}
	
	/**
	 * 根据id列表返回相应的Custom条目
	 * @param ids
	 * @return
	 */
	public static List<Client> getCustomByIds(List<Integer> ids){
		if(ids.size() == 0){
			return null;
		}
		List<Client> customList = new ArrayList<Client>();
		customList = clientDAO.findClientByIds(ids);
		return customList;
	}

	public static List<Client> getClientByIds(List<Integer> ids) {
		if(ids.size() == 0){
			return Collections.emptyList();
		}
		List<Client> clients = new ArrayList<Client>();
		clients = clientDAO.findClientByIds(ids);
		return clients;
	}

	public static int getIdByClientIdAndNeedAuth(String clientId, Integer need_auth) {
		List<Client> clientList = clientDAO.findByProperty2("client_id", clientId, "need_author", need_auth.toString());
		if (clientList.size() <= 0) {
			return -1;
        }
		return clientList.get(0).getId();
	}

	public static int getIdByClientId(String clientId) {
		List<Client> list = clientDAO.findByProperty("client_id", clientId);
		if (list.size() <= 0) {
            return -1;
        }
		return list.get(0).getId();
	}
	

	/**
	 * 获取当前所有应用
	 * @return
	 */
	public static List<Client> getAllClient(){
		return clientDAO.findAll();
	}
	
	/**
	 * 保存一新应用
	 * @return
	 */
	public static Client saveClient(Client client){
		try{
			clientDAO.save(client);
			return client;
		}catch(Exception ex){
			System.err.println(ex.getMessage());
			ex.printStackTrace(System.err);
			return null;
		}
	}
	/**
	 * 根据应用的主键获取当前应用
	 * @return
	 */
	public static Client getClientById(Integer id){
		Client client = clientDAO.findById(id);
		return client;
	}
	/**
	 * 更新当前应用
	 * @return
	 */
	public static Client updateClient(Client client){
		try{
			clientDAO.update(client);
			return client;
		}catch(Exception ex){
			System.err.println(ex.getMessage());
			ex.printStackTrace(System.err);
			return null;
		}
	}


	/**
	 * 根据主键删除应用
	 * @return
	 */
	public static void delClientByPrimaryKey(Integer primaryKey){
		clientDAO.deleteByPrimaryKey(primaryKey);
	}

}
