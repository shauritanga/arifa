"use client";

import { useState, useTransition } from "react";
import { reverifyDonation } from "../../../actions";

/**
 * Re-ask AirPay for this donation's status. The admin cannot set the status
 * directly — the gateway decides, and the amount is checked before anything
 * settles. This button only triggers that check.
 */
export default function ReverifyButton({ reference }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  const run = () => {
    setResult(null);
    startTransition(async () => {
      const res = await reverifyDonation(reference);
      setResult(res);
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg disabled:opacity-70"
      >
        <i className="fas fa-rotate mr-2" />
        {pending ? "Checking AirPay…" : "Re-check with AirPay"}
      </button>

      {result && (
        <p
          className={`mt-3 text-sm font-medium ${
            result.ok ? "text-green-700" : "text-red-700"
          }`}
        >
          {result.ok ? `AirPay reports: ${result.status}` : result.error}
        </p>
      )}
    </div>
  );
}
