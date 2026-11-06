import { getWebsiteSettings } from '@/lib/settings';
import { getBlogPostBySlug } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyBottomBar from '@/components/StickyBottomBar';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Calendar, Compass, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const settings = await getWebsiteSettings();
  
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const whatsappUrl = `https://wa.me/${settings.whatsApp.replace(/[^0-9]/g, '')}?text=Hello%20Ananya%20Express,%20I%20am%20planning%20a%20trip%20after%20reading%20your%20blog%20post:%20"${post.title}".`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-primary hover:text-secondary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Blog List
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-150 space-y-6">
          
          {/* Header Metadata */}
          <div className="space-y-4 pb-6 border-b border-gray-100">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary font-display leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1 text-secondary" />
                <span>Written by: {post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-secondary" />
                <span>Published: {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Article Content Body */}
          <div className="text-charcoal text-sm sm:text-base leading-relaxed space-y-4 font-light whitespace-pre-line">
            {post.content}
          </div>

          {/* CTA Box inside Article */}
          <div className="bg-cream rounded-xl p-6 border border-amber-200 mt-8 space-y-4">
            <h3 className="text-base font-bold text-primary font-display">Planning to visit these places in Ujjain?</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-normal">
              Book a clean vehicle with professional drivers at Ananya Express. We provide fixed-rate temple drops, airport drop-offs, and custom local sightseeing tours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`tel:${settings.phone}`}
                className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-6 rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors"
                title="Blog Detail Call"
              >
                <Phone className="h-4 w-4 text-secondary" />
                <span>Call: {settings.phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-2.5 px-6 rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>

        </article>

      </main>

      <Footer settings={settings} />
      <StickyBottomBar settings={settings} />
    </div>
  );
}
