import prisma from '@/lib/db';
import LeadsCRM from '@/components/admin/LeadsCRM';

export const revalidate = 0;

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      followUps: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Sales Leads CRM</h1>
        <p className="text-xs text-gray-500 mt-1">
          Track booking inquiries from website submissions and manual entries. Manage follow-ups, priorities, and pipeline conversion.
        </p>
      </div>

      <LeadsCRM initialLeads={leads} />
    </div>
  );
}
