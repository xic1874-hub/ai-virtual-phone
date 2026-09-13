import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return await proxyHandler(req);
}
export async function POST(req: NextRequest) {
  return await proxyHandler(req);
}
export async function PUT(req: NextRequest) {
  return await proxyHandler(req);
}
export async function PATCH(req: NextRequest) {
  return await proxyHandler(req);
}
export async function DELETE(req: NextRequest) {
  return await proxyHandler(req);
}
export async function OPTIONS(req: NextRequest) {
  return await proxyHandler(req);
}

async function proxyHandler(req: NextRequest) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  if (!SUPABASE_URL) {
    return NextResponse.json({ error: "缺少环境变量 SUPABASE_URL" }, { status: 500 });
  }

  const pathParams = req.nextUrl.pathname.replace("/api/supabase-proxy/", "");
  const targetUrl = `${SUPABASE_URL}/${pathParams}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  let body;
  if (!["GET", "OPTIONS"].includes(req.method)) {
    body = await req.text();
  }

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: "follow"
    });

    const data = await res.json();

    const response = NextResponse.json(data, { status: res.status });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "*");
    return response;
  } catch (err) {
    return NextResponse.json({ error: "代理转发失败", detail: (err as Error).message }, { status: 500 });
  }
}
