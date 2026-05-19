"use client";
import { Button, Card, DateField, Label } from "@heroui/react";
import React, { useState } from "react";
import { authClient } from "../lib/auth-client";

const BookingCard = ({ destinationDetails }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [departureDate, setDepartureDate] = useState(null);
  const { price, _id, destinationName, imageUrl, country } = destinationDetails;

  const handleBooking = async () => {
    const bookingData = {
      userId: user?.id,
      userImage: user?.image,
      userName: user?.name,
      destinationId: _id,
      destinationName,
      price,
      imageUrl,
      country,
      departureDate: new Date(departureDate),
    };

    const { data: tokenData } = await authClient.token();

    const res = await fetch("http://localhost:5000/bookings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${tokenData?.token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (res.ok) {
      const responseFromBackend = await res.json();
      console.log("Database Response:", responseFromBackend);
      alert("booking added successfully!");
    } else {
      console.error("Server returned an error status:", res.status);
    }
  };

  return (
    <Card className="rounded-sm border">
      <p className="text-sm text-muted">Starting from</p>
      <h2 className="text-3xl font-bold text-cyan-500">${price}</h2>
      <p className="text-sm text-muted">per person</p>

      <DateField onChange={setDepartureDate} className="w-[256px]" name="date">
        <Label>Departure Date</Label>
        <DateField.Group>
          <DateField.Input>
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
        </DateField.Group>
      </DateField>
      <Button
        onClick={handleBooking}
        className={"w-full rounded-none bg-cyan-500"}
      >
        Book Now
      </Button>
    </Card>
  );
};

export default BookingCard;
