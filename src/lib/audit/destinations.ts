import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import type { AuditLead } from "./schema";

/**
 * Where a submitted audit request goes.
 *
 * Provider-abstracted so a CRM, an email service or a spreadsheet can be
 * wired in without touching the route or the form.
 *
 * Resolution order:
 *   1. LEAD_WEBHOOK_URL set    -> POST the lead as JSON (works with HubSpot,
 *                                 Pipedrive, Zapier, Make, n8n, a Slack
 *                                 workflow, or your own endpoint).
 *   2. Development, no webhook -> append to .data/leads.jsonl on disk.
 *   3. Production, no webhook  -> NO destination. The route returns a 503 and
 *                                 the form tells the visitor to email us
 *                                 instead. It never reports a false success.
 */

export type DeliveryResult = { ok: true } | { ok: false; reason: string };

export type LeadDestination = {
  name: string;
  deliver(lead: AuditLead): Promise<DeliveryResult>;
};

const webhookDestination = (url: string): LeadDestination => ({
  name: "webhook",
  async deliver(lead) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.LEAD_WEBHOOK_TOKEN
            ? { authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ source: "starspring-free-audit", lead }),
        // A hung CRM must not hold the visitor's browser open.
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        return { ok: false, reason: `Webhook responded ${response.status}` };
      }
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        reason: error instanceof Error ? error.message : "Webhook request failed",
      };
    }
  },
});

/**
 * Development adapter. Writes newline-delimited JSON so leads survive a
 * restart and can be inspected while the real destination is being set up.
 * Never used in production.
 */
const fileDestination: LeadDestination = {
  name: "file",
  async deliver(lead) {
    try {
      const directory = path.join(process.cwd(), ".data");
      await mkdir(directory, { recursive: true });
      await appendFile(path.join(directory, "leads.jsonl"), `${JSON.stringify(lead)}\n`, "utf8");
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        reason: error instanceof Error ? error.message : "Could not write lead to disk",
      };
    }
  },
};

export function resolveDestination(): LeadDestination | null {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) return webhookDestination(webhook);
  if (process.env.NODE_ENV !== "production") return fileDestination;
  return null;
}
