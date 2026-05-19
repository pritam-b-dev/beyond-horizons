import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { EditModal } from "../../../components/EditModal";
import { DeleteAlert } from "../../../components/DeleteAlert";
import BookingCard from "../../../components/BookingCard";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";

const DestinationDetailsPage = async ({ params }) => {
  const { id } = await params;
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  const res = await fetch(`http://localhost:5000/destination/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return (
      <div className="max-w-7xl mx-auto my-10 text-center p-10 bg-red-50 border border-red-200 rounded-xl">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Unauthorized or Data Missing
        </h2>
        <p className="text-gray-600 mb-5">Data not loaded</p>
        <Link href="/destination" className="text-blue-500 underline">
          Back to Destinations
        </Link>
      </div>
    );
  }

  const destinationDetails = await res.json();
  const {
    _id,
    imageUrl,
    price,
    country,
    destinationName,
    duration,
    description,
  } = destinationDetails;

  return (
    <div className="max-w-7xl mx-auto my-5">
      <div className="flex justify-between">
        <div>
          <Link
            href={"http://localhost:3000/destination"}
            className="flex gap-2 items-center"
          >
            <FaArrowLeftLong /> <span>Back to Destinations</span>
          </Link>
        </div>
        <div>
          <EditModal destinationDetails={destinationDetails} />
          <DeleteAlert destinationDetails={destinationDetails} />
        </div>
      </div>
      <Image
        alt="{destinationName}"
        src={imageUrl}
        width={1000}
        height={1000}
        className="h-120 mx-auto my-5 object-contain"
      />

      {/* informations and booking section */}
      <div className="flex justify-between">
        {/* informations */}
        <div>
          <div>
            <div className="flex gap-2 items-center">
              <FaMapMarkerAlt /> <span>{country}</span>
            </div>
          </div>
          <div>
            <h1>{destinationName}</h1>
          </div>
          <div>${price}/per person</div>
          <div>
            <div className="flex gap-3 items-center">
              <SlCalender /> <span>{duration}</span>
            </div>
          </div>
          <div>
            <h1>Overview</h1>
            <p>{description}</p>
          </div>
        </div>
        {/* booking card  */}
        <div>
          <BookingCard destinationDetails={destinationDetails} />
        </div>
      </div>
      {/* informations and booking section ends */}
    </div>
  );
};

export default DestinationDetailsPage;
