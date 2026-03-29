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
 *   Add a new entry to the ARCHIVES array below, then re-run.
 *   The script uses { merge: true } — safe to re-run to update individual fields.
 */

import { firestore } from "./firebase-init-tools.js";

// ─── EDIT THIS SECTION ────────────────────────────────────────────────────────

const TEST_URL = "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4";

type Room = { id: string; room_name: string; room_color: string; archive_url: string };
type Archive = { id: string; name: string; description: string; rooms: Room[] };

const ARCHIVES: Archive[] = [
  {
    id: "thingplusone",
    name: "thingplusone",
    description: "one where we each brought a friend",
    rooms: [
      { id: "thingplusone-sarah",      room_name: "sarah",      room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusone-maya",       room_name: "maya",       room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusone-molly",      room_name: "molly",      room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusone-soft",       room_name: "soft",       room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusone-chrisy",     room_name: "chrisy",     room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusone-compromised",room_name: "compromised",room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusone-messydarla", room_name: "messydarla", room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusone-ambient",    room_name: "ambient",    room_color: "#FCFF54", archive_url: TEST_URL },
    ],
  },
  {
    id: "thingplusyou",
    name: "thingplusyou",
    description: "",
    rooms: [
      { id: "thingplusyou-sarah",  room_name: "sarah",  room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusyou-molly",  room_name: "molly",  room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusyou-soft",   room_name: "soft",   room_color: "#FCFF54", archive_url: TEST_URL },
      { id: "thingplusyou-chrisy", room_name: "chrisy", room_color: "#FCFF54", archive_url: TEST_URL },
    ],
  },
  {
    id: "nothing",
    name: "nothing",
    description: "",
    rooms: [
      { id: "nothing-aoe2bearcam", room_name: "aoe2bearcam", room_color: "#FCFF54", archive_url: TEST_URL }, // lan Worm
      { id: "nothing-anya",        room_name: "anya",        room_color: "#FCFF54", archive_url: TEST_URL }, // anya mind
      { id: "nothing-baphomette",  room_name: "baphomette",  room_color: "#FCFF54", archive_url: TEST_URL }, // baphomette
      { id: "nothing-brian",       room_name: "brian",       room_color: "#FCFF54", archive_url: TEST_URL }, // Brian Clifton
      { id: "nothing-char",        room_name: "char",        room_color: "#FCFF54", archive_url: TEST_URL }, // Char Stiles
      { id: "nothing-claire",      room_name: "claire",      room_color: "#FCFF54", archive_url: TEST_URL }, // Claire Jervert
      { id: "nothing-smarthouse",  room_name: "smarthouse",  room_color: "#FCFF54", archive_url: TEST_URL }, // Claire Hentschker
      { id: "nothing-em",          room_name: "em",          room_color: "#FCFF54", archive_url: TEST_URL }, // Em Sieler
      { id: "nothing-sneakyfelix", room_name: "sneakyfelix", room_color: "#FCFF54", archive_url: TEST_URL }, // emily d'achiardi
      { id: "nothing-exonomo",     room_name: "exonomo",     room_color: "#FCFF54", archive_url: TEST_URL }, // exonemo
      { id: "nothing-helen",       room_name: "helen",       room_color: "#FCFF54", archive_url: TEST_URL }, // helen lin
      { id: "nothing-jessie",      room_name: "jessie",      room_color: "#FCFF54", archive_url: TEST_URL }, // Jessie Edelstein
      { id: "nothing-karla",       room_name: "karla",       room_color: "#FCFF54", archive_url: TEST_URL }, // Karla Zurita
      { id: "nothing-kennie",      room_name: "kennie",      room_color: "#FCFF54", archive_url: TEST_URL }, // Kennie Zhou
      { id: "nothing-kiana",       room_name: "kiana",       room_color: "#FCFF54", archive_url: TEST_URL }, // Kiana Fernandez
      { id: "nothing-scorpiojawn", room_name: "scorpiojawn", room_color: "#FCFF54", archive_url: TEST_URL }, // Kiki Green
      { id: "nothing-L4U",         room_name: "L4U",         room_color: "#FCFF54", archive_url: TEST_URL }, // Lau Mota
      { id: "nothing-bartelbv",    room_name: "bartelbv",    room_color: "#FCFF54", archive_url: TEST_URL }, // Matthew Flores
      { id: "nothing-mark",        room_name: "mark",        room_color: "#FCFF54", archive_url: TEST_URL }, // Mark Ramos
      { id: "nothing-wttdotm",     room_name: "wttdotm",     room_color: "#FCFF54", archive_url: TEST_URL }, // Morry Kolman
      { id: "nothing-grass",       room_name: "grass",       room_color: "#FCFF54", archive_url: TEST_URL }, // Mister Grass
      { id: "nothing-loveheart",   room_name: "loveheart",   room_color: "#FCFF54", archive_url: TEST_URL }, // OK Books
      { id: "nothing-void",        room_name: "void",        room_color: "#FCFF54", archive_url: TEST_URL }, // peter burr
      { id: "nothing-coffee",      room_name: "coffee",      room_color: "#FCFF54", archive_url: TEST_URL }, // Quentin Stafford-Fraser
      { id: "nothing-kiddieRide",  room_name: "kiddieRide",  room_color: "#FCFF54", archive_url: TEST_URL }, // Rosalie Yu
      { id: "nothing-sloanef",     room_name: "sloanef",     room_color: "#FCFF54", archive_url: TEST_URL }, // Sloane Frederick
      { id: "nothing-spencer",     room_name: "spencer",     room_color: "#FCFF54", archive_url: TEST_URL }, // Spencer Chang
      { id: "nothing-bonitasworld",room_name: "bonitasworld",room_color: "#FCFF54", archive_url: TEST_URL }, // Taylor Torres
      { id: "nothing-choochoo",    room_name: "choochoo",    room_color: "#FCFF54", archive_url: TEST_URL }, // Daniel Shiffman
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────

async function populateArchive(archive: Archive) {
  console.log(`\nPopulating archive: ${archive.id}`);
  console.log(`Path: /archives/${archive.id}`);

  const archiveRef = firestore.collection("archives").doc(archive.id);
  await archiveRef.set({ name: archive.name, description: archive.description }, { merge: true });
  console.log(`  ✓ metadata  (name: "${archive.name}", description: "${archive.description}")`);

  for (const room of archive.rooms) {
    const roomRef = archiveRef.collection("rooms").doc(room.id);
    await roomRef.set(
      { room_name: room.room_name, room_color: room.room_color, archive_url: room.archive_url },
      { merge: true }
    );
    const urlStatus = room.archive_url ? room.archive_url : "(empty)";
    console.log(`  ✓ ${room.id}  →  ${urlStatus}`);
  }

  console.log(`  ${archive.rooms.length} rooms written.`);
}

async function main() {
  for (const archive of ARCHIVES) {
    await populateArchive(archive);
  }
  console.log(`\nAll done.\n`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
