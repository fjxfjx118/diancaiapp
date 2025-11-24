/**
 * 菜品图片映射表
 * 每个 image_key 对应一个被打包的本地图像文件。
 * 使用方式：
 * 1. 将图片放入 `src/assets/dishes/` 目录（建议使用 .jpg/.png/.svg）
 * 2. 在下方通过 import 引入图片
 * 3. 在 `dishImages` 中为对应的 `image_key` 赋值
 */

import placeholder from '../assets/dishes/placeholder.svg';

// 示例：当你新增图片时请取消注释并替换路径
import 凉拌鸡丝 from '../assets/dishes/凉拌鸡丝.jpg';
import 水煮肉片 from '../assets/dishes/水煮肉片.jpg';
import 白菜豆腐 from '../assets/dishes/白菜豆腐.jpg';
import 韭菜鸡蛋 from '../assets/dishes/韭菜鸡蛋.jpg';
import 蛋炒饭 from '../assets/dishes/蛋炒饭.jpg';
import 紫菜清汤面 from '../assets/dishes/紫菜清汤面.jpg';
const dishImages = {
  // 'gongbao-chicken': gongbaoChicken,
  // 如果暂未提供自定义图片，可以保持占位图
  '凉拌鸡丝': 凉拌鸡丝,
  '水煮肉片': 水煮肉片,
  '白菜豆腐': 白菜豆腐,
  '韭菜鸡蛋': 韭菜鸡蛋,
  '蛋炒饭': 蛋炒饭,
  '紫菜清汤面': 紫菜清汤面,
};

export const getDishImage = (imageKey) => {
  if (!imageKey) {
    return null;
  }

  return dishImages[imageKey] || null;
};

export default dishImages;


