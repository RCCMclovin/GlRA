#!/bin/sh
set -e

echo "Aguardando MySQL ficar disponivel..."
until node -e "
const net = require('net');
const s = net.createConnection({host:'${DB_HOST:-db}',port:3306});
s.on('connect',()=>{s.end();process.exit(0)});
s.on('error',()=>process.exit(1));
" 2>/dev/null; do
  sleep 2
done
echo "MySQL disponivel."

mkdir -p ./output/user-uploads

echo "Executando migracoes do Prisma..."
npx prisma migrate deploy

echo "Executando seed..."
npx ts-node prisma/seed.ts || echo "Seed ja executado anteriormente (continuando)."

echo "Iniciando servidor..."
exec npm run start:prod
