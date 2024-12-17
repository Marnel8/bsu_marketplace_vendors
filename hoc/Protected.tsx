"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, useToast } from "@/hooks/use-toast";
import { useFetchCurrentUser } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    data: user,
    isPending: isLoading,
    error,
    isError,
  } = useFetchCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth");
    }
    if (isError) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  }, [isLoading, user, isError, error]);

  if (!user && !isLoading) {
    return <p>Loading...</p>;
  }

  return <>{user && children}</>;
};

export default ProtectedRoute;
