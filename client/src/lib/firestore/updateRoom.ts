import db from "./init";

import { getFirestore, collection, addDoc, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { logError } from '../logger';

async function updateOrCreateRoom(room: UpdateRoomProps) {
  try {
    const { roomId } = room;
    // Check if room exists
    const roomRef = doc(db, 'rooms', roomId);
    const roomDoc = await getDoc(roomRef);
    if (!roomDoc.exists()) {
      console.log("Room doesn't exist, creating new room");
      // Room doesn't exist, create new room
      return await newRoom(room);
    } else {
      // Room exists, update it with new values
      return await updateRoom(room);
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to check/update room',
      error: error
    };
  }
}

async function updateRoom(room: UpdateRoomProps) {
  try {
    const { roomName, roomId, roomColor } = room;
    const roomData = {
      room_name: roomName,
      room_color: roomColor
    };
    const roomRef = doc(db, 'rooms', roomId);
    await setDoc(roomRef, roomData, { merge: true });
  } catch (e: unknown) {
    logError("Failed to update room", [(e as Error).message]);
  }
}

async function newRoom(room: UpdateRoomProps) {
  try {
    const { roomName, roomId, roomColor, adminUserId } = room;
    // Get default admins from Firestore
    const defaultAdminRef = doc(db, 'stats', 'admin');
    const defaultAdminDoc = await getDoc(defaultAdminRef);
    let adminsList = [adminUserId];
    if (defaultAdminDoc.exists()) {
      const defaultAdmins = defaultAdminDoc.data().admins || [];
      adminsList = Array.from(new Set([...defaultAdmins, adminUserId]));
    }
    const roomData = {
      room_name: roomName,
      room_color: roomColor,
      hidden: false,
      admins: adminsList
    };
    const roomRef = doc(db, 'rooms', roomId);
    await setDoc(roomRef, roomData);
  } catch (error: unknown) {
    logError("Failed to create room", [(error as Error).message]);
  }
}
export default updateOrCreateRoom;