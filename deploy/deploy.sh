#!/bin/bash
# card-web 前端一键部署脚本

set -e

echo "🚀 开始部署 card-web 前端..."

# 1. 检查服务器环境
if ! command -v nginx &> /dev/null; then
    echo "📦 安装 Nginx..."
    apt-get update && apt-get install -y nginx
fi

# 2. 创建网站目录
echo "📁 创建网站目录..."
mkdir -p /var/www/card-web

# 3. 上传的文件应该放在这里
# 用户需要先运行 rsync 上传 dist 目录：
# rsync -avz ./dist/ root@YOUR_SERVER:/var/www/card-web/

# 检查 dist 目录是否存在
if [ ! -d "/var/www/card-web/dist" ] || [ ! -f "/var/www/card-web/dist/index.html" ]; then
    echo "⚠️  警告: /var/www/card-web/dist 目录不存在或为空"
    echo "请先运行以下命令上传前端文件："
    echo ""
    echo "  rsync -avz ./dist/ root@YOUR_SERVER:/var/www/card-web/"
    echo ""
    exit 1
fi

# 4. 配置 Nginx
echo "⚙️  配置 Nginx..."
cp /var/www/card-web/nginx-card-web.conf /etc/nginx/sites-available/card-web.conf 2>/dev/null || true

# 如果有自定义域名，取消下面这行的注释并修改
# sed -i 's/YOUR_DOMAIN/your-domain.com/g' /etc/nginx/sites-available/card-web.conf

# 启用站点
ln -sf /etc/nginx/sites-available/card-web.conf /etc/nginx/sites-enabled/card-web.conf

# 禁用默认站点（可选）
rm -f /etc/nginx/sites-enabled/default

# 5. 测试 Nginx 配置
echo "🔍 测试 Nginx 配置..."
nginx -t

# 6. 重载 Nginx
echo "🔄 重载 Nginx..."
systemctl reload nginx
systemctl restart nginx

# 7. 检查状态
if systemctl is-active --quiet nginx; then
    echo "✅ 部署成功！"
    echo ""
    echo "📍 访问地址: http://YOUR_SERVER_IP"
    echo ""
    echo "📝 常用运维命令："
    echo "  查看状态: systemctl status nginx"
    echo "  查看日志: tail -f /var/log/nginx/error.log"
    echo "  重启服务: systemctl restart nginx"
    echo "  更新前端: rsync -avz ./dist/ root@YOUR_SERVER:/var/www/card-web/ && systemctl reload nginx"
else
    echo "❌ 部署失败，请检查 Nginx 配置"
    exit 1
fi
