import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  createdAt: string;
};

// On Render, set DATA_DIR=/var/data and attach a persistent disk there.
const dataDirectory = process.env.DATA_DIR || path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "enquiries.json");

async function readEnquiries(): Promise<Enquiry[]> {
  try {
    const contents = await fs.readFile(dataFile, "utf8");
    const parsed: unknown = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed as Enquiry[] : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeEnquiries(enquiries: Enquiry[]) {
  await fs.mkdir(dataDirectory, { recursive: true });
  const temporaryFile = `${dataFile}.tmp`;
  await fs.writeFile(temporaryFile, JSON.stringify(enquiries, null, 2), "utf8");
  await fs.rename(temporaryFile, dataFile);
}

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function GET() {
  try {
    const enquiries = await readEnquiries();
    return NextResponse.json({ enquiries });
  } catch {
    return NextResponse.json({ error: "Unable to read enquiries." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = clean(body.name, 100);
    const email = clean(body.email, 150);
    const phone = clean(body.phone, 40);
    const type = clean(body.type, 100) || "General enquiry";
    const message = clean(body.message, 3000);

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const enquiries = await readEnquiries();
    const enquiry: Enquiry = {
      id: randomUUID(), name, email, phone, type, message,
      createdAt: new Date().toISOString()
    };
    enquiries.unshift(enquiry);
    await writeEnquiries(enquiries);
    return NextResponse.json({ message: "Enquiry received.", enquiry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save enquiry. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "An enquiry ID is required." }, { status: 400 });
    const enquiries = await readEnquiries();
    const updated = enquiries.filter((item) => item.id !== id);
    if (updated.length === enquiries.length) {
      return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    }
    await writeEnquiries(updated);
    return NextResponse.json({ enquiries: updated });
  } catch {
    return NextResponse.json({ error: "Unable to delete enquiry." }, { status: 500 });
  }
}
