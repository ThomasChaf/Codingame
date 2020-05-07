#!/bin/bash
ts-node main.ts tests/test-1.txt > tests/out-1.txt
ts-node main.ts tests/test-2.txt > tests/out-2.txt
ts-node main.ts tests/test-3.txt > tests/out-3.txt
ts-node main.ts tests/test-4.txt > tests/out-4.txt
ts-node main.ts tests/test-5.txt > tests/out-5.txt
ts-node main.ts tests/test-6.txt > tests/out-6.txt
diff tests/out-1.txt tests/res-1.txt
diff tests/out-2.txt tests/res-2.txt
diff tests/out-3.txt tests/res-3.txt
diff tests/out-4.txt tests/res-4.txt
diff tests/out-5.txt tests/res-5.txt
diff tests/out-6.txt tests/res-6.txt
tail -n +15 main.ts > build.ts
pbcopy < build.ts
