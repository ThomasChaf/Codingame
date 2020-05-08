cat src/Board/*.ts > out-1.ts

cat src/strategy/AStrategy.ts >> out-1.ts
cat src/strategy/Definer.ts >> out-1.ts
cat src/strategy/S_Collector.ts >> out-1.ts

cat src/pacmans/APacman.ts >> out-1.ts
cat src/pacmans/Enemy.ts >> out-1.ts
cat src/pacmans/Pacman.ts >> out-1.ts

cat src/*.ts >> out-1.ts

tail -n +13 main.ts >> out-1.ts

sed 's/export //g' out-1.ts > out-2.ts
sed 's/import { .* } from ".*";//g' out-2.ts > out-3.ts

mv out-3.ts out.ts

rm out-*.ts

pbcopy < out.ts
