#!/bin/sh
set -e
if [ "${SKIP_DB_MIGRATE:-0}" != "1" ]; then
  (cd /repo/packages/backend && pnpm exec prisma migrate deploy --config prisma/prisma.config.ts)
fi
cd /repo/packages/backend
exec "$@"
