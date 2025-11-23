import { closeWritable, updateStatus } from "./steps";

export async function statusWorkflow() {
  "use workflow";

  await updateStatus("Requested", 2000);
  await updateStatus("In Progress", 15000);
  await updateStatus("Completed");
  await closeWritable();
}
