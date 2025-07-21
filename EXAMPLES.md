# MySQL MCP Server Examples

## Claude Desktop 설정 예제

### 단일 데이터베이스 연결

```json
{
  "mcpServers": {
    "mysql": {
      "command": "node",
      "args": ["C:/path/to/mcp/server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "3306",
        "DB_USER": "root",
        "DB_PASSWORD": "your_password",
        "DB_NAME": "your_database"
      }
    }
  }
}
```

### 여러 데이터베이스 연결

```json
{
  "mcpServers": {
    "mysql-production": {
      "command": "node",
      "args": ["C:/path/to/mcp/server.js"],
      "env": {
        "DB_HOST": "prod-server.example.com",
        "DB_PORT": "3306",
        "DB_USER": "prod_user",
        "DB_PASSWORD": "prod_password",
        "DB_NAME": "production_db"
      }
    },
    "mysql-staging": {
      "command": "node",
      "args": ["C:/path/to/mcp/server.js"],
      "env": {
        "DB_HOST": "staging-server.example.com",
        "DB_PORT": "3306",
        "DB_USER": "staging_user",
        "DB_PASSWORD": "staging_password",
        "DB_NAME": "staging_db"
      }
    },
    "mysql-development": {
      "command": "node",
      "args": ["C:/path/to/mcp/server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "3306",
        "DB_USER": "dev_user",
        "DB_PASSWORD": "dev_password",
        "DB_NAME": "development_db"
      }
    }
  }
}
```

## 사용 예제

### 1. 테이블 목록 조회
```
Claude에게: "데이터베이스의 모든 테이블을 보여주세요"
```

### 2. 테이블 구조 확인
```
Claude에게: "users 테이블의 구조를 보여주세요"
```

### 3. 데이터 조회
```
Claude에게: "users 테이블에서 최근 가입한 사용자 10명을 조회해주세요"
```

### 4. 복잡한 쿼리
```
Claude에게: "각 부서별 직원 수와 평균 급여를 조회해주세요"
```

## 트러블슈팅

### 연결 실패 시
1. MySQL 서버가 실행 중인지 확인
2. 방화벽 설정 확인
3. 사용자 권한 확인
4. 로그 파일 확인: `%APPDATA%/Claude/logs/`

### 권한 문제 시
```sql
-- MySQL에서 사용자 권한 설정
GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'%';
FLUSH PRIVILEGES;
```

### 포트 변경 시
```json
{
  "env": {
    "DB_PORT": "3307"
  }
}
```
