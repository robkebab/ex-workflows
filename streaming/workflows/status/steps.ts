import { getWritable } from "workflow";

export async function updateStatus(status: string, ms: number = 0) {
  "use step";

  const writer = getWritable<string>().getWriter();
  writer.write(status);
  writer.releaseLock();

  if (ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export async function closeWritable() {
  "use step";

  await getWritable().close();
}
