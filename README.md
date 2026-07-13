# Video Hub - 视频上传与观看系统

基于 GitHub 仓库的纯前端视频管理系统，无需后端服务器。

## 功能

- **上传端** (`upload.html`)：拖拽上传视频，支持标题和描述
- **观看端** (`view.html`)：网格浏览、搜索、在线播放视频

## 部署步骤

### 1. 创建 GitHub 仓库

在 GitHub 上新建一个仓库（建议设为 **Private**），例如 `my-videos`。

### 2. 创建 Personal Access Token

1. 打开 [GitHub Token 设置页](https://github.com/settings/tokens)
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限（完整仓库访问）
4. 生成后复制 token（以 `ghp_` 开头）

### 3. 推送代码到 GitHub

```bash
git init
git add upload.html view.html README.md
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 4. 启用 GitHub Pages

1. 进入仓库 → **Settings** → **Pages**
2. Source 选择 **Deploy from a branch**
3. Branch 选择 `main`，目录选 `/ (root)`
4. 保存后等待部署完成

### 5. 访问

部署完成后，访问：
- 上传端：`https://你的用户名.github.io/你的仓库名/upload.html`
- 观看端：`https://你的用户名.github.io/你的仓库名/view.html`

## 使用说明

1. 打开页面后，填入 GitHub 用户名、仓库名和 Token
2. 点击「连接验证」
3. 配置信息会保存在浏览器本地，下次无需重新输入

## 注意事项

- 单个视频文件不能超过 **100MB**（GitHub API 限制）
- 仓库总容量建议不超过 **1GB**
- Token 仅存储在浏览器 localStorage 中，不会发送到第三方
- 建议使用私有仓库保护视频内容
- 视频格式支持取决于浏览器，推荐 MP4 (H.264)
