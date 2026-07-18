import { getSiteSettings } from "../../actions";
import SettingsClient from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return <SettingsClient settings={settings} />;
}
