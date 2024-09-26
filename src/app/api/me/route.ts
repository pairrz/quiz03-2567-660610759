import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Dararat Buayim",
    studentId: "660610759",
  });
};
