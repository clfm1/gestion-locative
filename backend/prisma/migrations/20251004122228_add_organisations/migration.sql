-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "adresse" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Organisation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bien" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "organisationId" TEXT,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "superficie" REAL,
    "nbChambres" INTEGER,
    "loyerBase" REAL NOT NULL,
    "charges" REAL,
    "description" TEXT,
    "photos" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bien_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bien_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Bien" ("adresse", "charges", "codePostal", "createdAt", "description", "id", "loyerBase", "nbChambres", "photos", "superficie", "type", "updatedAt", "userId", "ville") SELECT "adresse", "charges", "codePostal", "createdAt", "description", "id", "loyerBase", "nbChambres", "photos", "superficie", "type", "updatedAt", "userId", "ville" FROM "Bien";
DROP TABLE "Bien";
ALTER TABLE "new_Bien" RENAME TO "Bien";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
