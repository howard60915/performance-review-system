# Employee Performance Review System

一個基於 NestJS 的員工績效評估系統。

## 功能特點

- 員工管理（CRUD 操作）
- 使用者認證（JWT）
- 角色基礎存取控制（RBAC）
- 績效評估管理
- MongoDB 數據存儲

## 技術棧

- Node.js 18.x.x LTS
- NestJS 框架
- MongoDB
- Docker & Docker Compose
- TypeScript
- JWT 認證

## 快速開始

### 前置需求

- Docker
- Docker Compose
- Node.js 18.x.x LTS (本地開發用)

### 安裝步驟

1. 克隆專案：
```bash
git clone <repository-url>
cd performance-review-system
```

2. 設置環境變數：
```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env 檔案
# 設置必要的環境變數，例如：
# MONGODB_URI=mongodb://mongodb:27017/performance-review
# JWT_SECRET=your_jwt_secret
```

3. 使用 Docker Compose 啟動服務：

```bash
# 開發環境
docker-compose -f docker-compose.dev.yml up -d

# 生產環境
docker-compose up -d
```

服務將在以下網址運行：
- API: http://localhost:3000
- MongoDB: mongodb://localhost:27017
- Mongo Express (開發環境): http://localhost:8081

## API 使用範例

### 1. 註冊新員工

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "department": "Engineering",
    "position": "Software Engineer"
  }'
```

### 2. 登入

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

成功登入後，你會收到一個 JWT token，請保存這個 token 用於後續的 API 請求。

### 3. 查看所有員工（需要管理員權限）

```bash
curl -X GET http://localhost:3000/employees \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 開發指令

```bash
# 啟動開發環境
npm run docker:dev

# 停止開發環境
npm run docker:down:dev

# 查看日誌
npm run docker:logs

# 啟動生產環境
npm run docker:prod

# 停止生產環境
npm run docker:down
```

## 目錄結構

```
performance-review/
├── src/
│   ├── auth/           # 認證相關模組
│   ├── employees/      # 員工管理模組
│   ├── reviews/        # 績效評估模組
│   ├── feedback/       # 評估反饋模組
│   └── common/         # 共用元件
├── test/               # 測試檔案
├── docker/             # Docker 相關配置
└── docs/              # 文檔
```

## 資料庫設計

### Employee Collection
```typescript
{
  email: string;        // 員工郵箱
  password: string;     // 加密後的密碼
  firstName: string;    // 名
  lastName: string;     // 姓
  role: enum;          // 角色（admin/employee）
  department: string;   // 部門
  position: string;     // 職位
}
```

### Review Collection
```typescript
{
  employeeId: ObjectId;  // 被評估員工
  reviewerIds: ObjectId[]; // 評估者列表
  period: string;        // 評估期間
  status: enum;         // 狀態
  dueDate: Date;        // 截止日期
}
```

## 環境變數說明

```env
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/performance-review
JWT_SECRET=your_jwt_secret
```

## 開發注意事項

1. 請確保在開發時遵循 TypeScript 的類型定義
2. 提交程式碼前請執行單元測試
3. 遵循 NestJS 的最佳實踐
4. 使用 prettier 和 eslint 保持程式碼風格一致

## 故障排除

1. 如果 MongoDB 連接失敗：
   - 確認 MongoDB 容器是否正在運行
   - 檢查 MONGODB_URI 環境變數是否正確

2. 如果 JWT 認證失敗：
   - 確認 JWT_SECRET 環境變數是否正確設置
   - 檢查 token 是否過期
   - 確認 Authorization header 格式是否正確

3. 如果 Docker 構建失敗：
   - 清理 Docker 緩存：`docker system prune`
   - 重新構建容器：`docker-compose build --no-cache`
