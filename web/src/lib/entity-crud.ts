import { NextRequest, NextResponse } from "next/server";
import type {
  EntityTarget,
  FindOptionsOrder,
  ObjectLiteral,
} from "typeorm";
import { getDataSource } from "@/db/get-data-source";

type WithNumericId = ObjectLiteral & { id: number };

function pagination(url: string) {
  const sp = new URL(url).searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
  const limit = Math.min(200, Math.max(1, parseInt(sp.get("limit") || "25", 10)));
  return { page, limit };
}

export function collectionHandlers<T extends WithNumericId>(
  Entity: EntityTarget<T>,
  defaultOrder: FindOptionsOrder<T> = { id: "ASC" } as FindOptionsOrder<T>,
) {
  async function GET(req: NextRequest) {
    const { page, limit } = pagination(req.url);
    const ds = await getDataSource();
    const repo = ds.getRepository(Entity);
    const [data, total] = await repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: defaultOrder,
    });
    return NextResponse.json({ data, total, page, limit });
  }

  async function POST(req: NextRequest) {
    const body = (await req.json()) as Record<string, unknown>;
    delete body.id;
    const ds = await getDataSource();
    const repo = ds.getRepository(Entity);
    const created = repo.create(body as unknown as T);
    const saved = await repo.save(created);
    return NextResponse.json(saved, { status: 201 });
  }

  return { GET, POST };
}

export function itemHandlers<T extends WithNumericId>(Entity: EntityTarget<T>) {
  async function GET(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> },
  ) {
    const { id } = await ctx.params;
    const pk = Number(id);
    if (!Number.isFinite(pk)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const ds = await getDataSource();
    const repo = ds.getRepository(Entity);
    const row = await repo.findOne({ where: { id: pk } as never });
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(row);
  }

  async function PATCH(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> },
  ) {
    const { id } = await ctx.params;
    const pk = Number(id);
    if (!Number.isFinite(pk)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const body = (await req.json()) as Record<string, unknown>;
    delete body.id;
    const ds = await getDataSource();
    const repo = ds.getRepository(Entity);
    const existing = await repo.findOne({ where: { id: pk } as never });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    Object.assign(existing, body);
    const saved = await repo.save(existing);
    return NextResponse.json(saved);
  }

  async function DELETE(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> },
  ) {
    const { id } = await ctx.params;
    const pk = Number(id);
    if (!Number.isFinite(pk)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const ds = await getDataSource();
    const repo = ds.getRepository(Entity);
    const result = await repo.delete(pk);
    if (!result.affected) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  }

  return { GET, PATCH, DELETE };
}
