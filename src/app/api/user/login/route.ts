import jwt from "jsonwebtoken";
import { Database, Payload} from "@lib/DB";
import { DB, readDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {

  readDB();
  const body = await request.json();
  const { username, password } = body;

  const user = (<Database>DB).users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or password is incorrect",
      },
      { status: 400 }
    );
  }

  //if found user, sign a JWT TOKEN
  const secret = process.env.JWT_SECRET || "This is my special secret";

  const token = jwt.sign(
    { username, password: user.password , role: user.role},
    secret,
    { expiresIn: "8h" }
  );

  return NextResponse.json({ ok: true, token });
};