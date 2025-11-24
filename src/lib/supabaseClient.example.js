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
const supabaseUrl = 'https://bmawizmsttnpjuxukfye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYXdpem1zdHRucGp1eHVrZnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDQxODAsImV4cCI6MjA3OTQ4MDE4MH0.TIiSLMjHMTD5abFoyEqCZHMnTv4CVUOgxBGgmceUDQU';

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

