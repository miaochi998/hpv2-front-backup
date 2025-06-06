# 帮你品牌货盘管理系统 - 前端开发计划与日志文档

## 项目概览

**项目名称**：帮你品牌货盘管理系统前端
**项目代号**：hpv2-front
**项目路径**：/www/wwwroot/hpv2-front
**开发访问地址**：http://192.168.2.9:6017
**生产访问地址**：http://hpfront.bonnei.com:6015
**后端接口**：http://192.168.2.9:6016/api (开发环境)，https://hpapi.bonnei.com:6016/api (生产环境)

## 环境配置信息

### 服务器配置

- **系统**：Linux (webserver)
- **项目根目录**：/www/wwwroot
- **前端目录**：/www/wwwroot/hpv2-front
- **后端目录**：/www/wwwroot/hpv2-hou

### 前端环境

- **框架**：React 19 + Vite 6
- **UI库**：Ant Design 5
- **状态管理**：Redux Toolkit
- **开发端口**：6017 (PM2进程)
- **生产端口**：6015 (Nginx配置)
- **PM2进程名**：hpv2-front-dev (开发环境)
- **Nginx配置**：使用HTTP协议（非HTTPS）

### 后端环境

- **框架**：Express.js
- **数据库**：PostgreSQL
- **端口**：6016
- **PM2进程名**：hpv2-hou

### 访问方式

1. **后端API访问**：
   - 开发环境：http://192.168.2.9:6016/api
   - 本地访问：http://localhost:6016/api 或 http://127.0.0.1:6016/api
   - 生产环境：https://hpapi.bonnei.com:6016/api

2. **前端访问**：
   - 开发环境：http://192.168.2.9:6017
   - 生产环境：http://hpfront.bonnei.com:6015

3. **管理员账户**：
   - 用户名：admin
   - 密码：654321

## 版本管理与备份机制

### Git仓库信息

- **本地Git仓库**：/www/wwwroot/hpv2-front/.git
- **远程仓库URL**：git@github.com:miaochi998/hpv2-front-backup.git
- **主分支**：master
- **备份脚本**：/www/wwwroot/hpv2-front/backup.sh

### 备份操作指南

#### 1. 执行备份

执行备份脚本，会自动将所有更改提交到本地Git仓库并推送到远程GitHub仓库：

```bash
cd /www/wwwroot/hpv2-front
./backup.sh
```

备份脚本会执行以下操作：
- 添加所有文件到Git暂存区
- 创建一个带有时间戳的提交
- 推送到远程GitHub仓库

#### 2. 手动备份特定文件

如果只想备份特定的文件或目录，可以使用以下命令：

```bash
cd /www/wwwroot/hpv2-front
git add path/to/file-or-directory
git commit -m "备份说明"
git push origin master
```

#### 3. 查看备份状态和历史

查看当前工作区状态：
```bash
cd /www/wwwroot/hpv2-front
git status
```

查看提交历史：
```bash
cd /www/wwwroot/hpv2-front
git log
```

#### 4. 恢复到之前的版本

查看历史版本：
```bash
cd /www/wwwroot/hpv2-front
git log --oneline
```

临时查看特定版本：
```bash
git checkout <commit-id>
```

恢复到特定版本：
```bash
git checkout master
git reset --hard <commit-id>
git push -f origin master  # 强制推送，谨慎使用
```

### 备份注意事项

1. **定期备份**：在完成重要功能或进行重大修改后执行备份
2. **提交信息**：使用有意义的提交信息，便于日后查找
3. **避免大文件**：保持 .gitignore 文件更新，避免提交node_modules等大型目录
4. **保护Git目录**：不要删除.git目录，防止丢失版本历史

## PM2进程管理

### 前端PM2进程管理

