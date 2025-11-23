/**
 * Supabase 客户端配置示例
 * 
 * 使用说明：
 * 1. 复制此文件为 supabaseClient.js
 * 2. 替换 YOUR_SUPABASE_URL 和 YOUR_SUPABASE_ANON_KEY 为你的实际值
 * 3. 在 Supabase Dashboard -> Settings -> API 中可以找到这些值
 */

import { createClient } from '@supabase/supabase-js';

// ⚠️ 请替换为你的 Supabase 项目配置
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchMenu = async () => {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });
  
  if (error) {
    console.error('获取菜单失败:', error);
    throw error;
  }
  
  return data;
};

export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
  
  if (error) {
    console.error('创建订单失败:', error);
    throw error;
  }
  
  return data;
};

