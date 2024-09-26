import { DB, readDB, writeDB } from "@lib/DB";
import { Database, Payload} from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  let role = null;
  role = (<Payload>payload).role;
  if(role === "ADMIN" || role === "SUPER_ADMIN"){
    return NextResponse.json({
      ok: true,
      rooms: (<Database>DB).rooms,
      totalRooms: (<Database>DB).rooms.length 
    });
  }
};

export const POST = async (request: NextRequest) => {
  readDB();
  const payload = checkToken();
  let role = null;
  try {
    role = (<Payload>payload).role;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  const body = await request.json();
  const { roomName } = body;
  const foundRoom = (<Database>DB).rooms.find((x) => x.roomName === roomName);
  if (foundRoom){
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${"replace this with room name"} already exists`,
      },
      { status: 400 }
    );
  }
 
  const roomId = nanoid();
  (<Database>DB).rooms.push({
    roomId,
    roomName,
  });
  
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
  
};
