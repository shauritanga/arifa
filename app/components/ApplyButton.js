"use client";
import { useState } from "react";
import ApplicationModal from "@/app/components/ApplicationModal";
export default function ApplyButton({ courseTitle, courseImage, className }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {" "}
      <button onClick={() => setIsModalOpen(true)} className={className}>
        {" "}
        Apply Now{" "}
      </button>{" "}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseTitle={courseTitle}
        courseImage={courseImage}
      />{" "}
    </>
  );
}
