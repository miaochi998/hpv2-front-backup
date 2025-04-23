#!/bin/bash

# 进入前端项目目录
cd /www/wwwroot/hpv2-front

# 添加所有更改到暂存区
git add .

# 提交更改，使用当前时间作为提交信息
git commit -m "Automatic backup - $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到远程仓库（如果已配置）
git push origin master 2>/dev/null || echo "Remote repository not configured or push failed"

echo "Backup completed: $(date '+%Y-%m-%d %H:%M:%S')" 