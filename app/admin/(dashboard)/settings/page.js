import { auth } from "../../../../lib/auth";
import PasswordForm from "./password-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-extrabold text-black font-[var(--font-heading)]">
        Settings
      </h1>

      <div className="space-y-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="mb-4 font-extrabold text-black">Your account</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-black/50">Email</dt>
              <dd className="font-bold text-black">{session.user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-black/50">Role</dt>
              <dd className="font-bold capitalize text-black">
                {session.user.role ?? "admin"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="mb-4 font-extrabold text-black">Change password</h2>
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
