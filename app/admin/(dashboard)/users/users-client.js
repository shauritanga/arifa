"use client";

import { useState, useTransition } from "react";
import { createAdminUser, deleteAdminUser } from "../../actions";

export default function UsersClient({ users, currentEmail }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const onCreate = (formData) => {
    setError("");
    startTransition(async () => {
      const res = await createAdminUser(formData);
      if (!res.ok) setError(res.error);
      else setAdding(false);
    });
  };

  const onDelete = (id, email) => {
    if (!confirm(`Remove ${email}? They will lose dashboard access immediately.`)) {
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await deleteAdminUser(id);
      if (!res.ok) setError(res.error);
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-black font-[var(--font-heading)]">
          Admin Users
        </h1>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
        >
          {adding ? "Cancel" : "Add user"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {adding && (
        <form
          action={onCreate}
          className="mb-8 grid gap-4 rounded-2xl border border-black/10 bg-white p-6 sm:grid-cols-2"
        >
          <Field label="Name">
            <input
              name="name"
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-primary"
            />
          </Field>
          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-primary"
            />
          </Field>
          <Field label="Password (min 10 characters)">
            <input
              name="password"
              type="password"
              required
              minLength={10}
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-primary"
            />
          </Field>
          <Field label="Role">
            <select
              name="role"
              defaultValue="admin"
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-primary"
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-primary px-6 py-3 font-bold text-white disabled:opacity-70"
            >
              {pending ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-wider text-black/50">
            <tr>
              <th className="px-5 py-4 font-bold">Name</th>
              <th className="px-5 py-4 font-bold">Email</th>
              <th className="px-5 py-4 font-bold">Role</th>
              <th className="px-5 py-4 font-bold">Added</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-4 font-bold text-black">{u.name || "—"}</td>
                <td className="px-5 py-4 text-black/70">
                  {u.email}
                  {u.email === currentEmail && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      you
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 capitalize text-black/60">{u.role}</td>
                <td className="px-5 py-4 text-black/60">{u.createdAt}</td>
                <td className="px-5 py-4 text-right">
                  {u.email !== currentEmail && (
                    <button
                      type="button"
                      onClick={() => onDelete(u.id, u.email)}
                      disabled={pending}
                      className="text-sm font-bold text-red-600 hover:underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-black">
        {label}
      </span>
      {children}
    </label>
  );
}
