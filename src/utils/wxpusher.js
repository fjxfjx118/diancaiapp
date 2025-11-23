/**
 * WxPusher 微信推送服务
 * 用于向微信发送订单通知
 */

// ⚠️ 请替换为你的 WxPusher 配置
// 在 WxPusher 官网 (https://wxpusher.zjiecode.com) 注册并获取以下信息：
const WXPUSHER_CONFIG = {
  appToken: 'AT_UEksqsZkCT6wLryl8c7VDpVSYb7tVXTw',  // 你的 AppToken
  uid: 'UID_Y3guovHLXnPB1DFKYHATcQrB8HT0',          // 你的 UID（接收通知的微信用户ID）
  apiUrl: 'https://wxpusher.zjiecode.com/api/send/message'
};

/**
 * 发送微信通知
 * @param {Object} orderData - 订单数据
 * @param {Array} items - 购物车商品列表
 * @param {string} note - 备注
 */
export const sendWxPusherNotification = async (orderData, items, note) => {
  try {
    // 构建菜品列表 HTML
    const itemsHtml = items
      .map(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
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

    if (!response.ok || result.code !== 1000) {
      throw new Error(result.msg || '发送通知失败');
    }

    console.log('微信通知发送成功:', result);
    return result;
  } catch (error) {
    console.error('发送微信通知失败:', error);
    throw error;
  }
};

