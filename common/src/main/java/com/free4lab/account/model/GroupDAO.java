package com.free4lab.account.model;

import java.util.List;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class GroupDAO extends AbstractDAO<Group> {
	// property constants
	public static final String USERNAME = "userId";

	@Override
	public Class<Group> getEntityClass() {
		return Group.class;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}

	@Override
	public String getPUName() {
		return "AccountPU";
	}

	public List<Group> findByUsername(Object username) {
		return findByProperty(USERNAME, username);
	}

	public List<Group> findByUsernameForPage(Object username, int page, int size) {
		return findByProperty(USERNAME, username, page, size);
	}

	public long countByUsernameForPage(Object username) {
		return countByProperty(USERNAME, username);
	}

}