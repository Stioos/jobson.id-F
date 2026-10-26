#!/bin/bash
# Truly daemonized launcher: double-fork to fully detach from controlling terminal.
cd /home/z/my-project
exec 0</dev/null 1>/dev/null 2>&1
# First fork
(
  # Second fork
  (
    cd /home/z/my-project
    exec node node_modules/.bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1
  ) &
)
# Give the grandchild a moment to start
sleep 1
exit 0
