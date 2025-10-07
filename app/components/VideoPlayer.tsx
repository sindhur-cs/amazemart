"use client";

import { Course } from "@/lib/types";

interface VideoPlayerProps {
  course: Course;
}

export default function VideoPlayer({ course }: VideoPlayerProps) {

  if (!course.course_video?.url) {
    return (
      <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg aspect-video">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-white mb-2">Video Coming Soon</h3>
            <p className="text-gray-300">This course video will be available shortly</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg">
      <div className="relative aspect-video">
        <video
          className="w-full h-full object-cover rounded-lg"
          controls
          preload="metadata"
          poster={course.thumbnail_image?.url || ""}
          playsInline
          crossOrigin="anonymous"
          onError={(e) => {
            console.error('Video loading error, trying without crossOrigin:', e);
            e.currentTarget.removeAttribute('crossOrigin');
            e.currentTarget.load();
          }}
        >
          <source src={course.course_video.url} type="video/mp4" />
          <source src={course.course_video.url} type="video/webm" />
          <source src={course.course_video.url} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
