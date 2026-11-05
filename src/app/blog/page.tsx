import prisma from '@/lib/db';
import { getWebsiteSettings } from '@/lib/settings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyBottomBar from '@/components/StickyBottomBar';
import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';

export const revalidate = 0;

export default async function BlogListingPage() {
  const settings = await getWebsiteSettings();
  const posts = await prisma.blogPost.findMany({
    where: { status: 'Published' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar settings={settings} />

      {/* Hero Banner */}
      <div className="bg-primary text-white py-12 px-4 text-center border-b-4 border-secondary">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="relative max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-display">Ujjain Travel Guide & Taxi Tips</h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Read our expert advice, travel guidelines, temple darshan routes, and tips for booking car rentals in Ujjain.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-primary font-display mb-1">No Articles Published</h3>
            <p className="text-gray-500 text-sm">Please check back later or contact us directly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-primary font-display leading-snug hover:text-secondary">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-4 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                <div className="p-6 pt-0 border-t border-gray-200/50 flex justify-between items-center text-xs text-gray-400 bg-white/50">
                  <span>By {post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-secondary font-bold hover:underline flex items-center"
                  >
                    <span>Read Article</span>
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer settings={settings} />
      <StickyBottomBar settings={settings} />
    </div>
  );
}
