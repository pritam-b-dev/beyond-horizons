import React from "react";
import DestinationCard from "../../components/DestinationCard";

const AllDestinationPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/destination`);
  const allDestination = await res.json();
  console.log(allDestination);
  return (
    <div className="max-w-7xl mx-auto my-5">
      <h1 className="my-5 font-bold text-2xl">Explore all Destinations</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {allDestination.map((singleDestination) => (
          <DestinationCard
            key={singleDestination._id}
            singleDestination={singleDestination}
          />
        ))}
      </div>
    </div>
  );
};

export default AllDestinationPage;
