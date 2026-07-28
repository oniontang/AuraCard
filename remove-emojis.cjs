const fs = require('fs');

let content = fs.readFileSync('src/views/ImageCardsPage.vue', 'utf8');

// Replace specific strings
const replacements = {
  // Styles
  "emoji: '🌸',": "",
  "emoji: '🌿',": "",
  "emoji: '📝',": "",
  "emoji: '🎞️',": "",
  "emoji: '⬜',": "",
  '<span class="style-emoji">{{ s.emoji }}</span>': '',

  // Layouts
  "icon: '◻️',": "",
  "icon: '▣',": "",
  "icon: '▤',": "",
  '<span class="layout-icon">{{ l.icon }}</span>': '',

  // Template tags
  '<span class="title-icon">✨</span>': '',
  '<span class="label-icon">📝</span>': '',
  '<span class="label-icon">🎯</span>': '',
  '<span class="label-icon">🎨</span>': '',
  '<span class="label-icon">📐</span>': '',
  '<span class="btn-icon">🚀</span>': '',
  '<div class="empty-icon">📸</div>': '',
  '<span class="tag">🎨 多种风格</span>': '<span class="tag">多种风格</span>',
  '<span class="tag">📱 竖版适配</span>': '<span class="tag">竖版适配</span>',
  '<span class="tag">⬇️ 一键下载</span>': '<span class="tag">一键下载</span>',
  
  // States
  '<span class="pending-icon">⏳</span>': '',
  '<span class="error-icon">❌</span>': '',

  // Action buttons
  '<span>⬇️</span>': '',
  '<span>📤</span>': '',
  '<span>☑️</span> ': '',
  '<span>📦</span> ': '',
  '<span>⬇️</span> 单张下载': '单张下载',
  '<span>🔄</span> ': '',
  '<span>🗑️</span> ': '',

  // Messages
  "analyzeMessage.value = '✨ 正在分析内容，构思卡片结构...'": "analyzeMessage.value = '正在分析内容，构思卡片结构...'",
  "analyzeMessage.value = `📝 已生成 ${generatedCards.value.length} 张卡片大纲，开始生成图片...`": "analyzeMessage.value = `已生成 ${generatedCards.value.length} 张卡片大纲，开始生成图片...`",
  "analyzeMessage.value = '⏹️ 已请求停止，当前任务完成后将中止'": "analyzeMessage.value = '已请求停止，当前任务完成后将中止'",
  "analyzeMessage.value = isCancelRequested.value\n    ? `⏹️ 已停止。本次成功 ${successCount}/${generatedCards.value.length} 张卡片`\n    : `🎉 生成完成！成功 ${successCount}/${generatedCards.value.length} 张卡片`": "analyzeMessage.value = isCancelRequested.value\n    ? `已停止。本次成功 ${successCount}/${generatedCards.value.length} 张卡片`\n    : `生成完成！成功 ${successCount}/${generatedCards.value.length} 张卡片`",
  "analyzeMessage.value = isCancelRequested.value\n    ? `⏹️ 已停止。本次成功 ${successCount}/${generatedCards.value.length} 张卡片`\n    : `🎉 重试完成！成功 ${successCount}/${generatedCards.value.length} 张卡片`": "analyzeMessage.value = isCancelRequested.value\n    ? `已停止。本次成功 ${successCount}/${generatedCards.value.length} 张卡片`\n    : `重试完成！成功 ${successCount}/${generatedCards.value.length} 张卡片`",
  "analyzeMessage.value = `🎉 完成！成功 ${successCount}/${generatedCards.value.length} 张卡片`": "analyzeMessage.value = `完成！成功 ${successCount}/${generatedCards.value.length} 张卡片`",
  "analyzeMessage.value = err instanceof Error ? `❌ 打包失败：${err.message}` : '❌ 打包失败'": "analyzeMessage.value = err instanceof Error ? `打包失败：${err.message}` : '打包失败'",
  "analyzeMessage.value = '📋 图片链接已复制到剪贴板'": "analyzeMessage.value = '图片链接已复制到剪贴板'",

  // Template Progress
  "{{ generatePhase === 'analyzing' ? '📝 正在分析内容' : generatePhase === 'generating' ? `🎨 正在生成图片 (${currentGeneratingIndex + 1}/${generatedCards.length})` : '✨ 生成完成' }}": "{{ generatePhase === 'analyzing' ? '正在分析内容' : generatePhase === 'generating' ? `正在生成图片 (${currentGeneratingIndex + 1}/${generatedCards.length})` : '生成完成' }}",
  '<span class="meta-item">✅ {{ completedCount }}</span>': '<span class="meta-item">成功: {{ completedCount }}</span>',
  '<span class="meta-item">⏳ {{ runningCount }}</span>': '<span class="meta-item">生成中: {{ runningCount }}</span>',
  '<span class="meta-item">❌ {{ failedCount }}</span>': '<span class="meta-item">失败: {{ failedCount }}</span>',

  // Buttons text
  '⏹️ 停止生成': '停止生成'
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}

fs.writeFileSync('src/views/ImageCardsPage.vue', content, 'utf8');
console.log('Emojis removed');