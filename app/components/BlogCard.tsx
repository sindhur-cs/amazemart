import { BlogEntry } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  blog: BlogEntry;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const extractExcerpt = (htmlContent: string, maxLength: number = 150) => {
    // Strip HTML tags and get plain text
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    // Get first sentence or truncate to maxLength
    const sentences = textContent.split('. ');
    if (sentences[0].length <= maxLength) {
      return sentences[0] + (sentences.length > 1 ? '...' : '');
    }
    return textContent.substring(0, maxLength) + '...';
  };

  return (
    <Link href={`/${blog.uid}`} className="block group">
      <article className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
        {/* Featured Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
          {blog.image?.url ? (
            <Image
              src={blog.image.url || ""}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl opacity-30">📝</div>
            </div>
          )}
          
          {/* Reading Time */}
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
            5 min read
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {blog.title}
            </h3>
          </div>

          {/* Author & Date */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span className="font-medium">{blog.author_name}</span>
            <span className="mx-2">•</span>
            <time dateTime={blog.date}>
              {formatDate(blog.date)}
            </time>
          </div>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
            {extractExcerpt(blog.body)}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2">
              {blog.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {blog.tags.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{blog.tags.length - 2} more
                </span>
              )}
            </div>
            
            <span className="text-purple-600 hover:text-purple-700 text-sm font-medium hover:underline transition-colors cursor-pointer">
              Read More →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
