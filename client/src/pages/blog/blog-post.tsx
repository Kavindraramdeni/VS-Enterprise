import { useParams, Link } from "wouter";
import blogData from "./blog-data.json";
import { useEffect, useState } from "react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogData.find((p) => p.slug === slug);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (post) {
      fetch(post.content)
        .then((res) => res.text())
        .then(setContent);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-yellow-300 flex items-center justify-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog">
            <a className="text-white underline">Back to Blog</a>
          </Link>
        </div>
      </div>
    );
  }

  const recentPosts = blogData.filter((p) => p.slug !== slug).slice(0, 5);

  return (
    <div className="relative min-h-screen px-4 pt-32 pb-12 text-yellow-300">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-black/70 -z-0" />

      {/* Grid layout: 2 columns for post + 1 column for recent posts */}
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blog Post */}
        <div className="lg:col-span-2 space-y-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-400 mb-4">{post.date}</p>
            <p className="text-white mb-4">{post.summary}</p>
            <div
              className="prose prose-invert prose-lg"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          <Link href="/blog">
            <a className="inline-block bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition">
              Back to Blog
            </a>
          </Link>
        </div>

        {/* Recent Posts Sidebar */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map((p) => (
              <Link href={`/blog/${p.slug}`} key={p.slug}>
                <a className="block bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 hover:scale-105 transition-transform duration-200">
                  <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-400">{p.date}</p>
                  <p className="text-yellow-300 text-sm mt-1 line-clamp-2">{p.summary}</p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
