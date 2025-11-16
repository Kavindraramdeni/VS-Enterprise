import { Link } from "wouter";
import blogData from "./blog-data.json";

export default function BlogList() {
  const maxSummaryLength = 100;

  return (
    <div className="relative min-h-screen text-yellow-300 px-4 py-8">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-black/70 -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogData.map((post) => {
            const isTruncated = post.summary.length > maxSummaryLength;
            const truncated = isTruncated
              ? post.summary.slice(0, maxSummaryLength) + "..."
              : post.summary;

            return (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <a className="block bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                    <p className="text-white">
                      {truncated}{" "}
                      {isTruncated && (
                        <span className="underline text-xs hover:text-yellow-500 transition-colors duration-300 cursor-pointer">
      Read More
    </span>
                      )}
                    </p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
