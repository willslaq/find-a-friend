#!/bin/sh

set -e  

echo "Running prisma generate"
npx prisma generate

echo "Waiting for Postgres to start"
./wait-for-postgres.sh findafriend-pg

echo "Running migrations"
npx prisma migrate deploy

echo "Starting application"
npm start