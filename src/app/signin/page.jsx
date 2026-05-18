"use client";
import React from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { authClient } from "../../lib/auth-client";
const SignInPage = () => {
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userInfo = Object.fromEntries(formData.entries());
    const { data, error } = await authClient.signIn.email({
      email: userInfo.email,
      password: userInfo.password,
    });
    if (error) {
      console.error("Sign In error:", error.message);
      alert(error.message || "problem signin");
      return;
    }
    if (data) {
      alert("Signin successfully! 🎉");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-5">
      <div className="text-center">
        <h1 className="text-2xl">Signin To Your Account</h1>
      </div>
      <Card className="border">
        <Form onSubmit={onSubmit} className="flex w-96 flex-col gap-4">
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>
          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input placeholder="Enter your password" />
            <Description>
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError />
          </TextField>

          <div className="flex gap-2">
            <Button type="submit" className={"w-full justify-center"}>
              signin
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignInPage;
