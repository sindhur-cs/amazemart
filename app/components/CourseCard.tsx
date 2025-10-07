import { Course } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const formatDuration = (duration: string) => {
    return duration.replace('m', ' min');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'explainer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'demo':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'coding':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Link href={`/academy/${course.uid}`} className="block course-card-link">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden flex-shrink-0">
        {course.thumbnail_image?.url ? (
          <Image
            src={course.thumbnail_image.url || ""}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl opacity-30">📚</div>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(course.course_type)}`}>
            {course.course_type}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
          {formatDuration(course.course_duration)}
        </div>
      </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {course.title}
            </h3>
          </div>

        <div className="mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(course.course_level)}`}>
            <span className="w-2 h-2 bg-current rounded-full mr-1"></span>
            {course.course_level}
          </span>
        </div>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 bg-white">
            {course.course_overview}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <span className="text-xs text-gray-500">
            Released {formatDate(course.release_date)}
          </span>
          
            <span className="text-purple-600 hover:text-purple-700 text-sm font-medium hover:underline transition-colors cursor-pointer">
              Learn More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
