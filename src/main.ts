import { chooseFollowUp, type WorkOrder } from "./work_order_follow_up.ts";

const order: WorkOrder = { id: "wo-17", technician_id: "tech-4", dispatch_status: "complete", photos: [] };
console.log(JSON.stringify({ work_order_id: order.id, technician_id: order.technician_id, decision: await chooseFollowUp(order) }));
