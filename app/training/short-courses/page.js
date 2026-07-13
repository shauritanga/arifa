import { getCollection } from "@/lib/content";
import ShortCourses from "./courses-client";

export const dynamic = "force-dynamic";

export default async function ShortCoursesPage() {
  const courses = await getCollection("COURSE");
  return <ShortCourses courses={courses} />;
}
