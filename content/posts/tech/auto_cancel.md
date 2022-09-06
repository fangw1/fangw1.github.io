---
title: "Tech"
date: 2022-05-05T00:17:58+08:00
lastmod: 2022-05-05T00:17:58+08:00
author: ["Patrick"]
keywords: 
- 
categories: 
- 
tags: 
- tech
description: ""
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




# 生成订单30分钟未支付，则自动取消，该怎么实现？

在开发中，往往会遇到一些关于延时任务的需求。例如
- 生成订单`30`分钟未支付，则自动取消
- 生成订单`60`秒后,给用户发短信

对上述的任务，我们给一个专业的名字来形容，那就是延时任务。那么这里就会产生一个问题，这个延时任务和定时任务的区别究竟在哪里呢？一共有如下几点区别
- 定时任务有明确的触发时间，延时任务没有
- 定时任务有执行周期，而延时任务在某事件触发后一段时间内执行，没有执行周期
- 定时任务一般执行的是批处理操作是多个任务，而延时任务一般是单个任务

一般实现的方法有几种：

- 使用 rocketmq、rabbitmq、pulsar 等消息队列的延时投递功能
- 使用 redisson 提供的 DelayedQueue

有一些方案虽然广为流传但存在着致命缺陷，**不要用来实现延时任务**

- 使用 redis 的过期监听
- 使用 rabbitmq 的死信队列
- 使用非持久化的时间轮

## 数据库轮询 :+1:

> 数据量，并发量并不大的系统，可以使用这个方案。

该方案通常是在小型项目中使用，即通过一个线程定时的去扫描数据库，通过订单时间来判断是否有超时的订单，然后进行`update`或`delete`等操作。

- 优点: 简单易行，支持集群操作
- 缺点:
  - (1)对服务器内存消耗大
  - (2)存在延迟，比如你每隔3分钟扫描一次，那最坏的延迟时间就是`3`分钟
  - (3)假设你的订单有几千万条，每隔几分钟这样扫描一次，数据库损耗极大

## JDK的延迟队列 :speak_no_evil:

该方案是利用`JDK`自带的`DelayQueue`来实现，这是一个无界阻塞队列，该队列只有在延迟期满的时候才能从中获取元素，放入`DelayQueue`中的对象，是必须实现`Delayed`接口的。

- 优点: 效率高,任务触发时间延迟低。
  - 缺点:
  - (1)服务器重启后，数据全部消失，怕宕机 
  - (2)集群扩展相当麻烦 
  - (3)因为内存条件限制的原因，比如下单未付款的订单数太多，那么很容易就出现OOM异常
  - (4)代码复杂度较高

## 时间轮算法 :speak_no_evil:

时间轮是一种很优秀的定时任务的数据结构，然而绝大多数时间轮实现是纯内存没有持久化的。

## redis缓存过期监听 :speak_no_evil:

 Redis 官方手册的keyspace-notifications: timing-of-expired-events中明确指出：

> Basically expired events are generated when the Redis server deletes the key and not when the time to live theoretically reaches the value of zero

`redis` 自动过期的实现方式是：定时任务离线扫描并删除部分过期键；在访问键时惰性检查是否过期并删除过期键。`redis` 从未保证会在设定的过期时间立即删除并发送过期通知。实际上，过期通知晚于设定的过期时间数分钟的情况也比较常见。

此外键空间通知采用的是发送即忘(fire and forget)策略，并不像消息队列一样保证送达。当订阅事件的客户端会丢失所有在断线期间所有分发给它的事件。

## Redission RDelayedQueue

redisson delayqueue 是一种基于 redis zset 结构的延时队列实现。delayqueue 中有一个名为 timeoutSetName 的有序集合，其中元素的 score 为投递时间戳。delayqueue 会定时使用 zrangebyscore 扫描已到投递时间的消息，然后把它们移动到就绪消息列表中。

delayqueue 保证 redis 不崩溃的情况下不会丢失消息，在没有更好的解决方案时不妨一试。

在数据库索引设计良好的情况下，定时扫描数据库中未完成的订单产生的开销并没有想象中那么大。在使用 redisson delayqueue 等定时任务中间件时可以同时使用扫描数据库的方法作为补偿机制，避免中间件故障造成任务丢失。

[基于 Redis 实现延迟队列](../redis/delay-queue)

## 消息队列 :+1:

- 优点: 高效,可以利用消息队列的分布式特性轻易的进行横向扩展,消息支持持久化增加了可靠性。
- 缺点：依赖消息队列，复杂度和成本变高

### RocketMQ 实现

### Kafka 实现