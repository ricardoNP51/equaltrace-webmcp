import { useState } from "react";

import type { ParityReceipt } from "../core/types";
import type { WorkbenchSnapshot } from "../state/WorkbenchStore";
import { evidenceAnchor } from "./judgeEvidence";
import { StatusIcon } from "./StatusIcon";

function downloadReceiptJson(receipt: ParityReceipt, json: string) {
  const url = URL.createObjectURL(
    new Blob([json], { type: "application/json;charset=utf-8" }),
  );
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `equaltrace-parity-${receipt.receiptId}.json`;
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ReceiptPanel({
  snapshot,
}: {
  readonly snapshot: WorkbenchSnapshot;
}) {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const receipt = snapshot.receipt;
  const json = snapshot.receiptJson;
  if (snapshot.phase !== "verified" || !receipt || !json) return null;

  function download() {
    try {
      setDownloadError(null);
      downloadReceiptJson(receipt!, json!);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "The browser blocked the download.",
      );
    }
  }

  return (
    <section className="receipt-panel" aria-labelledby="receipt-title">
      <div className="receipt-heading">
        <span className="icon-shell">
          <StatusIcon name="check" />
        </span>
        <div>
          <p className="section-label">Deterministic parity receipt</p>
          <h2 id="receipt-title">Verified proof is portable</h2>
          <p>
            Six semantic assertions, outcome parity, three fresh route
            identities, and the applied repair are covered by this canonical
            receipt.
          </p>
        </div>
      </div>

      <dl className="receipt-facts">
        <div>
          <dt>Verdict</dt>
          <dd>PASS · evidence-backed</dd>
        </div>
        <div>
          <dt>Assertions</dt>
          <dd>{receipt.assertions.length}/6 passed · outcome parity passed</dd>
        </div>
        <div className="receipt-identity">
          <dt>SHA-256 receipt identity</dt>
          <dd>
            <code>{receipt.receiptId}</code>
          </dd>
        </div>
      </dl>

      <div className="receipt-assertions">
        {receipt.assertions.map((assertion) => (
          <article key={assertion.checkpoint}>
            <div>
              <span className="status-pill">Pass</span>
              <h3>{assertion.invariant}</h3>
              <code>{assertion.checkpoint}</code>
            </div>
            <div className="receipt-evidence-links">
              {assertion.evidenceIds.map((id, index) => (
                <a key={id} href={`#${evidenceAnchor(id)}`}>
                  {receipt.routes[index]?.route ?? "route"} evidence
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>

      <button type="button" onClick={download}>
        Download canonical receipt JSON
      </button>
      {downloadError && (
        <p className="receipt-error" role="alert">
          Download failed; the verified receipt remains visible. {downloadError}
        </p>
      )}
    </section>
  );
}
