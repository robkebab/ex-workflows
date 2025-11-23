import { closeWritable, updateStatus } from "./steps";
import { sleep } from "workflow";

export async function statusWorkflow() {
  "use workflow";

  await updateStatus("Requested");
  await sleep(2000);
  await updateStatus("In Progress");
  await sleep(15000);
  await updateStatus("Completed");
  await closeWritable();
}
