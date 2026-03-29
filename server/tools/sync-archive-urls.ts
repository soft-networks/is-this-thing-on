/**
 * Sync Archive URLs from Live Rooms
 *
 * Reads archive_url from existing live /rooms/{roomID} documents and
 * copies them into the corresponding archive room documents.
 *
 * HOW TO RUN (from the server/ directory):
 *   npm run build && node build/tools/sync-archive-urls.js
 *
 * Only pulls from rooms listed in SYNC_MAP below.
 * Rooms that appear in multiple events (sarah, molly, etc.) are intentionally
 * excluded since their live archive_url may belong to a different event.
 */

import { firestore } from "./firebase-init-tools.js";

// ─── EDIT THIS SECTION ────────────────────────────────────────────────────────

// Maps archive room ID → live room ID to pull archive_url from.
// Add entries here for any archive room that should sync from a live room.
const SYNC_MAP: Record<string, { archiveID: string; liveRoomID: string }> = {
  "nothing-aoe2bearcam": { archiveID: "nothing", liveRoomID: "aoe2bearcam" },
  "nothing-anya":        { archiveID: "nothing", liveRoomID: "anya" },
  "nothing-baphomette":  { archiveID: "nothing", liveRoomID: "baphomette" },
  "nothing-brian":       { archiveID: "nothing", liveRoomID: "brian" },
  "nothing-char":        { archiveID: "nothing", liveRoomID: "char" },
  "nothing-claire":      { archiveID: "nothing", liveRoomID: "claire" },
  "nothing-smarthouse":  { archiveID: "nothing", liveRoomID: "smarthouse" },
  "nothing-em":          { archiveID: "nothing", liveRoomID: "em" },
  "nothing-sneakyfelix": { archiveID: "nothing", liveRoomID: "sneakyfelix" },
  "nothing-exonomo":     { archiveID: "nothing", liveRoomID: "exonomo" },
  "nothing-helen":       { archiveID: "nothing", liveRoomID: "helen" },
  "nothing-jessie":      { archiveID: "nothing", liveRoomID: "jessie" },
  "nothing-karla":       { archiveID: "nothing", liveRoomID: "karla" },
  "nothing-kennie":      { archiveID: "nothing", liveRoomID: "kennie" },
  "nothing-kiana":       { archiveID: "nothing", liveRoomID: "kiana" },
  "nothing-scorpiojawn": { archiveID: "nothing", liveRoomID: "scorpiojawn" },
  "nothing-L4U":         { archiveID: "nothing", liveRoomID: "L4U" },
  "nothing-bartelbv":    { archiveID: "nothing", liveRoomID: "bartelbv" },
  "nothing-mark":        { archiveID: "nothing", liveRoomID: "mark" },
  "nothing-wttdotm":     { archiveID: "nothing", liveRoomID: "wttdotm" },
  "nothing-grass":       { archiveID: "nothing", liveRoomID: "grass" },
  "nothing-loveheart":   { archiveID: "nothing", liveRoomID: "loveheart" },
  "nothing-void":        { archiveID: "nothing", liveRoomID: "void" },
  "nothing-coffee":      { archiveID: "nothing", liveRoomID: "coffee" },
  "nothing-kiddieRide":  { archiveID: "nothing", liveRoomID: "kiddieRide" },
  "nothing-sloanef":     { archiveID: "nothing", liveRoomID: "sloanef" },
  "nothing-spencer":     { archiveID: "nothing", liveRoomID: "spencer" },
  "nothing-bonitasworld":{ archiveID: "nothing", liveRoomID: "bonitasworld" },
  "nothing-choochoo":    { archiveID: "nothing", liveRoomID: "choochoo" },
};

// Manual URLs for rooms that don't have an archive_url on their live room doc.
// Replace TEST_URL with the real URL when you have it.
const TEST_URL = "https://www3.cde.ca.gov/download/rod/big_buck_bunny.mp4";

const MANUAL_OVERRIDES: Record<string, { archiveID: string; archive_url: string }> = {
  "nothing-jessie":      { archiveID: "nothing", archive_url: TEST_URL }, // Jessie Edelstein
  "nothing-kiana":       { archiveID: "nothing", archive_url: TEST_URL }, // Kiana Fernandez
  "nothing-bartelbv":    { archiveID: "nothing", archive_url: TEST_URL }, // Matthew Flores
  "nothing-grass":       { archiveID: "nothing", archive_url: TEST_URL }, // Mister Grass
  "nothing-loveheart":   { archiveID: "nothing", archive_url: TEST_URL }, // OK Books
  "nothing-coffee":      { archiveID: "nothing", archive_url: TEST_URL }, // Quentin Stafford-Fraser
  "nothing-kiddieRide":  { archiveID: "nothing", archive_url: TEST_URL }, // Rosalie Yu
  "nothing-bonitasworld":{ archiveID: "nothing", archive_url: TEST_URL }, // Taylor Torres
};

// ─────────────────────────────────────────────────────────────────────────────

async function syncArchiveURLs() {
  console.log(`\nSyncing archive_urls from live rooms...\n`);

  let synced = 0;
  let missing = 0;

  for (const [archiveRoomID, { archiveID, liveRoomID }] of Object.entries(SYNC_MAP)) {
    const liveDoc = await firestore.collection("rooms").doc(liveRoomID).get();

    if (!liveDoc.exists) {
      console.log(`  ✗ ${archiveRoomID}  — live room "${liveRoomID}" not found`);
      missing++;
      continue;
    }

    const archiveURL = liveDoc.data()?.archive_url;

    if (!archiveURL) {
      console.log(`  ✗ ${archiveRoomID}  — live room "${liveRoomID}" has no archive_url`);
      missing++;
      continue;
    }

    await firestore
      .collection("archives")
      .doc(archiveID)
      .collection("rooms")
      .doc(archiveRoomID)
      .set({ archive_url: archiveURL }, { merge: true });

    console.log(`  ✓ ${archiveRoomID}  →  ${archiveURL}`);
    synced++;
  }

  // Write manual overrides
  if (Object.keys(MANUAL_OVERRIDES).length > 0) {
    console.log(`\nManual overrides:\n`);
    for (const [archiveRoomID, { archiveID, archive_url }] of Object.entries(MANUAL_OVERRIDES)) {
      await firestore
        .collection("archives")
        .doc(archiveID)
        .collection("rooms")
        .doc(archiveRoomID)
        .set({ archive_url }, { merge: true });
      console.log(`  ✓ ${archiveRoomID}  →  ${archive_url}`);
      synced++;
    }
  }

  console.log(`\nDone. ${synced} synced, ${missing} missing.\n`);
}

syncArchiveURLs().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
