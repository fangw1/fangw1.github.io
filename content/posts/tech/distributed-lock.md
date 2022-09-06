---
title: "Distributed Lock"
date: 2022-09-06T15:16:42+08:00
lastmod: 2022-09-06T15:16:42+08:00
author: ["Patick"]
keywords: 
- 
categories: 
- 
tags: 
- lock
description: "分布式锁"
weight:
slug: ""
draft: false # 是否为草稿
comments: true
reward: true # 打赏
mermaid: true #是否开启mermaid
showToc: true # 显示目录
TocOpen: true # 自动展开目录
hidemeta: false # 是否隐藏文章的元信息，如发布日期、作者等
disableShare: true # 底部不显示分享栏
showbreadcrumbs: true #顶部显示路径
cover:
    image: "" #图片路径例如：posts/tech/123/123.png
    caption: "" #图片底部描述
    alt: ""
    relative: false
---



# 分布式锁的几种实现

## 背景

在分布式系统中，当某个资源可以被多个系统访问使用到的时候，为了保证大家访问这个数据是一致性的，那么就要求再同一个时刻，只能被一个系统使用，这个时候就需要分布式锁。

### 分布式和集群的区别

定义的区别

> 计算机集群（英语：computer cluster）是一组松散或紧密连接在一起工作的计算机。由于这些计算机协同工作，在许多方面它们可以被视为单个系统。与网格计算机不同，计算机集群将每个节点设置为执行相同的任务，由软件控制和调度。

维基百科的解释，关键词是：一组计算机、相同的任务。

> 分布式系统是一组电脑，透过网络相互连接传递消息与通信后并协调它们的行为而形成的系统。[1]组件之间彼此进行交互以实现一个共同的目标。把需要进行大量计算的工程数据分割成小块，由多台计算机分别计算，再上传运算结果后，将结果统一合并得出数据结论的科学。

维基百科的解释，关键词是：一组计算机、大计算分解

- 集群的关键作用是提升并发处理能力
- 分布式的关键作用是解耦以便于快速迭代

## 分布式锁应该具备哪些条件

- 在分布式系统环境下，一个方法在同一时间只能被一个机器的一个线程执行
- 高可用的获取锁与释放锁
- 高性能的获取锁与释放锁
- 具备可重入特性
- 具备锁失效机制，防止死锁
- 具备非阻塞锁特性，即没有获取到锁将直接返回获取锁失败


## 实现

### 定义接口

```java
/**
 * 分布式锁顶级接口
 *
 * @author :    fangwei
 * @date :    2019/9/23 0:48
 */
public interface DistributedLock {

    /**
     * 获取锁
     *
     * @param key KEY
     * @throws Exception 异常
     */
    void acquire(String key) throws Exception;

    /**
     * 获取锁
     *
     * @param key      KEY
     * @param maxWait  最大等待时间
     * @param waitUnit 等待时间单位
     * @return 成功/失败
     * @throws Exception 异常
     */
    boolean acquire(String key, long maxWait, TimeUnit waitUnit) throws Exception;

    /**
     * 释放锁
     *
     * @param key KEY
     * @throws Exception 异常
     */
    void release(String key) throws Exception;
}
```

### ZooKeeper 分布式锁实现

```java
/**
 * Distributed Lock http://curator.apache.org//getting-started.html
 *
 * @author :    fangwei
 * @date :    2020/5/29 15:02
 */
public class ZkDistributedLock implements DistributedLock {

    private final CuratorFramework client;

    public ZkDistributedLock(CuratorFramework client) {
        this.client = client;
    }

    @Override
    public void acquire(String key) throws Exception {
        InterProcessMutex lock = new InterProcessMutex(client, key);
        lock.acquire();
    }

    @Override
    public boolean acquire(String key, long maxWait, TimeUnit waitUnit) throws Exception {
        InterProcessMutex lock = new InterProcessMutex(client, key);
        return lock.acquire(maxWait, waitUnit);
    }

    @Override
    public void release(String key) throws Exception {
        InterProcessMutex lock = new InterProcessMutex(client, key);
        lock.release();
    }
}
```

#### 定义CuratorFramework

```java
    /**
     * initMethod start 相当于执行 client.start()
     *
     * @return CuratorFramework
     */
    @Bean(initMethod = "start")
    @ConditionalOnMissingBean
    public CuratorFramework curatorFramework(CuratorProperties curatorProperties) {
        RetryPolicy retryPolicy = new ExponentialBackoffRetry(curatorProperties.getBaseSleepTimeMs(), curatorProperties.getMaxRetries());
        return CuratorFrameworkFactory.newClient(curatorProperties.getZookeeperConnectionString(), retryPolicy);
    }
    
```


```java
/**
 * zk curator 配置
 *
 * @author :    fangwei
 * @date :    2020/1/22 9:18
 */
@Data
@ConfigurationProperties(prefix = "curator")
public class CuratorProperties {
    private int baseSleepTimeMs = 1000;
    private int maxRetries = 3;
    private String zookeeperConnectionString;
}
```

### Redisson 分布式锁实现

```java
/**
 * Redisson 分布式R锁 - 可重入锁
 *
 * @author :    fangwei
 * @date :    2020/4/28 10:30
 */
public class RedissonDistributedRLock implements DistributedLock {

    private final RedissonClient redissonClient;

    public RedissonDistributedRLock(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }

    @Override
    public void acquire(String key) {
        // 可重入锁（Reentrant Lock）
        RLock lock = redissonClient.getLock(key);
        lock.lock();
    }

    @Override
    public boolean acquire(String key, long maxWait, TimeUnit waitUnit) throws Exception {
        // 可重入锁（Reentrant Lock）
        RLock lock = redissonClient.getLock(key);
        return lock.tryLock(maxWait, waitUnit);
    }

    @Override
    public void release(String key) {
        // 可重入锁（Reentrant Lock）
        RLock lock = redissonClient.getLock(key);
        lock.unlock();
    }
}

```

### 使用示例

####  **属性设置**

```properties
curator.zookeeper-connection-string = zk链接地址
curator.base-sleep-time-ms = 1000 
curator.max-retries = 3
```

####  注入bean
```java
    @Autowired
    private CuratorFramework client;

    @Bean
    public DistributedLock distributedLock() {
        return new ZkDistributedLock(client);
    }
    
    // 或者使用Redisson
    
       @Autowired
    private RedissonClient redissonClient;

    @Bean
    public DistributedLock distributedLock() {
        return new RedissonDistributedRLock(redissonClient);
    }
```

#### Recipes
```java
    @Autowired
    private DistributedLock lock;


    if ( lock.acquire(maxWait, waitUnit) ) 
    {
        try 
        {
            // do some work inside of the critical section here
        }
        finally
        {
            lock.release();
        }
    }
```


## 总结

- 如果后期用户需要切换分布式锁的实现，只需要调整依赖的bean的注入即可

## 常见问题

### 使用Redisson分布式锁时，出现 unlock 异常

异常信息如下：
```shell script
attempt to unlock lock, not locked by current thread by node id: 84ed3ba0-f34c-4ffd-afbf-882e775f6cd
```

解决办法: 在解锁之前，判断当前key对应的锁**是否已被锁定并且是否被当前线程保持**，代码如下：
```java
    if (lock.isLocked() && lock.isHeldByCurrentThread()) {
        lock.unlock();
    }
```


