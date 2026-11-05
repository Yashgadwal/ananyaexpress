import prisma from '@/lib/db';
import { 
  Users, 
  Car, 
  CalendarCheck, 
  FileText, 
  AlertCircle, 
  DollarSign, 
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboardHome() {
  // 1. Fetch counts & metrics
  const totalEnquiries = await prisma.booking.count();
  
  const newEnquiries = await prisma.booking.count({
    where: { bookingStatus: 'New Enquiry' }
  });

  const confirmedBookings = await prisma.booking.count({
    where: { bookingStatus: 'Confirmed' }
  });

  const completedTrips = await prisma.booking.count({
    where: { bookingStatus: 'Trip Completed' }
  });

  const cancelledTrips = await prisma.booking.count({
    where: { bookingStatus: 'Cancelled' }
  });

  // Calculate Revenue: sum of finalFare (or estimatedFare if finalFare is null) for Paid bookings
  const paidBookings = await prisma.booking.findMany({
    where: { paymentStatus: 'Paid' },
    select: { finalFare: true, estimatedFare: true }
  });

  const totalRevenue = paidBookings.reduce((sum, b) => {
    return sum + (b.finalFare || b.estimatedFare || 0);
  }, 0);

  // Today's / Upcoming Bookings
  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      customer: true,
      vehicle: true
    }
  });

  // Booking Source Breakdown
  const bookingSources = await prisma.booking.groupBy({
    by: ['bookingSource'],
    _count: {
      id: true
    }
  });

  // Most booked vehicle categories
  const vehicleCount = await prisma.booking.groupBy({
    by: ['vehicleId'],
    _count: {
      id: true
    }
  });

  const vehicles = await prisma.vehicle.findMany({
    select: { id: true, name: true, category: true }
  });

  const vehicleStats = vehicleCount.map((stat) => {
    const v = vehicles.find((item) => item.id === stat.vehicleId);
    return {
      name: v ? `${v.name} (${v.category})` : 'Unassigned',
      count: stat._count.id
    };
  }).sort((a, b) => b.count - a.count);

  const stats = [
    { label: 'Total Enquiries', value: totalEnquiries, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'New Enquiries', value: newEnquiries, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Confirmed bookings', value: confirmedBookings, icon: CalendarCheck, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Completed Trips', value: completedTrips, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Cancelled Trips', value: cancelledTrips, icon: AlertCircle, color: 'text-red-600 bg-red-50' },
    { label: 'Revenue Collected', value: `Rs ${totalRevenue}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Dashboard Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Real-time business performance metrics, bookings CRM, and leads pipeline.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-150 flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider leading-none">
                  {s.label}
                </span>
                <div className={`p-2 rounded-lg ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-extrabold text-primary font-display leading-none">
                  {s.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Layout Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Enquiries */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-150 p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="text-base font-bold text-primary font-display">Recent Enquiries</h3>
            <Link href="/admin/bookings" className="text-xs font-bold text-secondary hover:underline flex items-center">
              <span>View All</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
                  <th className="py-3 px-3">Ref</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Route</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Fare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-charcoal font-medium">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/55">
                    <td className="py-3.5 px-3 font-mono font-bold text-secondary">
                      <Link href={`/admin/bookings?id=${b.id}`} className="hover:underline">
                        {b.bookingRef}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3">
                      <div>{b.customer.name}</div>
                      <div className="text-[10px] text-gray-400 font-semibold">{b.customer.phone}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="truncate max-w-[120px]">{b.pickupLocation}</div>
                      <div className="text-[10px] text-gray-400 font-semibold">to {b.destination}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div>{b.pickupDate}</div>
                      <div className="text-[10px] text-gray-400 font-semibold">{b.pickupTime}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.bookingStatus === 'New Enquiry' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        b.bookingStatus === 'Confirmed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        b.bookingStatus === 'Trip Completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-primary font-bold">
                      Rs {b.finalFare || b.estimatedFare || 'TBD'}
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No recent enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Source & Vehicle Analytics */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Booking Sources card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6 space-y-4">
            <h3 className="text-base font-bold text-primary font-display border-b border-gray-100 pb-2">
              Leads by Booking Source
            </h3>
            
            <div className="space-y-3">
              {bookingSources.map((source) => (
                <div key={source.bookingSource} className="space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between text-charcoal">
                    <span>{source.bookingSource}</span>
                    <span className="text-gray-400">{source._count.id} ({((source._count.id / totalEnquiries) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        source.bookingSource === 'Website' ? 'bg-blue-500' :
                        source.bookingSource === 'WhatsApp' ? 'bg-green-500' :
                        'bg-slate-400'
                      }`}
                      style={{ width: `${(source._count.id / totalEnquiries) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {bookingSources.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No data to display.</p>
              )}
            </div>
          </div>

          {/* Popular vehicles card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6 space-y-4">
            <h3 className="text-base font-bold text-primary font-display border-b border-gray-100 pb-2">
              Popular Vehicles
            </h3>
            
            <div className="space-y-3">
              {vehicleStats.map((stat, i) => (
                <div key={i} className="flex justify-between items-center text-xs font-semibold">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-primary/5 flex items-center justify-center text-[10px] text-primary font-bold">
                      {i + 1}
                    </span>
                    <span className="text-charcoal truncate max-w-[160px]">{stat.name}</span>
                  </div>
                  <span className="text-secondary font-bold">{stat.count} Bookings</span>
                </div>
              ))}
              {vehicleStats.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No data to display.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