```bash
# 查看所有PM2进程
pm2 list

# 启动前端开发环境
cd /www/wwwroot/hpv2-front
npm run pm2:dev  # 或使用: pm2 start ecosystem.config.cjs --only hpv2-front-dev

# 启动前端生产环境
cd /www/wwwroot/hpv2-front
npm run pm2:prod  # 或使用: pm2 start ecosystem.config.cjs --only hpv2-front-prod

# 停止前端PM2进程
npm run pm2:stop  # 或使用: pm2 stop ecosystem.config.cjs

# 重启前端PM2进程
npm run pm2:restart  # 或使用: pm2 restart ecosystem.config.cjs

# 删除前端PM2进程
npm run pm2:delete  # 或使用: pm2 delete ecosystem.config.cjs

# 查看前端PM2日志
npm run pm2:logs  # 或使用: pm2 logs hpv2-front-dev
```

### 后端PM2进程管理

```bash
# 启动后端PM2进程
cd /www/wwwroot/hpv2-hou
pm2 start src/app.js --name hpv2-hou

# 停止后端PM2进程
pm2 stop hpv2-hou

# 重启后端PM2进程
pm2 restart hpv2-hou

# 查看后端PM2日志
pm2 logs hpv2-hou
```

## Nginx配置

Nginx配置已经完成，用于生产环境访问：

- **域名**：hpfront.bonnei.com
- **端口**：6015
- **协议**：HTTP（不使用SSL）
- **根目录**：/www/wwwroot/hpv2-front/dist
- **配置文件**：/www/server/panel/vhost/nginx/html_hpfront.bonnei.com.conf
- **配置特点**：
  - 添加了SPA路由重写支持：`try_files $uri $uri/ /index.html;`
  - 静态资源缓存配置
  - 完整的错误日志配置

注意：前端开发服务运行在6017端口，Nginx代理服务运行在6015端口。在开发过程中，直接访问6017端口进行开发和测试。

## 开发计划

本文档基于前端独立开发实施方案，详细规划前端开发流程，记录开发进度、问题及解决方案。

### 一、初始阶段（计划时间：2周）

#### 第1周：环境搭建与核心框架

| 任务 | 说明 | 状态 | 完成日期 | 备注 |
|------|------|------|----------|------|
| 1. 创建项目基础结构 | 使用Vite创建React项目，搭建目录结构 | 已完成 | 2025-04-23 | 按照实施方案2.1-2.6小节进行 |
| 2. 环境配置 | 配置开发/生产环境，ESLint，Prettier | 已完成 | 2025-04-23 | 创建.env文件，配置vite.config.js |
| 3. 安装依赖 | 安装核心库：React Router，Ant Design，Redux等 | 已完成 | 2025-04-23 | 参考实施方案2.2小节 |
| 4. 配置Git仓库 | 初始化Git仓库并提交基础代码 | 已完成 | 2025-04-23 | 关联GitHub仓库 |
| 5. API请求封装 | 封装axios请求工具，统一处理请求/响应 | 已完成 | 2025-04-23 | 实现request.js工具 |
| 6. 路由配置 | 配置基本路由结构 | 已完成 | 2025-04-23 | 实现懒加载路由方案 |
| 7. 状态管理 | 实现Redux Store和认证Slice | 已完成 | 2025-04-23 | 完成auth相关状态管理 |

#### 第2周：基础组件实现

| 任务 | 说明 | 状态 | 完成日期 | 备注 |
|------|------|------|----------|------|
| 1. 布局组件 | 实现MainLayout组件 | 已完成 | 2025-04-24 | 包含顶部导航栏和侧边菜单，响应式设计 |
| 2. 权限验证 | 实现PrivateRoute组件 | 已完成 | 2025-04-24 | 基于用户角色的权限控制系统 |
| 3. 登录页面 | 实现登录表单和认证流程 | 已完成 | 2025-04-24 | 包含表单验证、记住用户名和错误处理 |
| 4. 仪表盘页面 | 实现Dashboard页面 | 已完成 | 2025-04-24 | 管理员和销售员仪表盘，含数据概览和个人信息 |
| 5. 通用表格组件 | 封装通用的数据表格组件 | 未开始 | - | 支持排序、筛选、分页等 |
| 6. 通用表单组件 | 封装通用的表单组件 | 未开始 | - | 支持验证、提交、重置等 |
| 7. 响应式Hook | 实现useResponsive自定义Hook | 未开始 | - | 用于响应式布局适配 |

