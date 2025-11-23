# 💕 情侣点餐 Web App

一个温馨的情侣点餐应用，支持实时微信通知。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在 Supabase Dashboard 的 SQL Editor 中执行 `supabase_schema.sql` 文件中的 SQL 语句
3. 在 Supabase Dashboard -> Settings -> API 中获取：
   - Project URL
   - anon/public key
4. 编辑 `src/lib/supabaseClient.js`，替换以下配置：
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

### 3. 配置 WxPusher

1. 访问 [WxPusher](https://wxpusher.zjiecode.com) 注册账号
2. 创建应用获取 `appToken`
3. 关注 WxPusher 公众号，获取你的 `UID`
4. 编辑 `src/utils/wxpusher.js`，替换以下配置：
   ```javascript
   const WXPUSHER_CONFIG = {
     appToken: 'REPLACE_WITH_MY_TOKEN',
     uid: 'REPLACE_WITH_MY_UID',
   };
   ```

### 4. 启动项目

```bash
npm start
```

应用将在 `http://localhost:3000` 启动。

## 📱 功能特性

- ✅ 移动端优先设计，iOS 风格界面
- ✅ 蜜桃粉色主题 (#FFD1D1)
- ✅ 左侧菜单列表 + 右侧分类导航
- ✅ 购物车管理（添加/删除商品）
- ✅ 订单提交与数据库存储
- ✅ 实时微信通知（通过 WxPusher）

## 📂 项目结构

```
点菜APP/
├── public/
│   └── index.html          # HTML 入口
├── src/
│   ├── lib/
│   │   └── supabaseClient.js  # Supabase 客户端配置
│   ├── utils/
│   │   ├── wxpusher.js        # WxPusher 通知服务
│   │   └── orderService.js    # 订单提交核心逻辑
│   ├── App.js                 # 主应用组件
│   ├── index.js               # React 入口
│   └── index.css              # 全局样式
├── supabase_schema.sql        # 数据库建表语句
├── package.json
└── tailwind.config.js
```

## 🎨 技术栈

- **前端框架**: React 18
- **样式**: Tailwind CSS
- **后端数据库**: Supabase
- **通知服务**: WxPusher

## 📝 使用说明

1. **浏览菜单**: 左侧显示所有菜品，按分类组织
2. **选择分类**: 点击右侧分类快速跳转到对应位置
3. **添加商品**: 点击菜品旁的 "+" 按钮添加到购物车
4. **查看购物车**: 底部悬浮条显示购物车总价和商品数量
5. **提交订单**: 点击"去结算"，确认订单并添加备注，提交后会自动发送微信通知

## ⚠️ 注意事项

- 确保 Supabase 项目已正确配置 RLS（Row Level Security）策略，允许匿名用户读取菜单和创建订单
- WxPusher 的 `appToken` 和 `uid` 必须正确配置，否则无法接收通知
- 建议在生产环境中使用环境变量管理敏感配置

## 🔒 安全建议

生产环境部署时，建议：
1. 使用环境变量存储 Supabase 和 WxPusher 配置
2. 配置 Supabase RLS 策略限制数据访问
3. 考虑添加订单验证和防重复提交机制

