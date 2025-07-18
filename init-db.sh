#!/bin/bash
set -e

if [ -z "${DB_NAME}" ]; then
  echo "ERROR: Variable DB_NAME is empty!"
  exit 1
fi

echo "Try connect to SQL Server..."
/opt/mssql-tools/bin/sqlcmd -S mssql -U "${DB_USERNAME}" -P "${DB_PASSWORD}" -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${DB_NAME}') CREATE DATABASE [${DB_NAME}]"

echo "DB instantiated correctly."
