// 使用 Tesseract.js 进行 OCR
async function performOCR(imageUrl) {
  const worker = await Tesseract.createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const result = await worker.recognize(imageUrl);
  await worker.terminate();
  return result.data.text;
}

// 使用 AI API 进行翻译
async function translateText(text, targetLang) {
  const response = await chrome.runtime.sendMessage({
    action: "translate",
    text: text,
    targetLang: targetLang
  });
  return response.translatedText;
}

// 将翻译后的文本覆盖到图像上
function overlayTranslatedText(image, translatedText) {
  // 创建一个新的 canvas 元素
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 设置 canvas 大小与图像相同
  canvas.width = image.width;
  canvas.height = image.height;

  // 在 canvas 上绘制原始图像
  ctx.drawImage(image, 0, 0);

  // 设置文本样式
  ctx.font = '16px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;

  // 将翻译后的文本绘制到 canvas 上
  const lines = translatedText.split('\n');
  lines.forEach((line, index) => {
    const y = 20 + (index * 20); // 调整文本位置
    ctx.strokeText(line, 10, y);
    ctx.fillText(line, 10, y);
  });

  // 将 canvas 转换为图像 URL
  return canvas.toDataURL();
}

// 主要翻译函数
async function translateImage(targetLang) {
  const images = document.querySelectorAll('img');
  for (const image of images) {
    const text = await performOCR(image.src);
    const translatedText = await translateText(text, targetLang);
    const translatedImageUrl = overlayTranslatedText(image, translatedText);
    image.src = translatedImageUrl;
  }
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    translateImage(request.targetLang);
  } else if (request.action === "reset") {
    location.reload();
  }
});
