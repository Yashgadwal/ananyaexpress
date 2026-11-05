-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Staff',
    "lastLogin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsApp" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingRef" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "pickupDate" TEXT NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "returnDate" TEXT,
    "tripType" TEXT NOT NULL,
    "passengerCount" INTEGER NOT NULL,
    "luggageDetails" TEXT,
    "vehicleId" TEXT,
    "specialRequest" TEXT,
    "estimatedFare" REAL NOT NULL,
    "finalFare" REAL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
    "bookingStatus" TEXT NOT NULL DEFAULT 'New Enquiry',
    "assignedVehicleId" TEXT,
    "assignedDriverId" TEXT,
    "internalNotes" TEXT,
    "bookingSource" TEXT NOT NULL DEFAULT 'Website',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Booking_assignedDriverId_fkey" FOREIGN KEY ("assignedDriverId") REFERENCES "Driver" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookingStatusHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookingStatusHistory_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageJson" TEXT NOT NULL,
    "passengerCapacity" INTEGER NOT NULL,
    "luggageCapacity" INTEGER NOT NULL,
    "hasAc" BOOLEAN NOT NULL DEFAULT true,
    "fuelType" TEXT NOT NULL,
    "localFare" REAL NOT NULL,
    "outstationPerKm" REAL NOT NULL,
    "driverAllowance" REAL NOT NULL,
    "minKmRule" INTEGER NOT NULL DEFAULT 250,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "regNumber" TEXT,
    "insuranceExpiry" TEXT,
    "serviceDate" TEXT,
    "permitExpiry" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "imagePath" TEXT,
    "licenceNumber" TEXT,
    "licenceExpiry" TEXT,
    "assignedVehicleId" TEXT,
    "availabilityStatus" TEXT NOT NULL DEFAULT 'Available',
    "internalNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TourPackage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "featuredImage" TEXT NOT NULL,
    "galleryJson" TEXT NOT NULL,
    "startingPrice" REAL NOT NULL,
    "placesCoveredJson" TEXT NOT NULL,
    "inclusionsJson" TEXT NOT NULL,
    "exclusionsJson" TEXT NOT NULL,
    "itineraryJson" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PackageEnquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "packageId" TEXT NOT NULL,
    "passengers" INTEGER NOT NULL,
    "travelDate" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PackageEnquiry_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "TourPackage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    "travelType" TEXT NOT NULL,
    "dateText" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "sourceLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Published',
    "author" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'New',
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "followUpDate" TEXT,
    "assignedTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LeadFollowUp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeadFollowUp_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PromoBanner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imagePath" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WebsiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'settings',
    "logoUrl" TEXT,
    "businessName" TEXT NOT NULL DEFAULT 'Mangal Tour and Travels',
    "phone" TEXT NOT NULL DEFAULT '+91 94250 82701',
    "whatsApp" TEXT NOT NULL DEFAULT '+91 94250 82701',
    "email" TEXT NOT NULL DEFAULT 'booking@mangaltravels.com',
    "addressFreeganj" TEXT NOT NULL DEFAULT 'Near BJP Office, Freeganj, Ujjain, Madhya Pradesh',
    "addressNanakheda" TEXT NOT NULL DEFAULT 'A/1, New Abhishek Nagar, Nanakheda, Ujjain, Madhya Pradesh',
    "businessHours" TEXT NOT NULL DEFAULT 'Open 24 Hours, 7 Days a Week',
    "heroHeading" TEXT NOT NULL DEFAULT 'Reliable Taxi & Tour Services in Ujjain',
    "heroDescription" TEXT NOT NULL DEFAULT 'Book clean cars, professional drivers and fixed-price travel services for local sightseeing, Mahakal Darshan, airport transfers and outstation trips.',
    "aboutText" TEXT NOT NULL DEFAULT 'Mangal Tour and Travels provides dependable taxi, car rental and tour services across Ujjain and nearby destinations. With professional drivers, clean vehicles, fixed pricing and 24-hour support, the company helps individuals, families and groups travel safely and comfortably.',
    "experienceYears" INTEGER NOT NULL DEFAULT 10,
    "tripsCompleted" INTEGER NOT NULL DEFAULT 15000,
    "fleetSize" INTEGER NOT NULL DEFAULT 25,
    "socialFacebook" TEXT,
    "socialInstagram" TEXT,
    "socialTwitter" TEXT,
    "googleMapsFreeganj" TEXT,
    "googleMapsNanakheda" TEXT,
    "justdialLink" TEXT,
    "advancePaymentPercent" INTEGER NOT NULL DEFAULT 20,
    "upiId" TEXT NOT NULL DEFAULT 'mangaltravels@upi',
    "paymentGatewayActive" BOOLEAN NOT NULL DEFAULT false,
    "privacyPolicy" TEXT,
    "termsConditions" TEXT,
    "bookingPolicy" TEXT,
    "cancellationPolicy" TEXT,
    "refundPolicy" TEXT,
    "driverDisclaimer" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingRef_key" ON "Booking"("bookingRef");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
