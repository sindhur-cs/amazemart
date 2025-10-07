"use client";

import { getCourses } from "@/lib/contentstack";
import { Course } from "@/lib/types";
import { useEffect, useState } from "react";
import CoursesGrid from "../components/CoursesGrid";
import { useHeader } from "../components/HeaderProvider";
import Image from "next/image";

export default function AcademyPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { header } = useHeader();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses as Course[]);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
          <div className="relative mx-auto mb-4 w-16 h-16">
              
                <Image
                  src={header?.contentstack_logo?.url || "/logo_gif.webp"}
                  alt="Loading..."
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                  priority
                />
              
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Loading Courses...</h2>
            <p className="text-gray-500 mt-2">Please wait while we fetch the latest courses</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900">Oops! Something went wrong</h2>
            <p className="text-gray-600 mt-2 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <CoursesGrid
        courses={courses}
        title="Contentstack Academy"
        subtitle="Master Contentstack with our comprehensive collection of courses, tutorials, and guides designed for developers, marketers, and content creators."
      />
    </main>
  );
}
  