### 二、功能开发阶段（计划时间：6周）

#### 第3-4周：管理员功能

| 任务 | 说明 | 状态 | 完成日期 | 备注 |
|------|------|------|----------|------|
| 1. 品牌管理 | 实现品牌列表、新增、编辑、删除功能 | 已完成 | 2025-04-26 | 管理员专属功能，实现品牌卡片式布局，支持状态切换 |
| 2. 用户管理 | 实现用户列表、新增、编辑、删除功能 | 已完成 | 2025-04-28 | 已实现用户CRUD、状态管理、批量重置密码等功能 |
| 3. 管理员用户管理 | 实现管理员用户列表、新增、编辑、删除功能 | 已完成 | 2025-04-28 | 已实现管理员用户CRUD、状态管理、批量重置密码等功能 |
| 4. 公司货盘管理 | 实现公司货盘列表、详情、编辑功能 | 未开始 | - | 所有产品的管理 |

#### 第5-6周：销售员功能

| 任务 | 说明 | 状态 | 完成日期 | 备注 |
|------|------|------|----------|------|
| 1. 个人信息管理 | 实现个人资料查看和编辑 | 已完成 | - | 包含密码修改 |
| 2. 我的货盘列表 | 实现销售员自己的货盘列表 | 未开始 | - | 带筛选和排序功能 |
| 3. 货盘详情 | 实现货盘详情页面 | 未开始 | - | 包含完整信息展示 |
| 4. 货盘编辑 | 实现货盘添加和编辑功能 | 未开始 | - | 带图片上传功能 |
| 5. 销售数据分析 | 实现销售员的数据分析页面 | 未开始 | - | 个人业绩展示 |

#### 第7-8周：复杂功能实现

| 任务 | 说明 | 状态 | 完成日期 | 备注 |
|------|------|------|----------|------|
| 1. 文件上传组件 | 实现文件/图片上传组件 | 未开始 | - | 支持预览、裁剪等 |
| 2. 高级筛选 | 实现复杂条件的高级筛选功能 | 未开始 | - | 包含组合条件查询 |
| 3. 数据导入导出 | 实现Excel数据导入导出功能 | 未开始 | - | 批量操作数据 |
| 4. 消息通知 | 实现系统消息和通知功能 | 未开始 | - | 包含未读标记等 |
| 5. 操作日志 | 实现系统操作日志记录和查看 | 未开始 | - | 审计跟踪功能 |

### 三、优化阶段（计划时间：2周）

#### 第9-10周：性能优化与测试

| 任务 | 说明 | 状态 | 完成日期 | 备注 |
|------|------|------|----------|------|
| 1. 性能优化 | 代码分割、组件优化、缓存策略 | 未开始 | - | 提升加载速度和响应性 |
| 2. 浏览器兼容性 | 测试主流浏览器兼容性并修复问题 | 未开始 | - | 支持Chrome、Firefox、Edge等 |
| 3. 错误处理 | 完善全局错误处理和边界情况 | 未开始 | - | 实现错误边界和优雅降级 |
| 4. 代码审查 | 全面代码审查和重构 | 未开始 | - | 提高代码质量 |
| 5. 自动化测试 | 编写单元测试和集成测试 | 未开始 | - | 使用Jest和React Testing Library |
| 6. 安全审查 | 前端安全审查和漏洞修复 | 未开始 | - | 防止XSS、CSRF等安全问题 |

### 四、移动适配阶段（计划时间：2-3周）

#### 第11-13周：移动端适配

