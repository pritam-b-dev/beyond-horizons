import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaExternalLinkAlt, FaMapMarkerAlt } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

const DestinationCard = ({ singleDestination }) => {
  const { _id, imageUrl, price, country, destinationName, duration } =
    singleDestination;
  return (
    <div className="border p-8 rounded-md space-y-3">
      <Image
        alt={destinationName}
        src={imageUrl}
        height={1000}
        width={1000}
        className="w-50 h-50  mx-auto"
      />
      <div className="flex gap-2 items-center">
        <FaMapMarkerAlt /> <span>{country}</span>
      </div>
      <div className="flex justify-between">
        <h1>{destinationName}</h1>
        <span>${price}/person</span>
      </div>
      <div className="flex gap-3 items-center">
        <SlCalender /> <span>{duration}</span>
      </div>
      <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/destination/${_id}`}>
        <Button variant="ghost" className={"mt-1 text-cyan-500 "}>
          Book Now <FaExternalLinkAlt />
        </Button>
      </Link>
    </div>
  );
};

export default DestinationCard;
