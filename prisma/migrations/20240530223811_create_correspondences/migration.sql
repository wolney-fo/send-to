-- CreateTable
CREATE TABLE "correspondences" (
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "one_time_password_hash" TEXT NOT NULL,
    "time_to_live" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "correspondences_pkey" PRIMARY KEY ("content","type","one_time_password_hash","time_to_live","created_at")
);
