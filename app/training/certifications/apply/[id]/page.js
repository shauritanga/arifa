import { notFound } from "next/navigation";
import ApplyForm from "./apply-form";
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
    "certifications.json",
  );
  let title = "Apply for Certification - ARIFA";
  try {
    const fileContent = fs.readFileSync(dataPath, "utf-8");
    const certs = JSON.parse(fileContent);
    if (certs[id]) {
      title = `Apply: ${certs[id].title} - ARIFA`;
    }
  } catch (error) {}
  return { title };
}
export default async function ApplyCertification({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const dataPath = path.join(
    process.cwd(),
    "app",
    "data",
    "certifications.json",
  );
  let data = null;
  try {
    const fileContent = fs.readFileSync(dataPath, "utf-8");
    const certs = JSON.parse(fileContent);
    data = certs[id];
  } catch (error) {
    console.error("Failed to read certification data:", error);
  }
  if (!data) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-white py-20 pt-32">
      {" "}
      <div className="max-w-[1200px] mx-auto px-6">
        {" "}
        <Link
          href={`/training/certifications/view/${id}`}
          className="inline-flex items-center gap-2 text-black/70 hover:text-primary transition-colors mb-8 text-sm font-bold uppercase tracking-wider"
        >
          {" "}
          <i className="fas fa-arrow-left" /> Back to Course Details{" "}
        </Link>{" "}
        <div className="grid lg:grid-cols-3 gap-12">
          {" "}
          {/* Form Area */}{" "}
          <div className="lg:col-span-2">
            {" "}
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-black/10 relative overflow-hidden">
              {" "}
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />{" "}
              <h1 className="text-3xl font-extrabold text-black font-[var(--font-heading)] mb-2">
                Application Form
              </h1>{" "}
              <p className="text-black/70 mb-10">
                Fill out the form below to apply for the{" "}
                <strong className="text-primary">{data.title}</strong>.
              </p>{" "}
              <ApplyForm programme={data.title} programmeId={id} />{" "}
            </div>{" "}
          </div>{" "}
          {/* Sidebar Area */}{" "}
          <div className="lg:col-span-1">
            {" "}
            <div className="bg-white rounded-2xl shadow-lg border border-black/10 overflow-hidden sticky top-32">
              {" "}
              <div className="relative h-48">
                {" "}
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover"
                />{" "}
                <div className="absolute inset-0 bg-primary/70" />{" "}
                <div className="absolute bottom-4 left-4 right-4">
                  {" "}
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                    {" "}
                    Selected Program{" "}
                  </span>{" "}
                  <h3 className="text-lg font-bold text-white font-[var(--font-heading)] leading-tight">
                    {" "}
                    {data.title}{" "}
                  </h3>{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-6 bg-primary/5 border-b border-black/10">
                {" "}
                <p className="text-sm text-black/70 font-medium">
                  {" "}
                  You are taking the first step towards advancing your career
                  with ARIFA&apos;s industry-leading certification.{" "}
                </p>{" "}
              </div>{" "}
              <div className="p-6">
                {" "}
                <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-4">
                  What happens next?
                </h4>{" "}
                <ul className="space-y-4">
                  {" "}
                  <li className="flex items-start gap-3">
                    {" "}
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                      1
                    </div>{" "}
                    <p className="text-sm text-black/70">
                      Submit your application details.
                    </p>{" "}
                  </li>{" "}
                  <li className="flex items-start gap-3">
                    {" "}
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                      2
                    </div>{" "}
                    <p className="text-sm text-black/70">
                      Our admissions team will review your profile.
                    </p>{" "}
                  </li>{" "}
                  <li className="flex items-start gap-3">
                    {" "}
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                      3
                    </div>{" "}
                    <p className="text-sm text-black/70">
                      Receive your enrollment package and payment link.
                    </p>{" "}
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
