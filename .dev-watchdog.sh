#!/bin/bash
# Watchdog: keeps the Next.js dev server running.
# Restarts it if it dies (e.g. OOM-killed during compile).
cd /home/z/my-project
while true; do
  echo "[watchdog] starting next dev..."
  node node_modules/.bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1
  EXIT=$?
  echo "[watchdog] next dev exited with code $EXIT at $(date)"
  sleep 3
done
