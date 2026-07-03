import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const dataPath = path.join(
    process.cwd(),
    "app",
    "data",
    "research_projects.json",
  );
  let title = "Research Project - ARIFA";
  try {
    const fileContent = fs.readFileSync(dataPath, "utf-8");
    const projects = JSON.parse(fileContent);
    const p = projects.find((p) => p.id === id);
    if (p) title = `${p.title} - ARIFA Research`;
  } catch (error) {}
  return { title };
}
export default async function ResearchProjectDetails({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const dataPath = path.join(
    process.cwd(),
    "app",
    "data",
    "research_projects.json",
  );
  let data = null;
  try {
    const fileContent = fs.readFileSync(dataPath, "utf-8");
    const projects = JSON.parse(fileContent);
    data = projects.find((p) => p.id === id);
  } catch (error) {
    console.error("Failed to read research project data:", error);
  }
  if (!data) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* ====== Stunning Premium Header ====== */}{" "}
      <section className="relative pt-48 pb-32 overflow-hidden flex flex-col justify-center">
        {" "}
        {/* Background Image & Overlays */}{" "}
        <div className="absolute inset-0 z-0 bg-primary">
          {" "}
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover object-center opacity-70"
            priority
          />{" "}
          <div className="absolute inset-0 bg-primary/80" />{" "}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-primary/80" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
          {" "}
          {/* Breadcrumb Navigation */}{" "}
          <nav
            className="flex items-center gap-3 text-sm text-white/70 mb-10 font-medium tracking-wide"
            aria-label="Breadcrumb"
          >
            {" "}
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-2"
            >
              {" "}
              <i className="fas fa-home text-white/50" /> Home{" "}
            </Link>{" "}
            <i className="fas fa-chevron-right text-xs text-white/30" />{" "}
            <Link
              href="/research/research-projects"
              className="hover:text-white transition-colors"
            >
              {" "}
              Research Projects{" "}
            </Link>{" "}
            <i className="fas fa-chevron-right text-xs text-white/30" />{" "}
            <span
              className="text-white font-bold truncate max-w-[150px] md:max-w-[300px] lg:max-w-md"
              title={data.title}
            >
              {" "}
              {data.title}{" "}
            </span>{" "}
          </nav>{" "}
          <div className="flex flex-col lg:flex-row gap-12 lg:items-end justify-between">
            {" "}
            <div className="max-w-4xl">
              {" "}
              <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                {" "}
                Active Research{" "}
              </span>{" "}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] font-[var(--font-heading)] ">
                {" "}
                {data.title}{" "}
              </h1>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Decorative divider */}{" "}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          {" "}
          <svg
            className="relative block w-full h-[50px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            {" "}
            <path
              d="M1200 120L0 120 0 0 1200 0 1200 120z"
              fill="#FFFFFF"
              opacity="0.1"
            ></path>{" "}
            <path
              d="M0 120h1200V0C936.56 120 263.44 120 0 0v120z"
              fill="#FFFFFF"
            ></path>{" "}
          </svg>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Project Content with Balance and Hierarchy ====== */}{" "}
      <section className="py-20">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="grid lg:grid-cols-12 gap-12">
            {" "}
            {/* Left Column: Descriptive Content */}{" "}
            <div className="lg:col-span-8 space-y-8">
              {" "}
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/10 relative overflow-hidden group">
                {" "}
                <div className="relative z-10">
                  {" "}
                  <h2 className="text-2xl font-bold text-black font-[var(--font-heading)] mb-8 pb-4 border-b border-black/10 flex items-center gap-4">
                    {" "}
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {" "}
                      <i className="fas fa-file-alt" />{" "}
                    </div>{" "}
                    Project Overview{" "}
                  </h2>{" "}
                  <div
                    className="max-w-none text-lg text-black/70 leading-loose [&_p]:mb-6 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-12 [&_h3]:mb-6 [&_h3]:font-[var(--font-heading)] [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-black [&_h4]:mt-8 [&_h4]:mb-4 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-8 [&_ul]:space-y-4 [&_li]:relative [&_li]:pl-8 [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-2.5 [&_li]:before:w-2 [&_li]:before:h-2 [&_li]:before:bg-primary [&_li]:before:rounded-full [&_strong]:text-black [&_strong]:font-bold [&_strong]:bg-primary/5 [&_strong]:px-1.5 [&_strong]:rounded"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Right Column: Sticky Navigation & Quick Actions */}{" "}
            <div className="lg:col-span-4 relative">
              {" "}
              <div className="sticky top-32 space-y-8">
                {" "}
                {/* Meta Card (High Contrast) */}{" "}
                <div className="bg-primary p-8 rounded-3xl shadow-xl relative overflow-hidden">
                  {" "}
                  <h3 className="text-xl font-bold text-white font-[var(--font-heading)] mb-6">
                    Research Details
                  </h3>{" "}
                  <ul className="space-y-6">
                    {" "}
                    <li className="flex items-start gap-4">
                      {" "}
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary shrink-0 border border-white/20">
                        {" "}
                        <i className="fas fa-calendar-alt" />{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <strong className="block text-sm text-white font-bold mb-1">
                          Status
                        </strong>{" "}
                        <span className="text-sm text-white/60">
                          Ongoing Research
                        </span>{" "}
                      </div>{" "}
                    </li>{" "}
                    <li className="flex items-start gap-4">
                      {" "}
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary shrink-0 border border-white/20">
                        {" "}
                        <i className="fas fa-globe-africa" />{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <strong className="block text-sm text-white font-bold mb-1">
                          Region
                        </strong>{" "}
                        <span className="text-sm text-white/60">
                          Pan-African Initiative
                        </span>{" "}
                      </div>{" "}
                    </li>{" "}
                    <li className="flex items-start gap-4">
                      {" "}
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary shrink-0 border border-white/20">
                        {" "}
                        <i className="fas fa-users" />{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <strong className="block text-sm text-white font-bold mb-1">
                          Stakeholders
                        </strong>{" "}
                        <span className="text-sm text-white/60">
                          Government & Academic
                        </span>{" "}
                      </div>{" "}
                    </li>{" "}
                  </ul>{" "}
                </div>{" "}
                {/* Share Card */}{" "}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/10">
                  {" "}
                  <h4 className="font-bold text-black mb-4">
                    Share this Research
                  </h4>{" "}
                  <div className="flex gap-4">
                    {" "}
                    <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-white hover:bg-[#00803D] hover:border-[#00803D] transition-colors">
                      {" "}
                      <i className="fab fa-twitter" />{" "}
                    </button>{" "}
                    <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-white hover:bg-[#990000] hover:border-[#990000] transition-colors">
                      {" "}
                      <i className="fab fa-linkedin-in" />{" "}
                    </button>{" "}
                    <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-white hover:bg-primary hover:border-black transition-colors">
                      {" "}
                      <i className="fas fa-link" />{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
}
