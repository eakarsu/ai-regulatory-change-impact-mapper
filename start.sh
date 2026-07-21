#!/bin/sh
set -eu
ROOT_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
APP_ROOT="${RUNTIME_PROJECT_SOURCE:-$ROOT_DIR}"
mode="${1:-check}"
AUTH_SECRET="${AUTH_SECRET:-${SESSION_SECRET:-${JWT_SECRET:-}}}"
DEFAULT_TENANT_ID="${DEFAULT_TENANT_ID:-${TENANT_ID:-${GOVERNANCE_TENANT_ID:-}}}"
if [ "${NODE_ENV:-development}" != production ];then ALLOW_LOCAL_PASSWORD_LOGIN="${ALLOW_LOCAL_PASSWORD_LOGIN:-true}";fi
export AUTH_SECRET DEFAULT_TENANT_ID ALLOW_LOCAL_PASSWORD_LOGIN
required(){ eval "v=\${$1:-}";[ -n "$v" ]||{ echo "$1 is required" >&2;exit 1;};}
config(){ required DATABASE_URL;required AUTH_SECRET;required DEFAULT_TENANT_ID;[ "${#AUTH_SECRET}" -ge 32 ]||{ echo 'AUTH_SECRET must be at least 32 characters' >&2;exit 1;};if [ "${NODE_ENV:-development}" = production ];then required OIDC_ISSUER;required OIDC_CLIENT_ID;required OIDC_TENANT_CLAIM;required OIDC_ROLE_MAP_JSON;fi;}
case "$mode" in
  check)(cd "$APP_ROOT/frontend"&&npm run check);;
  migrate)config;[ "${ALLOW_SCHEMA_MIGRATION:-}" = 1 ]||{ echo 'Set ALLOW_SCHEMA_MIGRATION=1' >&2;exit 1;};for migration in "$ROOT_DIR"/frontend/migrations/*.sql;do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$migration";done;;
  start)config;port="${PORT:-${BACKEND_PORT:-}}";[ -n "$port" ]||{ echo 'PORT or BACKEND_PORT is required' >&2;exit 1;};case "$port" in *[!0-9]*)echo 'runtime port must be numeric' >&2;exit 1;;esac;if lsof -tiTCP:"$port" -sTCP:LISTEN>/dev/null 2>&1;then echo "runtime port $port is occupied" >&2;exit 1;fi;(cd "$APP_ROOT/frontend"&&exec npm run start -- -H 127.0.0.1 -p "$port");;
  *)echo 'usage: ./start.sh check|migrate|start' >&2;exit 2;;
esac
