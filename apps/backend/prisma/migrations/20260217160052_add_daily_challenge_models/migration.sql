-- CreateTable
CREATE TABLE "daily_challenges" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "category_id" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "question_count" INTEGER NOT NULL DEFAULT 10,
    "question_ids" JSONB NOT NULL,
    "reward_points" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_challenge_attempts" (
    "id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "correct_answers" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_challenge_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_streaks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_played_date" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_challenges_date_key" ON "daily_challenges"("date");

-- CreateIndex
CREATE INDEX "daily_challenges_date_idx" ON "daily_challenges"("date");

-- CreateIndex
CREATE INDEX "daily_challenges_category_id_idx" ON "daily_challenges"("category_id");

-- CreateIndex
CREATE INDEX "daily_challenge_attempts_challenge_id_idx" ON "daily_challenge_attempts"("challenge_id");

-- CreateIndex
CREATE INDEX "daily_challenge_attempts_user_id_idx" ON "daily_challenge_attempts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_challenge_attempts_challenge_id_user_id_key" ON "daily_challenge_attempts"("challenge_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_streaks_user_id_key" ON "user_streaks"("user_id");

-- AddForeignKey
ALTER TABLE "daily_challenges" ADD CONSTRAINT "daily_challenges_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_challenge_attempts" ADD CONSTRAINT "daily_challenge_attempts_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "daily_challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_challenge_attempts" ADD CONSTRAINT "daily_challenge_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_streaks" ADD CONSTRAINT "user_streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
