"use client";

import { usePathname } from "next/navigation";
import ConferenceAnnouncementBar from "./ConferenceAnnouncementBar";

/**
 * The public header/footer must not appear on the admin dashboard, but both live
 * in the root layout. They are passed in as slots (already rendered on the
 * server) so gating them here doesn't turn Footer into a client component.
 */
export default function SiteChrome({ header, footer, children }) {
  const isAdmin = usePathname()?.startsWith("/admin");

  return (
    <>
      {!isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <ConferenceAnnouncementBar />
          {header}
        </div>
      )}
      <main
        id="main-content"
        className={`flex-grow ${isAdmin ? "" : "site-copy"}`}
        tabIndex={-1}
      >
        {children}
      </main>
      {!isAdmin && footer}
    </>
  );
}
