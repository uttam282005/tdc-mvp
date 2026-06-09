import { db } from "./index";
import { profiles } from "./schema";
import fs from "fs";
import path from "path";
import type { Profile } from "../utils/types";

async function main() {
  console.log("Seeding database...");
  
  // Read dummy profiles JSON
  const filePath = path.join(process.cwd(), "data", "dummyProfiles.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const allProfiles = JSON.parse(rawData) as Profile[];

  console.log(`Found ${allProfiles.length} profiles to insert.`);

  // Clear existing profiles
  await db.delete(profiles);
  console.log("Cleared existing profiles.");

  // Prepare database insert payloads
  const insertPayloads = allProfiles.map((p) => {
    return {
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      gender: p.gender,
      dob: p.dob,
      age: p.age,
      height: p.height,
      maritalStatus: p.maritalStatus,
      country: p.country,
      city: p.city,
      religion: p.religion,
      caste: p.caste,
      siblings: p.siblings,
      wantKids: p.wantKids,
      income: p.income,
      undergradCollege: p.undergradCollege,
      degree: p.degree,
      currentCompany: p.currentCompany,
      designation: p.designation,
      openToRelocate: p.openToRelocate,
      openToPets: p.openToPets,
      languagesKnown: p.languagesKnown,
      statusTag: p.statusTag,
      assignedClient: p.assignedClient ?? false,
      diet: p.diet || null,
      familyType: p.familyType || null,
      manglik: p.manglik || null,
      values: p.values || [],
      bio: p.bio || null,
    };
  });

  // Batch insert
  // Split into chunks of 50 to be safe with SQL parameter limits
  const chunkSize = 50;
  for (let i = 0; i < insertPayloads.length; i += chunkSize) {
    const chunk = insertPayloads.slice(i, i + chunkSize);
    await db.insert(profiles).values(chunk);
    console.log(`Inserted chunk ${i / chunkSize + 1}`);
  }

  console.log("Database seeded successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
