# 帮你品牌货盘管理系统 - 项目概述

本文档提供项目的关键信息，方便AI助手快速了解项目概况及环境配置。

## 项目信息

项目是一个前后端分离的企业级货盘管理系统，包含以下两个部分：

1. **前端项目（hpv2-front）**
   - 使用React框架开发的SPA应用
   - 采用Ant Design作为UI组件库
   - 使用Redux进行状态管理
   - 基于Vite构建工具

2. **后端项目（hpv2-hou）**
   - 使用Node.js + Express框架
   - REST API设计
   - JWT认证机制
   - PostgreSQL数据库

## 环境配置

### 服务器信息
- **服务器IP**：192.168.2.9
- **系统**：Linux (webserver)
- **Web服务器**：Nginx + PM2

### 前端环境
- **代码目录**：/www/wwwroot/hpv2-front
- **开发端口**：6017 (http://192.168.2.9:6017)
- **生产端口**：6015 (http://hpfront.bonnei.com:6015)
- **PM2进程**：hpv2-front-dev (开发环境)
- **Nginx配置**：/www/server/panel/vhost/nginx/html_hpfront.bonnei.com.conf

### 后端环境
- **代码目录**：/www/wwwroot/hpv2-hou
- **API端口**：6016 (http://192.168.2.9:6016/api)
- **PM2进程**：hpv2-hou

### 测试账户
- **管理员**：admin / 654321

## 快速启动指南


cd /www/wwwroot && bash start-services.sh


### 前端开发
```bash
# 进入前端项目目录
cd /www/wwwroot/hpv2-front

# 启动开发环境
npm run pm2:dev

# 查看日志
pm2 logs hpv2-front-dev
```

### 前端构建与部署
```bash
# 构建生产版本
cd /www/wwwroot/hpv2-front
npm run build

# 重启Nginx使配置生效
systemctl restart nginx
```

### 后端开发
```bash
# 进入后端项目目录
cd /www/wwwroot/hpv2-hou

## PM2管理操作指南：
   【启动项目】
   pm2 start npm --name hpv2-hou -- run start
   【停止项目】
   pm2 stop hpv2-hou
   【重启项目】
   pm2 restart hpv2-hou
   【查看项目状态】
   pm2 list
   【查看实时日志】
   pm2 logs hpv2-hou --lines 100
   【设置开机自启】
   pm2 save
   pm2 startup
   【删除所有名为 hpv2-hou 的进程】
   pm2 delete hpv2-hou

# 确认后端运行状态
pm2 list

# 重启后端服务
pm2 restart hpv2-hou

# 查看日志
pm2 logs hpv2-hou
```

服务器关机或重启后，需要重新启动前端和后端服务。以下是详细的启动步骤：
启动步骤
```
1. 启动后端服务
# 进入后端项目目录
cd /www/wwwroot/hpv2-hou

# 启动后端服务
pm2 start src/app.js --name hpv2-hou

# 确认后端服务状态
pm2 list

2. 启动前端服务
开发环境和生产环境一起启动
# 进入前端项目目录
cd /www/wwwroot/hpv2-front

# 使用配置文件启动所有前端服务
pm2 start ecosystem.config.cjs

# 确认前端服务状态
pm2 list

分别启动开发环境和生产环境
# 进入前端项目目录
cd /www/wwwroot/hpv2-front

# 只启动开发环境
pm2 start ecosystem.config.cjs --only hpv2-front-dev

# 只启动生产环境
pm2 start ecosystem.config.cjs --only hpv2-front-prod

3. 确认服务是否成功启动
# 查看所有PM2进程状态
pm2 list

# 检查开发环境是否可访问
curl -I http://localhost:6017

# 检查生产环境是否可访问
curl -I http://localhost:6015

# 查看日志确认是否有错误
pm2 logs

4. 可选：重启Nginx服务（如果需要）
# 重启Nginx服务
systemctl restart nginx

# 检查Nginx状态
systemctl status nginx

自动化启动（推荐）
您可以创建一个启动脚本，在服务器重启后自动启动所有服务：

# 创建启动脚本
cat > /www/wwwroot/start_services.sh << 'EOF'
#!/bin/bash

# 启动后端服务
cd /www/wwwroot/hpv2-hou
pm2 start src/app.js --name hpv2-hou

# 启动前端服务
cd /www/wwwroot/hpv2-front
pm2 start ecosystem.config.cjs

# 重启Nginx（如需要）
systemctl restart nginx

# 显示服务状态
pm2 list
EOF

# 添加执行权限
chmod +x /www/wwwroot/start_services.sh

然后，您可以将此脚本添加到系统启动项中：
# 编辑crontab
crontab -e

# 添加以下行
@reboot /www/wwwroot/start_services.sh

或者使用PM2的启动保存功能：
# 首先启动所有服务
cd /www/wwwroot/hpv2-hou
pm2 start src/app.js --name hpv2-hou

cd /www/wwwroot/hpv2-front
pm2 start ecosystem.config.cjs

# 保存当前进程列表
pm2 save

# 生成启动脚本
pm2 startup

通过以上步骤，在服务器重启后，所有服务都会自动启动，确保系统持续可用。
```


## 备份机制

### 前端备份系统

前端项目已配置Git版本控制和备份系统，可以将代码变更备份到本地Git仓库和远程GitHub仓库。

#### 备份配置

- **本地Git仓库**：/www/wwwroot/hpv2-front/.git
- **远程仓库URL**：git@github.com:miaochi998/hpv2-front-backup.git
- **备份脚本**：/www/wwwroot/hpv2-front/backup.sh

#### 使用方法

1. **手动执行备份**：
   ```bash
   cd /www/wwwroot/hpv2-front
   ./backup.sh
   ```

2. **查看备份状态**：
   ```bash
   cd /www/wwwroot/hpv2-front
   git status
   ```

3. **查看提交历史**：
   ```bash
   cd /www/wwwroot/hpv2-front
   git log
   ```
   ```bash

   # 简洁查看（如遇乱码请使用替代方案）
   git log --oneline --graph

   # 替代方案（解决终端乱码问题）
   git log --pretty=format:'%h - %an, %ar : %s' | cat

   # 详细查看(按q退出)
   git log -p

   # 按时间筛选（注意日期格式）
   git log --since="2025-04-01" --until="2025-04-15"

   # 图形化查看方案（需安装gitk）
   gitk --all

   # 导出日志到文件
   git log --oneline --graph > log.txt
   ```

4. **手动提交特定更改**：
   ```bash
   cd /www/wwwroot/hpv2-front
   git add [文件或目录]
   git commit -m "你的提交说明"
   git push origin master
   ```

5. **恢复到特定版本**：
   ```bash
   cd /www/wwwroot/hpv2-front
   git log  # 找到要恢复的提交ID
   git checkout [提交ID]  # 临时查看该版本
   
   # 如果确定要恢复:
   git checkout master
   git reset --hard [提交ID]
   git push -f origin master  # 谨慎使用，会覆盖远程仓库
   ```

#### 注意事项

- **不要删除.git目录**：这会导致版本历史丢失
- **备份前停止开发服务**：避免备份不完整的代码
- **定期执行备份**：在重要功能完成后执行备份
- **保持.gitignore更新**：确保不会备份大型依赖或敏感信息

## 项目结构

### 前端目录结构
```
/www/wwwroot/hpv2-front/
├── src/                        # 源代码
│   ├── api/                    # API请求封装
│   ├── assets/                 # 静态资源
│   ├── components/             # 组件库
│   ├── pages/                  # 页面组件
│   ├── router/                 # 路由配置
│   ├── store/                  # Redux状态管理
│   └── utils/                  # 工具函数
├── dist/                       # 构建产物（生产环境部署目录）
├── public/                     # 公共静态资源
├── Docs/                       # 项目文档
├── ecosystem.config.cjs        # PM2配置
├── vite.config.js              # Vite配置
├── backup.sh                   # 备份脚本
├── .git/                       # Git版本控制目录
└── package.json                # 项目依赖
```

### 后端目录结构
```
/www/wwwroot/hpv2-hou/
├── src/                        # 源代码
│   ├── routes/                 # API路由
│   ├── controllers/            # 控制器
│   ├── services/               # 服务层
│   ├── models/                 # 数据模型
│   ├── middlewares/            # 中间件
│   ├── utils/                  # 工具函数
│   └── app.js                  # 应用入口
├── Docs/                       # 项目文档
├── backup.sh                   # 备份脚本
└── package.json                # 项目依赖
```

## API端点

主要API端点：

- **认证**：
  - 登录: POST /api/auth/login
  - 登出: POST /api/auth/logout
  - 获取用户信息: GET /api/auth/profile

- **货盘管理**：
  - 货盘列表: GET /api/pallet/products
  - 货盘详情: GET /api/pallet/products/:id
  - 创建货盘: POST /api/pallet/products
  - 更新货盘: PUT /api/pallet/products/:id
  - 删除货盘: DELETE /api/pallet/products/:id

- **用户管理**：
  - 用户列表: GET /api/auth/users
  - 创建用户: POST /api/auth/users
  - 更新用户: PUT /api/auth/users/:id
  - 删除用户: DELETE /api/auth/users/:id

## 技术栈

### 前端
- React 19
- Ant Design 5
- Redux Toolkit
- React Router 7
- Axios
- Vite 6

### 后端
- Node.js
- Express
- JWT
- PostgreSQL

## 备注
- 前端开发环境使用6017端口(http://192.168.2.9:6017)
- 前端生产环境使用6015端口(http://hpfront.bonnei.com:6015)
- 前端开发使用PM2进程管理，生产环境部署到Nginx
- 开发时修改源码后，需要重新构建并部署到生产环境
- 后端API已经稳定，可以正常使用 