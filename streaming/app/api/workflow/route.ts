import { start } from "workflow/api";
import { statusWorkflow } from "../../../workflows/status";

export async function GET(_request: Request) {
  const run = await start(statusWorkflow);

  return new Response(run.readable, {
    headers: { "Content-Type": "text/plain" },
  });
}
