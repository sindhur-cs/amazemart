import { Course } from "@/lib/types";
import CourseCard from "./CourseCard";

interface CoursesGridProps {
  courses: Course[];
  title?: string;
  subtitle?: string;
}

export default function CoursesGrid({ courses, title = "Courses", subtitle }: CoursesGridProps) {
  if (courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Courses Available</h2>
          <p className="text-gray-600">Check back later for new courses!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        {subtitle && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
        {courses.map((course) => (
          <CourseCard key={course.uid} course={course} />
        ))}
      </div>
    </div>
  );
}
