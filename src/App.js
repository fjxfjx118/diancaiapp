import React, { useState, useEffect, useRef } from 'react';
import { fetchMenu } from './lib/supabaseClient';
import { submitOrder } from './utils/orderService';
import { getDishImage } from './data/dishImages';

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const menuRefs = useRef({});
  const menuContainerRef = useRef(null);
  const priceLabel = 'Kiss';
  const formatPrice = (value) => {
    const num = parseFloat(value);
    if (Number.isNaN(num)) {
      return priceLabel;
    }
    return `${priceLabel} ${num.toFixed(2)}`;
  };

  // 加载菜单数据
  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await fetchMenu();
      setMenu(data);
      
      // 提取所有分类
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
      
      // 默认选中第一个分类
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }
    } catch (error) {
      console.error('加载菜单失败:', error);
      alert('加载菜单失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  // 添加到购物车
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // 从购物车移除
  const removeFromCart = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    
    if (item && item.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  // 计算总价
  const totalPrice = cart.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity);
  }, 0);

  // 分类跳转
  const scrollToCategory = (category) => {
    setSelectedCategory(category);
    const element = menuRefs.current[category];
    if (element && menuContainerRef.current) {
      const containerTop = menuContainerRef.current.offsetTop;
      const elementTop = element.offsetTop;
      menuContainerRef.current.scrollTo({
        top: elementTop - containerTop - 20,
        behavior: 'smooth'
      });
    }
  };

  // 处理提交订单
  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert('购物车为空，无法提交订单');
      return;
    }

    try {
      setSubmitting(true);
      await submitOrder(cart, note);
      
      // 清空购物车和备注
      setCart([]);
      setNote('');
      setShowCheckout(false);
      
      alert('订单提交成功！微信通知已发送 🎉');
    } catch (error) {
      console.error('提交订单失败:', error);
      alert('提交订单失败：' + (error.message || '请检查网络连接和配置'));
    } finally {
      setSubmitting(false);
    }
  };

  // 按分类分组菜单
  const menuByCategory = categories.reduce((acc, category) => {
    acc[category] = menu.filter(item => item.category === category);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-peach-light">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <div className="text-peach-dark text-lg">加载菜单中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* 顶部标题栏 */}
      <header className="bg-peach text-white px-4 py-4 shadow-md z-10">
        <h1 className="text-xl font-bold text-center">F❤X Baby-Menu</h1>
      </header>

      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 左侧菜单列表 (75%) */}
        <div
          ref={menuContainerRef}
          className="flex-1 overflow-y-auto pb-32"
          style={{ width: '75%' }}
        >
          {categories.map(category => (
            <div
              key={category}
              ref={el => menuRefs.current[category] = el}
              className="mb-6"
            >
              <h2 className="sticky top-0 bg-white px-4 py-3 text-lg font-bold text-gray-800 border-b-2 border-peach z-10">
                {category}
              </h2>
              <div className="px-4">
                {menuByCategory[category]?.map(item => {
                  const imageSrc = getDishImage(item.image_key);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-4 border-b border-gray-100"
                    >
                      <div className="flex items-center flex-1">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-2xl mr-3 border border-peach-light shadow-sm"
                          />
                        ) : (
                          <span className="text-3xl mr-3">{item.icon || '🍽️'}</span>
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{item.name}</div>
                          <div className="text-peach-dark font-bold mt-1">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="ml-4 bg-peach hover:bg-peach-dark text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all active:scale-95"
                      >
                        <span className="text-xl">+</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧分类导航 (25%) */}
        <div
          className="bg-gray-50 overflow-y-auto py-4"
          style={{ width: '25%' }}
        >
          <div className="px-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`w-full text-left px-3 py-3 mb-2 rounded-lg transition-all ${
                  selectedCategory === category
                    ? 'bg-peach text-white shadow-md font-semibold'
                    : 'bg-white text-gray-700 hover:bg-peach-light'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部悬浮购物车条 */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-peach z-20">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <div className="bg-peach text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div>
                <div className="text-gray-600 text-sm">共 {cart.length} 种</div>
                <div className="text-peach-dark font-bold text-lg">
                  {formatPrice(totalPrice)}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="bg-peach hover:bg-peach-dark text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all active:scale-95"
            >
              去结算
            </button>
          </div>
        </div>
      )}

      {/* 结算弹窗 */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-30">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">确认订单</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 text-2xl"
              >
                ×
              </button>
            </div>

            {/* 购物车商品列表 */}
            <div className="mb-4">
              {cart.map(item => {
                const imageSrc = getDishImage(item.image_key);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100"
                  >
                    <div className="flex items-center flex-1">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl mr-3 border border-peach-light"
                        />
                      ) : (
                        <span className="text-2xl mr-3">{item.icon || '🍽️'}</span>
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-gray-500 text-sm">
                          {formatPrice(item.price)} × {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-2"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-peach text-white rounded-full w-8 h-8 flex items-center justify-center ml-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 备注输入 */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">备注</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="有什么特殊要求吗？"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-peach focus:outline-none resize-none"
                rows="3"
              />
            </div>

            {/* 总价 */}
            <div className="flex items-center justify-between mb-4 p-4 bg-peach-light rounded-xl">
              <span className="font-bold text-gray-800">总计</span>
              <span className="text-peach-dark font-bold text-2xl">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* 提交按钮 */}
            <button
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="w-full bg-peach hover:bg-peach-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '确认提交订单 💕'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
