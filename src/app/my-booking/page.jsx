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

  // 🛡️ সেফটি গার্ড ১: ইউজার বা টোকেন যদি কোনো কারণে খালি থাকে, তবে ব্যাকএন্ডে রিকোয়েস্টই পাঠাবো না দাদা
  if (!user || !token) {
    return (
      <div className="container mx-auto my-10 text-center p-10 bg-orange-50 border border-orange-200 rounded-xl">
        <h2 className="text-2xl font-bold text-orange-600 mb-2">
          Please Login First
        </h2>
        <p className="text-gray-600 mb-5">
          দাদা, বুকিং লিস্ট দেখতে হলে আপনাকে প্রথমে লগইন করতে হবে।
        </p>
        <Link href="/login">
          <Button color="primary">Go to Login</Button>
        </Link>
      </div>
    );
  }

  // 🚀 লাইভ ব্যাকএন্ড থেকে ডাটা ফেচ করা
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${user.id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // বড় হাতের A দিয়ে স্ট্যান্ডার্ড হেডার পাস করা হলো দাদা
        "Content-Type": "application/json",
      },
      cache: "no-store", // ভার্সেল যেন পুরনো বা ফাঁকা ডাটা ক্যাশ করে না রাখে
    },
  );

  // 🛡️ সেফটি গার্ড ২: ব্যাকএন্ড যদি কোনো কারণে ডাটা না দিয়ে এরর রেসপন্স দেয়
  if (!res.ok) {
    return (
      <div className="container mx-auto my-10 text-center p-10 bg-red-50 border border-red-200 rounded-xl">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Unauthorized or Missing Data
        </h2>
        <p className="text-gray-600">
          দাদা, সার্ভার থেকে আপনার বুকিং ভেরিফাই করা যায়নি। অনুগ্রহ করে আবার
          লগইন করুন।
        </p>
      </div>
    );
  }

  const allBookingsById = await res.json();

  // 🛡️ সেফটি গার্ড ৩: ইউজারের যদি কোনো বুকিং না থাকে (খালি অ্যারে)
  if (!Array.isArray(allBookingsById) || allBookingsById.length === 0) {
    return (
      <div className="container mx-auto my-10 text-center p-10 bg-gray-50 border border-gray-200 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-500 mb-2">
          No Bookings Found 🗺️
        </h2>
        <p className="text-gray-400 mb-5">
          দাদা, আপনি এখনো কোনো ট্যুর বুকিং করেননি।
        </p>
        <Link href="/destination">
          <Button color="success" className="text-white">
            Explore Destinations
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-5 p-4">
      <h1 className="text-3xl font-bold mb-5 text-gray-800">My Bookings</h1>
      <div className="grid grid-cols-1 gap-4">
        {allBookingsById.map((booking) => (
          <div
            key={booking._id}
            className="flex flex-col md:flex-row justify-between items-center p-5 border rounded-xl shadow-sm bg-white"
          >
            <div className="flex flex-col md:flex-row gap-5 items-center w-full">
              <Image
                alt={booking.destinationName || "Destination"}
                src={
                  booking.imageUrl ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                }
                width={300}
                height={300}
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-gray-800">
                  {booking.destinationName}
                </h2>
                <p className="text-gray-500 my-1">
                  Departure:{" "}
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
                <p className="text-lg font-semibold text-green-600">
                  ${booking.price}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto justify-center md:justify-end">
              <DeleteBookingAlert bookingId={booking._id} />
              <Link href={`/destination/${booking.destinationId}`}>
                <Button color="primary" variant="flat">
                  View
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingPage;
