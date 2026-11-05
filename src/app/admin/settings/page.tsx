import prisma from '@/lib/db';
import SettingsForm from '@/components/admin/SettingsForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  let settings = await prisma.websiteSettings.findUnique({
    where: { id: 'settings' },
  });

  if (!settings) {
    // Seed settings if missing
    settings = await prisma.websiteSettings.create({
      data: {
        id: 'settings',
        businessName: 'Ananya Express',
        phone: '+91 94250 82701',
        whatsApp: '+91 94250 82701',
        email: 'booking@ananyaexpress.com',
        addressFreeganj: 'Near BJP Office, Freeganj, Ujjain, Madhya Pradesh',
        addressNanakheda: 'A/1, New Abhishek Nagar, Nanakheda, Ujjain, Madhya Pradesh',
        businessHours: 'Open 24 Hours, 7 Days a Week',
        heroHeading: 'Reliable Taxi & Tour Services in Ujjain',
        heroDescription: 'Book clean cars, professional drivers and fixed-price travel services for local sightseeing, Mahakal Darshan, airport transfers and outstation trips.',
        aboutText: 'Ananya Express provides dependable taxi, car rental and tour services across Ujjain and nearby destinations. With professional drivers, clean vehicles, fixed pricing and 24-hour support, the company helps individuals, families and groups travel safely and comfortably.',
        experienceYears: 10,
        tripsCompleted: 15000,
        fleetSize: 25,
      },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">System Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure business metadata, phone numbers, policy copy, and local coordinates.</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
