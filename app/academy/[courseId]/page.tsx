"use client";

import { getCourse } from "@/lib/contentstack";
import { Course } from "@/lib/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "../../components/VideoPlayer";
import Link from "next/link";

export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const courseId = params.courseId as string;

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const fetchedCourse = await getCourse(courseId);
        setCourse(fetchedCourse as Course);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Course not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="w-full aspect-video bg-gray-300 rounded-lg mb-8"></div>
            
            <div className="space-y-6">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="flex space-x-4">
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/academy"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              ← Back to Courses
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6">
          <Link
            href="/academy"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Academy
          </Link>
        </nav>

        <div className="mb-8">
          <VideoPlayer course={course} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(course.course_type)}`}>
                <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                {course.course_type}
              </span>
              
              <span className="text-gray-500 text-sm">•</span>
              
              <span className="text-gray-600 text-sm font-medium">
                {course.course_duration.replace('m', ' min')}
              </span>
              
              <span className="text-gray-500 text-sm">•</span>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(course.course_level)}`}>
                {course.course_level}
              </span>
              
              <span className="text-gray-500 text-sm">•</span>
              
              <span className="text-gray-600 text-sm">
                Released: {formatDate(course.release_date)}
              </span>
            </div>

            <div className="bg-white border-gray-400 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {course.course_overview}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="text-sm text-gray-900">{course.course_duration.replace('m', ' minutes')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Level</dt>
                  <dd className="text-sm text-gray-900">{course.course_level}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900">{course.course_type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Release Date</dt>
                  <dd className="text-sm text-gray-900">{formatDate(course.release_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">{formatDate(course.updated_at)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
