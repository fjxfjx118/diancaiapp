import { createClient } from '@supabase/supabase-js';

// ⚠️ 请替换为你的 Supabase 项目配置
// 在 Supabase Dashboard -> Settings -> API 中可以找到这些值
const supabaseUrl = 'https://bmawizmsttnpjuxukfye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYXdpem1zdHRucGp1eHVrZnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDQxODAsImV4cCI6MjA3OTQ4MDE4MH0.TIiSLMjHMTD5abFoyEqCZHMnTv4CVUOgxBGgmceUDQU';

// 创建 Supabase 客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 导出常用的数据库操作方法
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

