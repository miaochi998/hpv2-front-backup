#!/bin/bash

# 停止现有服务
echo "正在停止现有服务..."
npm run pm2:stop

# 拉取最新代码
echo "正在拉取最新代码..."
git pull

# 安装依赖
echo "正在安装依赖..."
npm install

# 构建项目
echo "正在构建项目..."
npm run build

# 启动生产服务
echo "正在启动生产服务..."
npm run pm2:prod

# 查看服务状态
echo "服务状态:"
npm run pm2:status

echo "部署完成!" 