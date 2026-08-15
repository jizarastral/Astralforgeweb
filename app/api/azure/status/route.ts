import { publicProviderStatus } from "@/lib/providers";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(publicProviderStatus());
}
