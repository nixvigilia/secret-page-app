-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "email" TEXT NOT NULL,
    "secret_message" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendship" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "friendship_requester_id_receiver_id_key" ON "friendship"("requester_id", "receiver_id");

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
