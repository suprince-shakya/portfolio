import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = generateToken(user._id as string);
  return NextResponse.json({ data: {token}, message: "Login successfully" });
}
