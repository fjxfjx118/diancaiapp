-- 情侣点餐 App 数据库表结构
-- 请在 Supabase Dashboard 的 SQL Editor 中执行以下语句

-- 创建 menu 表（菜单表）
CREATE TABLE IF NOT EXISTS menu (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 orders 表（订单表）
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  items JSONB NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  note TEXT
);

-- 为 menu 表创建索引（优化分类查询）
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu(category);

-- 为 orders 表创建索引（优化时间查询）
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 插入示例菜单数据（可选）
INSERT INTO menu (name, category, price, icon) VALUES
  ('宫保鸡丁', '热菜', 38.00, '🍗'),
  ('麻婆豆腐', '热菜', 28.00, '🌶️'),
  ('糖醋里脊', '热菜', 42.00, '🍖'),
  ('白切鸡', '凉菜', 35.00, '🐔'),
  ('凉拌黄瓜', '凉菜', 15.00, '🥒'),
  ('口水鸡', '凉菜', 32.00, '🍗'),
  ('蛋花汤', '汤品', 18.00, '🍲'),
  ('紫菜蛋花汤', '汤品', 20.00, '🥣'),
  ('白米饭', '主食', 3.00, '🍚'),
  ('蛋炒饭', '主食', 15.00, '🍛'),
  ('可乐', '饮品', 8.00, '🥤'),
  ('雪碧', '饮品', 8.00, '🥤')
ON CONFLICT DO NOTHING;