| 任务 | 说明 | 状态 | 完成日期 | 备注 |
|------|------|------|----------|------|
| 1. 移动端布局调整 | 调整UI适配小屏幕设备 | 未开始 | - | 使用响应式设计 |
| 2. 触控体验优化 | 优化移动端触控操作体验 | 未开始 | - | 增大点击区域、添加手势操作 |
| 3. 移动端特有功能 | 实现移动端特有功能 | 未开始 | - | 如扫码、拍照等 |
| 4. 离线功能 | 实现部分离线功能支持 | 未开始 | - | 使用Service Worker和本地存储 |
| 5. 跨设备测试 | 在多种移动设备上测试 | 未开始 | - | 包括iOS和Android设备 |

## 版本发布计划

### V1.0.0 基础版（预计第8周末）
- 完成基本管理员和销售员功能
- 包含货盘管理核心功能
- 仅支持PC端

### V1.1.0 优化版（预计第10周末）
- 性能和用户体验优化
- 修复已知问题
- 增加高级筛选和数据导出功能

### V2.0.0 移动版（预计第13周末）
- 完整移动端适配
- 移动端特有功能
- 跨平台一致体验

## 技术栈

- **框架**：React 18
- **构建工具**：Vite
- **UI组件库**：Ant Design
- **状态管理**：Redux Toolkit
- **路由**：React Router
- **HTTP请求**：Axios
- **表单处理**：Formik + Yup
- **样式处理**：Less
- **工具库**：Day.js, Lodash
- **代码规范**：ESLint + Prettier

## 开发日志

### 2025-04-23：项目初始化

1. **环境搭建**
   - 使用Vite创建React项目
   - 配置ESLint和Prettier
   - 安装核心依赖：React Router DOM、Ant Design、Redux Toolkit等

2. **项目结构**
   - 规划并创建基础目录结构
   - 实现API请求封装
   - 配置路由系统

3. **问题与解决**
   - 问题：Vite开发服务器代理配置不生效
   - 解决：正确配置vite.config.js中的server.proxy选项，确保路径匹配正确

### 2025-04-24：核心组件实现

1. **布局与认证**
   - 实现MainLayout组件，包含响应式导航
   - 完成权限路由控制
   - 实现登录表单和认证流程

2. **仪表盘页面**
   - 实现管理员和销售员的仪表盘视图
   - 添加快速访问卡片

3. **问题与解决**
   - 问题：菜单权限控制复杂
   - 解决：实现基于用户角色的菜单过滤函数

### 2025-04-26：品牌管理功能

1. **品牌列表**
   - 实现品牌卡片式列表
   - 添加状态筛选功能
   - 实现品牌搜索功能

2. **品牌操作**
   - 完成品牌新增、编辑和删除功能
   - 实现品牌状态切换

3. **问题与解决**
   - 问题：图片上传预览不显示
   - 解决：修改File对象处理方式，使用URL.createObjectURL生成预览

### 2025-04-28：用户管理与管理员管理功能

1. **用户管理**
   - 实现用户列表查询、分页、搜索功能
   - 完成用户新增、编辑功能（用户名不可修改，仅可修改密码）
   - 实现用户状态切换、删除功能
   - 添加批量重置密码功能

2. **管理员管理**
   - 实现管理员用户列表查询、分页、搜索功能
   - 完成管理员用户新增、编辑功能（用户名不可修改，仅可修改密码）
   - 实现管理员状态切换、删除功能
   - 添加批量重置密码功能
   - 实现当前登录管理员不可被删除或禁用的限制

3. **问题与解决**
   - 问题：用户名可被修改导致系统安全隐患
   - 解决：移除用户名修改功能，将用户名输入框设为禁用状态
   - 问题：批量操作未考虑当前登录用户
   - 解决：管理员管理页面中添加判断，当前登录用户不可被选中进行批量操作

