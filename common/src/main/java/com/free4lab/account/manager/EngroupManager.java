package com.free4lab.account.manager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.model.Engroup;
import com.free4lab.account.model.EngroupDAO;




public class EngroupManager {

	/*
	 * 
	 */
	private static EngroupDAO engroupDAO = new EngroupDAO();
	private static final Logger LOGGER = Logger.getLogger(EngroupManager.class);
	
	public static List<Engroup> getAllEngroups() {
		try{
			return engroupDAO.findAll();
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	public static List<Engroup> findEngroupByEid(final Object eid){
		try{
			return engroupDAO.findByUsername(eid);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	public static Engroup findEngroupByFz(final Object fz){
		try{
			List<Engroup> result = engroupDAO.findByFz(fz);
			if(null !=result && result.size()>0){
				return result.get(0);
			}
			
			return null;
		}catch(Exception e){
			LOGGER.debug(e);
			return null;
		}
	}
	
	public static List<Engroup> findEngroupsByLFz(final Object lfz){
		try{
			List<Engroup> result = engroupDAO.findByLfz(lfz);
			if(null !=result && result.size()>0){
				return result;
			}
			
			return null;
		}catch(Exception e){
			LOGGER.debug(e);
			return null;
		}
	}
	public static Engroup findGroupfatherById(Integer fz){
		try{
			
			Engroup engroup;
			engroup = engroupDAO.findById(fz);
			System.out.println("engroup="+engroup.getFzmc());
			return engroup;	
			
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	public static List<Engroup> findGroupfatherListById(Integer fz){
		try{
			
			List<Engroup> result = new ArrayList<Engroup>();
			Engroup engroup = new Engroup();
			//System.out.println("findgroupfather");
			while(null!=(engroup=findGroupfatherById(fz)))
			{
				System.out.println("findgroupfather");
				//engroup=findGroupfatherById(fz);
				System.out.println("2fz="+engroup.getFz());
				result.add(engroup);
				System.out.println("result="+result.get(0).getFzmc());
				fz=engroup.getLfz();
				System.out.println("fz="+fz);
			}
					
			return result;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	
	
	public static List<Engroup> findEngroupByLfz(final Object lfz){
		try{
			return engroupDAO.findByLfz(lfz);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	public static List<Engroup> findEngroupByEidLfz(final Object eid, final Object lfz){
		try{
			return engroupDAO.findByEidLfz(eid,lfz);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	public static List<Engroup> findEngroupByEidForPage(final Object eid,final Object lfz,int page,int size){
		try{
			return engroupDAO.findByEidLfzForPage(eid,lfz,page,size);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	} 
	
	public static long countEngroupByEidForPage(final Object eid,final Object lfz){
		try{
			return engroupDAO.countByEidLfzForPage(eid,lfz);
		}catch (Exception e) {
			LOGGER.debug(e);
			return -1;
		}
	}
	
	public static boolean updateEngroup(Integer fz, Integer eid, String fzmc, Integer lfz) {
		Engroup engroup = engroupDAO.findById(fz);
		engroup.setFz(fz);
		engroup.setEid(eid);
		engroup.setFzmc(fzmc);
		engroup.setLfz(lfz);
		try{	
			engroupDAO.update(engroup);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}

	public static boolean addEngroup(Integer eid, String fzmc, Integer lfz) {
		Engroup engroup = new Engroup(eid, fzmc, lfz);
		try{	
			engroupDAO.save(engroup);
			System.out.println("save success");
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
	
	public static boolean delEngroup(Integer fz) {
		try{	
			engroupDAO.deleteByPrimaryKey(fz);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
	
	public static Engroup updateEngroup2(Integer fz,String fzmc) {
		Engroup engroup = engroupDAO.findById(fz);
		engroup.setFzmc(fzmc);

		try{	
			engroupDAO.update(engroup);
			return engroup;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}

	public static Engroup addEngroup2(Integer eid, String fzmc, Integer lfz) {
		Engroup engroup = new Engroup(eid, fzmc, lfz);
		try{	
			engroupDAO.save(engroup);
			System.out.println("save success");
			return engroup;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	
	/**
	 * 查询eid企业下的所有分组id列表
	 */
	public static List<Integer> getFzidsInEnterprise(final Object eid)
	{
		List<Engroup> engroups = findEngroupByEid(eid);
		if(engroups == null || engroups.size() <= 0)
			return Collections.emptyList();
		
		List<Integer> fzids = new ArrayList<Integer>();
		for(Engroup engroup : engroups)
			fzids.add(engroup.getFz());
		
		return fzids;
	}
	
}
