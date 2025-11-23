import { createOrder } from '../lib/supabaseClient';
import { sendWxPusherNotification } from './wxpusher';

/**
 * 提交订单的核心函数
 * 1. 将订单写入 Supabase 数据库
 * 2. 写入成功后，立即发送微信通知
 * 
 * @param {Array} cartItems - 购物车商品列表，格式：[{id, name, price, quantity, icon}]
 * @param {string} note - 订单备注
 * @returns {Promise<Object>} 返回订单数据
 */
export const submitOrder = async (cartItems, note = '') => {
  try {
    // 验证购物车不为空
    if (!cartItems || cartItems.length === 0) {
      throw new Error('购物车为空，无法提交订单');
    }

    // 计算总价
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);

    // 构建订单数据
    const orderData = {
      items: cartItems, // JSONB 格式存储
      total_price: totalPrice,
      note: note || null
    };

    // Step 1: 将订单写入 Supabase 数据库
    console.log('正在保存订单到数据库...');
    const savedOrder = await createOrder(orderData);
    console.log('订单保存成功:', savedOrder);

    // Step 2: 订单保存成功后，立即发送微信通知
    console.log('正在发送微信通知...');
    await sendWxPusherNotification(savedOrder, cartItems, note);
    console.log('微信通知发送成功！');

    return savedOrder;
  } catch (error) {
    console.error('提交订单失败:', error);
    throw error;
  }
};