4. **用户体验优化**
   - 优化表单验证提示
   - 添加操作成功/失败的消息提示
   - 优化表格响应式布局

5. **功能测试**
   - 测试地址：
     - 用户管理：http://192.168.2.9:6017/protected/admin/users
     - 管理员管理：http://192.168.2.9:6017/protected/admin/admins
   - 全部功能测试通过，包括：
     - 列表查询、搜索、状态筛选
     - 用户/管理员新增
     - 用户/管理员编辑（密码修改）
     - 用户/管理员状态切换
     - 用户/管理员删除
     - 批量重置密码

## 使用指南

### 用户管理功能使用指南

1. **访问路径**：登录后，点击左侧菜单"系统管理"→"用户管理"

2. **功能说明**：
   - 查看系统中所有普通用户
   - 新增、编辑、删除用户
   - 启用/禁用用户状态
   - 批量重置用户密码

3. **操作流程**：
   - **添加用户**：点击右上角"添加用户"按钮，填写用户名和密码
   - **编辑用户**：点击操作列中的"编辑"按钮，可修改用户密码（用户名不可修改）
   - **删除用户**：点击操作列中的"删除"按钮，确认后永久删除
   - **状态管理**：切换状态列中的开关，可启用或禁用用户
   - **批量重置密码**：勾选用户，点击"批量重置密码"按钮，所选用户密码将重置为默认密码123456

4. **注意事项**：
   - 用户名一旦创建不可修改，请谨慎设置
   - 禁用状态的用户无法登录系统
   - 删除操作不可恢复，请谨慎操作

### 管理员管理功能使用指南

1. **访问路径**：登录后，点击左侧菜单"系统管理"→"管理员管理"

2. **功能说明**：
   - 查看系统中所有管理员用户
   - 新增、编辑、删除管理员
   - 启用/禁用管理员状态
   - 批量重置管理员密码

3. **操作流程**：
   - **添加管理员**：点击右上角"添加管理员"按钮，填写用户名和密码
   - **编辑管理员**：点击操作列中的"编辑"按钮，可修改管理员密码（用户名不可修改）
   - **删除管理员**：点击操作列中的"删除"按钮，确认后永久删除
   - **状态管理**：切换状态列中的开关，可启用或禁用管理员
   - **批量重置密码**：勾选管理员，点击"批量重置密码"按钮，所选管理员密码将重置为默认密码123456

4. **安全限制**：
   - 当前登录的管理员不能被删除
   - 当前登录的管理员不能被禁用
   - 当前登录的管理员不能被选中进行批量操作
   - 管理员用户名一旦创建不可修改

## 问题记录与解决方案

| 日期 | 问题描述 | 解决方案 | 状态 |
|------|----------|----------|------|
| 2025-04-24 | 登录页面"一闪而过"，登录失败时错误处理不完善 | 重构登录组件，优化路由和状态管理逻辑 | 已解决 |
| 2025-04-24 | 仪表盘页面头像无法显示，浏览器报CORS错误 | 修改后端静态资源中间件CORS配置，前端组件添加crossOrigin属性 | 已解决 |
| 2025-04-25 | 生产环境图片资源跨域加载失败，报错NotSameOrigin | 实现集中式URL管理，添加Nginx代理，配置后端CORS头部 | 已解决 |
| 2025-04-25 | 开发环境编辑品牌时图片404错误 | 修改URL生成逻辑，使用环境变量，始终返回完整URL | 已解决 |

## 周报

### 第1周周报（日期范围）

**完成工作**：
- 待记录

**存在问题**：
- 待记录

**下周计划**：
- 待记录

## 团队协作

### 代码规范

遵循前端实施方案中7.1-7.3小节的命名规范和代码风格：

- **组件文件**：使用PascalCase（大驼峰），如`ProductTable.jsx`
- **非组件文件**：使用camelCase（小驼峰），如`request.js`
- **CSS类名**：使用kebab-case或BEM命名法
- **常量**：使用UPPER_SNAKE_CASE
- **变量和函数**：使用camelCase
- **布尔变量**：使用`is`/`has`前缀

