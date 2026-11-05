import prisma from '@/lib/db';
import BookingsManager from '@/components/admin/BookingsManager';

export const revalidate = 0;

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      vehicle: true,
      assignedDriver: true,
    },
  });

  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: true },
    select: { id: true, name: true, category: true },
  });

  const drivers = await prisma.driver.findMany({
    where: { availabilityStatus: 'Available' },
    select: { id: true, name: true, phone: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Booking Management</h1>
        <p className="text-xs text-gray-500 mt-1">Review enquiries, assign drivers and vehicles, update billing, and send confirmation messages.</p>
      </div>

      <BookingsManager 
        initialBookings={bookings} 
        vehicles={vehicles} 
        drivers={drivers} 
      />
    </div>
  );
}
