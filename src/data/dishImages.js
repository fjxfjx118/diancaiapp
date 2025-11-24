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
// import gongbaoChicken from '../assets/dishes/gongbao-chicken.jpg';

const dishImages = {
  // 'gongbao-chicken': gongbaoChicken,
  // 如果暂未提供自定义图片，可以保持占位图
  'gongbao-chicken': placeholder,
  'mapo-tofu': placeholder,
  'sweet-sour-pork': placeholder,
  'white-cut-chicken': placeholder,
  'cucumber-salad': placeholder,
  'mouthwatering-chicken': placeholder,
  'egg-drop-soup': placeholder,
  'seaweed-egg-soup': placeholder,
  'white-rice': placeholder,
  'egg-fried-rice': placeholder,
  'coke': placeholder,
  'sprite': placeholder,
};

export const getDishImage = (imageKey) => {
  if (!imageKey) {
    return null;
  }

  return dishImages[imageKey] || null;
};

export default dishImages;