### Git工作流

**分支管理**：
- `main`：主分支，与生产环境对应
- `develop`：开发分支，开发完成的功能合并到此
- `feature/*`：功能分支，如`feature/login-page`
- `hotfix/*`：紧急修复分支

**提交规范**：
- `feat:`：新功能
- `fix:`：修复Bug
- `docs:`：文档变更
- `style:`：代码风格调整
- `refactor:`：代码重构
- `perf:`：性能优化
- `test:`：添加测试
- `chore:`：构建过程或辅助工具变更

### 代码审查

每个功能完成后，需要：
1. 自我代码审查
2. 提交Pull Request
3. 通过审查后合并到develop分支

## 附录

### 相关资源

- 前端实施方案文档：`/www/wwwroot/hpv2-hou/Docs/UI/frontend/frontend_implementation_plan.md`
- 后端API文档：待补充
- UI设计稿：待补充
- GitHub仓库：https://github.com/miaochi998/hpfront.git

### 常用命令

```bash
# 启动开发服务器（普通方式）
npm run dev

# 启动开发服务器（PM2方式）
npm run pm2:dev

# 停止PM2管理的服务
npm run pm2:stop

# 删除PM2管理的服务
npm run pm2:delete

# 重启PM2管理的服务
npm run pm2:restart

# 查看PM2管理的服务状态
npm run pm2:status

# 查看PM2日志
npm run pm2:logs
```

## 部署流程

### 开发环境部署

1. 启动开发服务器（使用PM2管理）:
   ```bash
   npm run pm2:dev
   ```

2. 查看服务状态:
   ```bash
   npm run pm2:status
   ```

3. 查看日志:
   ```bash
   npm run pm2:logs
   ```

### 生产环境部署

1. 执行部署脚本:
   ```bash
   npm run deploy
   ```

该脚本将执行以下操作:
- 停止现有服务
- 拉取最新代码
- 安装依赖
- 构建项目
- 启动生产服务

2. 如需手动构建并部署:
   ```bash
   # 构建项目
   npm run build
   
   # 启动生产服务
   npm run pm2:prod
   ```

3. 访问地址:
   - 开发环境: http://192.168.2.9:6016
   - 生产环境: http://hpfront.bonnei.com:6015 

## 开发工作流程与调试方法

### 项目开发流程

1. **需求分析**
   - 详细阅读`hpv2-front/Docs/UI/frontend/frontend_implementation_plan.md`规范文档
   - 确认具体的功能需求和UI规范
   - 与产品/设计进行需求确认

2. **组件开发**
   - 遵循组件目录结构规范
   - 先实现静态UI，再加入交互逻辑
   - 组件内部状态使用`useState`/`useReducer`，跨组件状态使用Redux

3. **API对接**
   - 查阅后端API文档，了解接口格式
   - 使用`src/api`目录下创建对应模块API封装
   - 通过`utils/request.js`统一请求处理

4. **功能测试**
   - 开发环境自测（http://192.168.2.9:6017）
   - 检查各功能点是否符合需求
   - 检查边界条件和错误处理
   - 检查响应式布局和不同设备适配

5. **代码提交**
   - 遵循Git提交规范
   - 编写清晰的提交信息
   - 必要时进行代码审查

6. **部署上线**
   - 执行`npm run build`构建生产代码
   - 测试生产环境
   - 必要时进行回滚准备

### 调试技巧与工具

1. **浏览器开发者工具**
   - Network选项卡：监控API请求和响应
   - Console选项卡：查看日志和错误
   - Elements选项卡：检查DOM结构和样式
   - Application选项卡：检查localStorage和sessionStorage

2. **React开发者工具**
   - 查看组件树结构
   - 检查组件props和state
   - 分析组件渲染性能

