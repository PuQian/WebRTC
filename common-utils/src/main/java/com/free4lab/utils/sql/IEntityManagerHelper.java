/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.sql;

import javax.persistence.EntityManager;
/**
 * JPA数据库管理器 接口
 * @author yicou
 */
public interface IEntityManagerHelper {

    /**
     * 获取JPA数据库连接
     * @param PUName 数据库单元的名称
     * @return
     */
    public EntityManager getEntityManager(String PUName);
}
