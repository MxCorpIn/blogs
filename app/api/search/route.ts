import { getPostMetaList } from "@/lib/content";

export const dynamic = "force-static";

/** Post metadata index for the navbar search overlay (client-side filtering). */
export async function GET() {
  return Response.json(getPostMetaList());
}
