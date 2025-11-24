/**
 * WxPusher 微信推送服务
 * * ⚠️ 警告：该版本用于隔离测试，已完全禁用通知发送功能。
 */

// 保持 WXPUSHER_CONFIG 不变，但函数体内所有逻辑被移除
const WXPUSHER_CONFIG = {
  appToken: process.env.WXPUSHER_APP_TOKEN, 
  uid: process.env.WXPUSHER_UID,           
  apiUrl: 'https://wxpusher.zjiecode.com/api/send/message'
};

/**
 * 发送微信通知 (隔离测试版)
 * 作用：立即返回成功，以确保订单提交事务不会因通知失败而回滚。
 */
export const sendWxPusherNotification = async (orderData, items, note) => {
    // ⚠️ 订单提交的事务在这里被安全地“通过”了
    console.log("【隔离测试】已安全跳过 WxPusher 通知，不会导致订单回滚。");
    return { success: true, reason: 'WxPusher disabled for testing' };
};
