import { BlogEntry } from "@/lib/types";
import BlogCard from "./BlogCard";

interface BlogGridProps {
  blogs: BlogEntry[];
  title?: string;
  subtitle?: string;
}

export default function BlogGrid({ blogs, title = "Blog Posts", subtitle }: BlogGridProps) {

  if (blogs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Blog Posts Available</h2>
          <p className="text-gray-600">Check back later for new blog posts!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        {subtitle && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">{subtitle}</p>
        )}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
        {blogs.map((blog) => (
          <BlogCard key={blog.uid} blog={blog} />
        ))}
      </div>

      {/* Load More Section (placeholder for future pagination) */}
      {blogs.length >= 6 && (
        <div className="text-center mt-12">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
}
