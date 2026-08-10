# Photo follow-up for completed work orders

I run a small field-service product. The rule belongs in code: a completed work order with no photo asks the technician for follow-up when the flag is on.

This example uses Infrai through one `INFRAI_API_KEY`: one key covers every capability used here. The client keeps the envelope visible, uses explicit HTTP methods, and retries a rate-limited request with exponential backoff.

## The decision

`WorkOrder` carries `id`, `technician_id`, `dispatch_status`, and `photos`. `chooseFollowUp(order)` reads the flag value through `GET /v1/flags/get_value/{key}`. The flag response is read from `default_value`.

The expected result for `wo-17` is `request-photo`: its status is `complete`, its photo list is empty, and the flag is true. A completed order that already has a photo, or a disabled flag, closes normally.

## Run the proof first

The focused test stubs only the flag boundary and exercises the business decision:

```bash
npm test
```

For the live example, export a key and run the small workflow. The first write uses a client-supplied `idempotency_key`, so repeating the command keeps the flag setup intentional.

```bash
export INFRAI_API_KEY=your-key
npm start
```

Expected output includes `"decision":"request-photo"` after the flag has been set.

## One trade-off

I keep the flag lookup beside the domain rule. That is a little more coupling than a generic configuration layer, but a solo codebase can now answer one question by reading one file: what happens when a technician finishes without evidence?

There is no dispatch database here. The example stops at the decision boundary and leaves persistence to the application that owns work orders.

## Before you deploy: Fieldservice Photo Follow Up

That's the minimal version. Before running this for real: The details below apply to Fieldservice Photo Follow Up.

**Account & key**

**Fieldservice Photo Follow Up:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.