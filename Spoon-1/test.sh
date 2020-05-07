#!/bin/bash
ts-node main.ts tests/test-1.txt
 # > tests/out-1.txt
# diff tests/out-1.txt tests/res-1.txt
tail -n +15 main.ts > build.ts
pbcopy < build.ts
