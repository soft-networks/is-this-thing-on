/**
 * Archive Population Tool
 *
 * Writes archive data to Firestore using the Firebase Admin SDK.
 * Reads credentials from server/.env (same as the server itself).
 *
 * HOW TO RUN (from the server/ directory):
 *   npm run build && node build/tools/populate-archive.js
 *
 * ADDING A NEW ARCHIVE:
 *   1. Update ARCHIVE_ID, ARCHIVE_META, and ROOMS below.
 *   2. Run the command above.
 *   3. The script uses { merge: true } — safe to re-run to update individual fields.
 *
 * ADDING ARCHIVE URLs LATER:
 *   Just fill in the archive_url fields and re-run. Existing fields won't be overwritten
 *   unless you change them here.
 */

import { firestore } from "../src/firebase-init.js";

// ─── EDIT THIS SECTION TO POPULATE AN ARCHIVE ────────────────────────────────

const ARCHIVE_ID = "thingplusone";

const ARCHIVE_META = {
  name: "thingplusone",
  description: "one where we each brought a friend",
};

const ROOMS: Array<{
  id: string;
  room_name: string;
  room_color: string;
  archive_url: string;
}> = [
  {
    id: "thingplusone-sarah",
    room_name: "sarah",
    room_color: "#FCFF54",
    archive_url: "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4",
  },
  {
    id: "thingplusone-maya",
    room_name: "maya",
    room_color: "#FCFF54",
    archive_url: "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4",
  },
  {
    id: "thingplusone-molly",
    room_name: "molly",
    room_color: "#FCFF54",
    archive_url: "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4",
  },
  {
    id: "thingplusone-soft",
    room_name: "soft",
    room_color: "#FCFF54",
    archive_url: "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4",
  },
  {
    id: "thingplusone-chrisy",
    room_name: "chrisy",
    room_color: "#FCFF54",
    archive_url: "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4",
  },
  {
    id: "thingplusone-compromised",
    room_name: "compromised",
    room_color: "#FCFF54",
    archive_url: "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4",
  },
  {
    id: "thingplusone-messydarla",
    room_name: "messydarla",
    room_color: "#FCFF54",
    archive_url: "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4",
  },
  {
    id: "thingplusone-ambient",
    room_name: "ambient",
    room_color: "#FCFF54",
    archive_url: "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

async function populate() {
  console.log(`\nPopulating archive: ${ARCHIVE_ID}`);
  console.log(`Path: /archives/${ARCHIVE_ID}\n`);

  // Write archive metadata
  const archiveRef = firestore.collection("archives").doc(ARCHIVE_ID);
  await archiveRef.set(ARCHIVE_META, { merge: true });
  console.log(`✓ Archive metadata`);
  console.log(`    name: "${ARCHIVE_META.name}"`);
  console.log(`    description: "${ARCHIVE_META.description}"`);

  // Write each room
  console.log(`\nRooms:`);
  for (const room of ROOMS) {
    const roomRef = archiveRef.collection("rooms").doc(room.id);
    await roomRef.set(
      {
        room_name: room.room_name,
        room_color: room.room_color,
        archive_url: room.archive_url,
      },
      { merge: true }
    );

    const urlStatus = room.archive_url ? `"${room.archive_url}"` : "(empty — fill in later)";
    console.log(`✓ ${room.id}`);
    console.log(`    room_name: "${room.room_name}"`);
    console.log(`    room_color: "${room.room_color}"`);
    console.log(`    archive_url: ${urlStatus}`);
  }

  console.log(
    `\nDone. ${ROOMS.length} rooms written to /archives/${ARCHIVE_ID}/rooms/\n`
  );
}

populate().catch((err) => {
  console.error("Error populating archive:", err);
  process.exit(1);
});
