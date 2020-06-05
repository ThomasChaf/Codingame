echo "// https://github.com/ThomasChaf/Codingame" > out-1.ts
cat src/Solver.ts >> out-1.ts
tail -n +21 main.ts >> out-1.ts

sed 's/export //g' out-1.ts > out-2.ts
sed 's/import { .* } from ".*";//g' out-2.ts > out-3.ts

prettier out-3.ts > out.ts

pbcopy < out.ts

rm out*.ts
