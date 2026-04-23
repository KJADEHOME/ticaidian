/**
 * 竞彩门店通 - 核心JavaScript
 */

// Toast提示功能
function showToast(message, duration = 2000) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, duration);
  }
}

// 本地存储封装
const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('存储失败:', e);
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.error('读取失败:', e);
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('删除失败:', e);
      return false;
    }
  }
};

// 方案管理
const schemeManager = {
  // 获取所有方案
  getAll() {
    return storage.get('schemes', []);
  },
  
  // 添加方案
  add(scheme) {
    const schemes = this.getAll();
    scheme.id = Date.now().toString();
    scheme.createdAt = new Date().toISOString();
    schemes.unshift(scheme);
    storage.set('schemes', schemes);
    return scheme;
  },
  
  // 删除方案
  remove(id) {
    const schemes = this.getAll().filter(s => s.id !== id);
    storage.set('schemes', schemes);
  },
  
  // 清空方案
  clear() {
    storage.remove('schemes');
  },
  
  // 保存所有方案（用于更新状态）
  save(schemes) {
    storage.set('schemes', schemes);
  }
};

// 号码生成器
const numberGenerator = {
  // 生成大乐透号码 (前区5个1-35，后区2个1-12)
  generateDaLeTou() {
    const front = this.randomUnique(1, 35, 5).sort((a, b) => a - b);
    const back = this.randomUnique(1, 12, 2).sort((a, b) => a - b);
    return { front, back };
  },
  
  // 生成排列三号码 (3个0-9)
  generatePaiLie3() {
    return Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
  },
  
  // 生成排列五号码 (5个0-9)
  generatePaiLie5() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
  },
  
  // 生成不重复随机数
  randomUnique(min, max, count) {
    const numbers = new Set();
    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(numbers);
  }
};

// 分享功能
function shareScheme(scheme) {
  const shareData = {
    title: '竞彩门店通 - 方案分享',
    text: scheme.description || '查看我的彩票方案',
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData);
  } else {
    // 复制到剪贴板
    const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    copyToClipboard(text);
    showToast('已复制到剪贴板');
  }
}

// 复制到剪贴板
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}

// 生成二维码（用于门店核销）
function generateQRCode(data) {
  // 实际项目中使用二维码库，如 qrcode.js
  // 这里返回模拟数据
  return `QR:${btoa(JSON.stringify(data))}`;
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
  // 设置当前导航高亮
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href')?.includes(currentPage)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
});

// 导出全局函数
window.showToast = showToast;
window.shareScheme = shareScheme;
window.copyToClipboard = copyToClipboard;
window.generateQRCode = generateQRCode;
window.schemeManager = schemeManager;
window.numberGenerator = numberGenerator;
window.storage = storage;
