"use client";
import Link from "next/link";
import React from "react";
import { authClient } from "../lib/auth-client";
import { Avatar, Button } from "@heroui/react";

const NavBar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <nav className="grid grid-cols-3 bg-white p-5 items-center shadow-xs">
      <ul className="flex gap-4 justify-start">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/destination"}>Destinations</Link>
        </li>
        <li>
          <Link href={"/my-booking"}>My Booking</Link>
        </li>

        <li>
          <Link href={"/add-destination"}>Add Destination</Link>
        </li>
      </ul>

      <div className="text-center">
        <h1 className="text-5xl font-extrabold">
          <span className="bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-300 bg-clip-text text-transparent">
            Beyond Horizon
          </span>
        </h1>
      </div>

      <ul className="flex gap-4 items-center  justify-end">
        {user ? (
          <>
            <li>
              <Link href={"/profile"}>Profile</Link>
            </li>
            <li>{user.name}</li>
            <li>
              <Avatar>
                <Avatar.Image alt={user.name} src={user?.image} />
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar>
            </li>
            <li>
              <Button onClick={handleSignOut}>Sign Out</Button>{" "}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href={"/signin"}>Signin</Link>
            </li>
            <li>
              <Link href={"/signup"}>Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