3. **Redux开发者工具**
   - 监控状态变化
   - 查看action历史
   - 时间旅行调试

4. **日志调试**
   - 前端使用`console.log`/`console.error`等记录关键信息
   - 后端日志查看：`pm2 logs hpv2-hou`
   - 前端日志查看：`pm2 logs hpv2-front-dev`

5. **常见问题排查方法**
   - **API请求问题**：
     - 检查网络请求状态码和响应内容
     - 验证请求参数和URL是否正确
     - 查看后端日志了解服务器错误
   
   - **页面渲染问题**：
     - 检查组件生命周期和数据加载时机
     - 查看React错误边界捕获的错误
     - 验证条件渲染逻辑
   
   - **样式问题**：
     - 使用Elements面板检查元素样式
     - 验证CSS权重和覆盖关系
     - 测试不同屏幕尺寸的响应

   - **性能问题**：
     - 使用React Profiler分析渲染性能
     - 检查不必要的重渲染
     - 优化大列表渲染（虚拟列表）
     - 查看网络请求响应时间

### 跨域问题解决思路

由于我们的前端和后端分别运行在不同的端口（前端6017，后端6016），经常会遇到跨域问题。解决思路如下：

1. **前端开发环境代理**
   - 在`vite.config.js`中配置了后端API代理:
   ```js
   server: {
     port: 6017,
     host: "0.0.0.0",
     proxy: {
       '/api': {
         target: 'http://localhost:6016',
         changeOrigin: true,
         secure: false
       },
       '/uploads': {
         target: 'http://192.168.2.9:6016',
         changeOrigin: true,
         secure: false
       }
     }
   }
   ```

2. **后端CORS配置**
   - 在`app.js`中配置了CORS允许的前端源:
   ```js
   const allowedOrigins = [
     'http://localhost:6017',
     'http://127.0.0.1:6017',
     'http://192.168.2.9:6017',
     'http://hpfront.bonnei.com:6015'
   ];
   ```

3. **静态资源访问**
   - 对于图片等静态资源，需要确保CORS头部配置正确
   - 针对`/uploads`目录的静态资源访问，我们采用了两种解决方案：
     - **生产环境**：使用Nginx反向代理从同源转发
     - **开发环境**：直接访问完整URL（利用后端的CORS配置）

4. **集中式URL管理**
   - 创建`src/config/urls.js`模块，集中管理所有URL
   - 提供`getApiBaseUrl`和`getImageUrl`等工具函数
   - 优先使用环境变量配置

5. **排查步骤**
   - 查看浏览器控制台网络请求错误
   - 检查请求头和响应头中的CORS相关字段
   - 使用开发者工具网络面板筛选失败的请求
   - 观察请求URL是否正确（特别是端口号）
   - 查看控制台中的`[URL CONFIG]`日志信息

6. **重要经验**
   - 不要混用相对路径和绝对路径
   - 不要过度依赖开发代理功能
   - 通过日志记录请求URL来调试问题
   - 环境变量配置比硬编码更灵活可靠
   - 修改后记得重启服务和清除浏览器缓存

## 环境切换与测试

1. **开发环境与生产环境切换**
   - 开发环境访问：http://192.168.2.9:6017
   - 生产环境访问：http://hpfront.bonnei.com:6015
   - 环境变量控制：通过`.env`文件和`import.meta.env`访问

2. **后端接口环境**
   - 开发环境：http://192.168.2.9:6016/api
   - 生产环境：https://hpapi.bonnei.com:6016/api

3. **本地测试账户**
   - 管理员：admin / 654321
   - 测试销售员账户：seller1 / 123456 

## 技术文档
- [跨域图片加载解决方案](./cross_domain_image_loading_solution.md)
- [表格组件水平滚动与背景边框问题解决方案](./UI/frontend/development/table_horizontal_scroll_fix_guide.md) - 解决表格在水平滚动时背景色和边框线不完整的问题 