cat src/board/*.ts > out-1.ts

cat src/utils/*.ts >> out-1.ts

cat src/strategy/AStrategy.ts >> out-1.ts
cat src/strategy/GoalStrategy.ts >> out-1.ts
cat src/strategy/CollectorStrategy.ts >> out-1.ts
cat src/strategy/SpeedStrategy.ts >> out-1.ts
cat src/strategy/RandomStrategy.ts >> out-1.ts
cat src/strategy/SurvivorStrategy.ts >> out-1.ts

cat src/pacmans/*.ts >> out-1.ts

cat src/*.ts >> out-1.ts

tail -n +13 main.ts >> out-1.ts

sed 's/export //g' out-1.ts > out-2.ts
sed 's/import { .* } from ".*";//g' out-2.ts > out-3.ts

mv out-3.ts out.ts

rm out-*.ts

pbcopy < out.ts

rm out.ts 
