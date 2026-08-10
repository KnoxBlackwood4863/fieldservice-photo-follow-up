import { flags } from "./field_service_client.ts";

export type WorkOrderPhoto = { id: string; work_order_id: string; captured_at: string };
export type WorkOrder = { id: string; technician_id: string; dispatch_status: "assigned" | "en_route" | "complete"; photos: WorkOrderPhoto[] };

export async function chooseFollowUp(order: WorkOrder): Promise<"request-photo" | "close-work-order"> {
  const flag = await flags.getValue("fieldservice-photo-follow-up");
  return flag.default_value && order.dispatch_status === "complete" && order.photos.length === 0
    ? "request-photo"
    : "close-work-order";
}

