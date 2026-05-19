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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${user?.id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  const allBookingsById = await res.json();
  console.log(allBookingsById);
  return (
    <div className="container mx-auto my-5">
      <h1>mybooking</h1>
      <div className="">
        {allBookingsById.map((booking) => (
          <div
            key={booking._id}
            className="flex justify-between p-5 border my-3"
          >
            <div className="flex gap-5">
              <Image
                alt={booking.destinationName}
                src={booking.imageUrl}
                width={300}
                height={300}
                className="w-45 object-contain"
              ></Image>
              <div>
                <h1>{booking.destinationName}</h1>
                <p>
                  {new Date(booking.departureDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>${booking.price}</p>
              </div>
            </div>
            <div>
              <DeleteBookingAlert bookingId={booking._id} />
              <Link
                href={`http://localhost:3000/destination/${booking.destinationId}`}
                className="ml-5"
              >
                <Button>View</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingPage;
