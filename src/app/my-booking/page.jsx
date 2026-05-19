import React from "react";
import Image from "next/image";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import { Button } from "@heroui/react";
import Link from "next/link";
import { DeleteBookingAlert } from "../../components/DeleteBookingAlert";

const MyBookingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  const user = session?.user;

  // 🛡️ সেফটি গার্ড: লগইন না থাকলে ইউজারকে সুন্দর মেসেজ দেখাবে, পেজ ক্র্যাশ করবে না দাদা
  if (!user) {
    return (
      <div className="container mx-auto my-10 text-center p-10 bg-orange-50 border rounded-xl">
        <h2 className="text-xl font-bold text-orange-600 mb-3">
          Please Login First
        </h2>
        <Link href="/login">
          <Button color="primary">Login Now</Button>
        </Link>
      </div>
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${user.id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  // 🛡️ সেফটি গার্ড: ব্যাকএন্ড যদি ডাটা দিতে ব্যর্থ হয়
  if (!res.ok) {
    return (
      <div className="container mx-auto my-10 text-center p-10 bg-red-50 border rounded-xl">
        <h2 className="text-xl font-bold text-red-600">
          Failed to load bookings!
        </h2>
      </div>
    );
  }

  const allBookingsById = await res.json();

  // 🛡️ সেফটি গার্ড: ডাটা যদি খালি বা ফাঁকা অ্যারে আসে
  if (!Array.isArray(allBookingsById) || allBookingsById.length === 0) {
    return (
      <div className="container mx-auto my-10 text-center p-10 bg-gray-50 border rounded-xl">
        <h2 className="text-xl font-bold text-gray-500">
          No Bookings Found 🗺️
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-5">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <div>
        {allBookingsById.map((booking) => (
          <div
            key={booking._id}
            className="flex justify-between items-center p-5 border my-3 rounded-xl bg-white shadow-sm"
          >
            <div className="flex gap-5 items-center">
              <Image
                alt={booking.destinationName || "Destination"}
                src={
                  booking.imageUrl ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                }
                width={300}
                height={300}
                className="w-45 h-24 object-cover rounded-lg"
              />
              <div>
                <h1 className="font-bold text-lg">{booking.destinationName}</h1>
                <p className="text-sm text-gray-500">
                  {booking.departureDate
                    ? new Date(booking.departureDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Date not fixed"}
                </p>
                <p className="font-semibold text-green-600">${booking.price}</p>
              </div>
            </div>
            <div className="flex items-center">
              <DeleteBookingAlert bookingId={booking._id} />
              <Link
                href={`/destination/${booking.destinationId}`}
                className="ml-5"
              >
                <Button color="primary">View</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingPage;
