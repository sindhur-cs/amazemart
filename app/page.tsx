"use client";

import { getBlogEntries } from "@/lib/contentstack";
import { BlogEntry } from "@/lib/types";
import { useEffect, useState } from "react";
import BlogGrid from "./components/BlogGrid";
import { useHeader } from "./components/HeaderProvider";
import Image from "next/image";
export default function Home() {
  const [blogs, setBlogs] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { header } = useHeader();

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const fetchedBlogs = await getBlogEntries();
        setBlogs(fetchedBlogs as BlogEntry[]);
      } catch (err) {
        console.error("Error fetching blog entries:", err);
        setError("Failed to load blog posts. Please try again later.");
        } finally {
          setLoading(false);
        }
    };

    loadBlogs();
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
            <h2 className="text-xl font-semibold text-gray-700">Loading Blog Posts...</h2>
            <p className="text-gray-500 mt-2">Please wait while we fetch the latest posts</p>
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
      <BlogGrid
        blogs={blogs}
        title="Contentstack Blogs"
        subtitle="Insights, tutorials, and updates from our team. Stay up to date with the latest trends and best practices in content management."
      />
    </main>
  );
}
