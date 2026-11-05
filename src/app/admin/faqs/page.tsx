import prisma from '@/lib/db';
import FaqsManager from '@/components/admin/FaqsManager';

export const revalidate = 0;

export default async function AdminFaqsPage() {
  const faqs = await prisma.fAQ.findMany();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">FAQ Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Add, edit, or remove Frequently Asked Questions visible on the homepage.
        </p>
      </div>

      <FaqsManager initialFaqs={faqs} />
    </div>
  );
}
