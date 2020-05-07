cat src/entities/Types.ts > out-1.ts
cat src/entities/EnemyRobot.ts >> out-1.ts
cat src/entities/Robot.ts >> out-1.ts
cat src/entities/RobotStore.ts >> out-1.ts
cat src/strategy/Strategy.ts >> out-1.ts
cat src/strategy/orchestrator/*.ts >> out-1.ts
cat src/strategy/Definer.ts >> out-1.ts
cat src/strategy/S_*.ts >> out-1.ts
cat src/utils/*.ts >> out-1.ts
cat src/*.ts >> out-1.ts
tail -n +15 main.ts >> out-1.ts
sed 's/export //g' out-1.ts > out-2.ts
sed 's/import { .* } from ".*";//g' out-2.ts > out-3.ts
mv out-3.ts out.ts
rm out-*.ts
pbcopy < out.ts
