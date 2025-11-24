/**
 * WxPusher 微信推送服务
 * 用于向微信发送订单通知
 */

// ⚠️ 配置将从 Vercel 环境变量中读取
// 请确保在 Vercel Settings -> Environment Variables 中设置 WXPUSHER_APP_TOKEN 和 WXPUSHER_UID
const WXPUSHER_CONFIG = {
  // 假设你的 Vercel 环境变量键名是 WXPUSHER_APP_TOKEN
  appToken: process.env.WXPUSHER_APP_TOKEN, 
  
  // 假设你的 Vercel 环境变量键名是 WXPUSHER_UID
  uid: process.env.WXPUSHER_UID,           
  
  apiUrl: 'https://wxpusher.zjiecode.com/api/send/message'
};

/**
 * 发送微信通知
 * @param {Object} orderData - 订单数据
 * @param {Array} items - 购物车商品列表
 * @param {string} note - 备注
 */
export const sendWxPusherNotification = async (orderData, items, note) => {
  // 🌟 1. 安全检查：如果缺少关键配置，直接跳过通知，防止抛出错误导致订单回滚
  if (!WXPUSHER_CONFIG.appToken || !WXPUSHER_CONFIG.uid) {
    console.error("【WxPusher 警告】缺少 AppToken 或 UID 配置，已跳过通知发送。");
    return { success: false, reason: 'Missing configuration' };
  }
  
  try {
    // 构建菜品列表 HTML
    const itemsHtml = items
      .map(item => {
        // 确保 total_price 是数字类型
        const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
        return `<p style="margin: 8px 0; padding-left: 20px;">• ${item.icon || '🍽️'} ${item.name} × ${item.quantity} = ¥${itemTotal}</p>`;
      })
      .join('');

    // 构建完整的 HTML 内容
    const content = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h1 style="color: #FF6B9D; margin-bottom: 20px;">❤️ 新的爱心订单来了！</h1>
        <div style="background: #FFF5F7; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h2 style="color: #333; margin-bottom: 10px; font-size: 18px;">📋 订单详情</h2>
          ${itemsHtml}
          <hr style="border: none; border-top: 1px solid #FFD1D1; margin: 15px 0;">
          <p style="font-weight: bold; color: #FF6B9D; font-size: 16px;">
            总计：¥${orderData.total_price.toFixed(2)}
          </p>
        </div>
        ${note ? `<div style="background: #FFF9E6; padding: 10px; border-radius: 6px; margin-top: 10px;">
          <p style="margin: 0; color: #666;"><strong>备注：</strong>${note}</p>
        </div>` : ''}
        <p style="color: #999; font-size: 12px; margin-top: 15px;">
          ⏰ 下单时间：${new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    `;

    // 构建请求体
    const requestBody = {
      appToken: WXPUSHER_CONFIG.appToken,
      content: content,
      summary: '老婆饿了，快去查看！',
      contentType: 2, // 2 表示 HTML 格式
      uids: [WXPUSHER_CONFIG.uid]
    };

    // 发送 POST 请求
    const response = await fetch(WXPUSHER_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    // 🌟 2. 失败检查：如果 API 返回失败
    if (!response.ok || result.code !== 1000) {
      console.error('【WxPusher 失败】发送通知失败 (API返回错误):', result.msg || '未知错误');
      return { success: false, reason: result.msg || 'API Error' }; // 阻止错误抛出
    }

    console.log('微信通知发送成功:', result);
    return result;
  } catch (error) {
    // 🌟 3. Catch 块：如果发生网络或代码错误
    console.error('【WxPusher 失败】发送微信通知失败 (网络或代码错误):', error);
    return { success: false, reason: error.message || 'Network/Runtime Error' }; // 阻止错误抛出
  }
};
