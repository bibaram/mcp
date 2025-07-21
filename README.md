# MySQL MCP Server

MySQL 데이터베이스에 연결할 수 있는 Model Context Protocol (MCP) 서버입니다.

## 기능

- MySQL 데이터베이스 연결
- SQL 쿼리 실행
- 테이블 목록 조회
- 테이블 구조 확인

## 설치

```bash
npm install
```

## 사용법

### 1. 직접 실행

```bash
# 환경 변수 설정
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=your_database

# 서버 시작
npm start
```

### 2. Claude Desktop 설정

Claude Desktop의 설정 파일에 다음과 같이 추가하세요:

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mysql": {
      "command": "node",
      "args": ["path/to/mcp/server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_USER": "root",
        "DB_PASSWORD": "your_password",
        "DB_NAME": "your_database"
      }
    }
  }
}
```

### 3. 여러 데이터베이스 연결

```json
{
  "mcpServers": {
    "mysql-prod": {
      "command": "node",
      "args": ["path/to/mcp/server.js"],
      "env": {
        "DB_HOST": "prod-server.com",
        "DB_USER": "prod_user",
        "DB_PASSWORD": "prod_password",
        "DB_NAME": "production_db"
      }
    },
    "mysql-dev": {
      "command": "node",
      "args": ["path/to/mcp/server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_USER": "dev_user",
        "DB_PASSWORD": "dev_password",
        "DB_NAME": "development_db"
      }
    }
  }
}
```

## 환경 변수

- `DB_HOST`: MySQL 서버 호스트 (기본값: localhost)
- `DB_PORT`: MySQL 서버 포트 (기본값: 3306)
- `DB_USER`: MySQL 사용자명 (기본값: root)
- `DB_PASSWORD`: MySQL 비밀번호 (기본값: 빈 문자열)
- `DB_NAME`: 데이터베이스 이름 (기본값: test)

## 사용 가능한 도구

### execute_query
SQL 쿼리를 실행합니다.

```javascript
{
  "name": "execute_query",
  "arguments": {
    "query": "SELECT * FROM users LIMIT 10"
  }
}
```

### show_tables
데이터베이스의 모든 테이블을 조회합니다.

```javascript
{
  "name": "show_tables",
  "arguments": {}
}
```

### describe_table
특정 테이블의 구조를 확인합니다.

```javascript
{
  "name": "describe_table",
  "arguments": {
    "table_name": "users"
  }
}
```

## 요구사항

- Node.js 18.0.0 이상
- MySQL 서버

## 의존성

- `@modelcontextprotocol/sdk`: MCP SDK
- `mysql2`: MySQL 클라이언트

## 라이선스

MIT
