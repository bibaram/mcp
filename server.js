#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import mysql from 'mysql2/promise';

async function main() {
  console.error('Starting MySQL MCP Server...');
  
  // MySQL 연결 설정
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    timezone: '+00:00'
  };

  console.error('DB Config:', { ...dbConfig, password: '***' });

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.error('MySQL connection established successfully');
    
    // 연결 테스트
    await connection.ping();
    console.error('MySQL ping successful');
  } catch (error) {
    console.error('Failed to connect to MySQL:', error.message);
    process.exit(1);
  }

  const server = new Server(
    {
      name: "mysql-server",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // 도구 목록 핸들러
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error('Tools list requested');
    return {
      tools: [
        {
          name: "execute_query",
          description: "Execute SQL query on MySQL database",
          inputSchema: {
            type: "object",
            properties: {
              query: { 
                type: "string",
                description: "SQL query to execute"
              }
            },
            required: ["query"]
          }
        },
        {
          name: "show_tables",
          description: "Show all tables in the database",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "describe_table",
          description: "Describe the structure of a table",
          inputSchema: {
            type: "object",
            properties: {
              table_name: {
                type: "string",
                description: "Name of the table to describe"
              }
            },
            required: ["table_name"]
          }
        }
      ]
    };
  });

  // 도구 호출 핸들러
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error('Tool call requested:', request.params.name);
    
    try {
      if (request.params.name === "execute_query") {
        const { query } = request.params.arguments;
        console.error('Executing query:', query);
        
        const [rows] = await connection.execute(query);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(rows, null, 2)
            }
          ]
        };
      }
      
      if (request.params.name === "show_tables") {
        console.error('Showing tables');
        const [rows] = await connection.execute('SHOW TABLES');
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(rows, null, 2)
            }
          ]
        };
      }
      
      if (request.params.name === "describe_table") {
        const { table_name } = request.params.arguments;
        console.error('Describing table:', table_name);
        
        const [rows] = await connection.execute(`DESCRIBE \`${table_name}\``);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(rows, null, 2)
            }
          ]
        };
      }
      
      throw new Error(`Unknown tool: ${request.params.name}`);
      
    } catch (error) {
      console.error('Error executing tool:', error.message);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`
          }
        ],
        isError: true
      };
    }
  });

  // 서버 시작
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MySQL MCP Server is running and connected');
}

// 에러 핸들링
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 종료 시 정리
process.on('SIGINT', () => {
  console.error('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

main().catch((error) => {
  console.error('Server startup error:', error);
  process.exit(1);
});
