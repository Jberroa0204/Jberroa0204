"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    if (!res.ok) {
      setError("Invalid password");
      return;
    }
    router.push("/new");
  };

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="mb-2 text-xl font-semibold">Demo Access</h1>
      <p className="mb-6 text-sm text-slate-600">Enter the shared demo password to continue.</p>
      <form onSubmit={submit} className="space-y-3">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </Card>
  );
}
