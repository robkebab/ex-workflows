import { getWritable } from "workflow";

export async function updateStatus(status: string) {
  "use step";

  const writer = getWritable<string>().getWriter();
  writer.write(status);
  writer.releaseLock();
}

export async function closeWritable() {
  "use step";

  await getWritable().close();
}
