import { chooseFollowUp } from "../src/work_order_follow_up.ts";
import { flags } from "../src/field_service_client.ts";

const original = flags.getValue;
flags.getValue = async () => ({ default_value: true });
const decision = await chooseFollowUp({ id: "wo-17", technician_id: "tech-4", dispatch_status: "complete", photos: [] });
if (decision !== "request-photo") throw new Error(`expected request-photo, got ${decision}`);
flags.getValue = original;
console.log("field-service decision test passed");

