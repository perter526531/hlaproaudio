import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// Public: get site settings
export async function GET() {
  const setting = await db.siteSetting.findFirst();
  return NextResponse.json(setting);
}

// Admin: update settings
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  let setting = await db.siteSetting.findFirst();
  if (!setting) {
    setting = await db.siteSetting.create({ data: {} });
  }
  const updated = await db.siteSetting.update({
    where: { id: setting.id },
    data: {
      ...(body.siteNameEn !== undefined && { siteNameEn: body.siteNameEn }),
      ...(body.siteNameCn !== undefined && { siteNameCn: body.siteNameCn }),
      ...(body.logo !== undefined && { logo: body.logo }),
      ...(body.phoneEn !== undefined && { phoneEn: body.phoneEn }),
      ...(body.phoneCn !== undefined && { phoneCn: body.phoneCn }),
      ...(body.emailEn !== undefined && { emailEn: body.emailEn }),
      ...(body.emailCn !== undefined && { emailCn: body.emailCn }),
      ...(body.addressEn !== undefined && { addressEn: body.addressEn }),
      ...(body.addressCn !== undefined && { addressCn: body.addressCn }),
      ...(body.whatsapp !== undefined && { whatsapp: body.whatsapp }),
      ...(body.wechat !== undefined && { wechat: body.wechat }),
      ...(body.facebook !== undefined && { facebook: body.facebook }),
      ...(body.youtube !== undefined && { youtube: body.youtube }),
      ...(body.instagram !== undefined && { instagram: body.instagram }),
      ...(body.linkedin !== undefined && { linkedin: body.linkedin }),
      ...(body.copyrightEn !== undefined && { copyrightEn: body.copyrightEn }),
      ...(body.copyrightCn !== undefined && { copyrightCn: body.copyrightCn }),
    },
  });
  return NextResponse.json(updated);
}
