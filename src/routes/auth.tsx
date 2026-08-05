import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · CoverVerse" },
      { name: "description", content: "Sign in to CoverVerse to sync your cover pages, AI artwork credits and account settings." },
      { property: "og:title", content: "Sign in · CoverVerse" },
      { property: "og:description", content: "Access your CoverVerse account to design assignment cover pages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/create", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/create", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function signIn() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error("Couldn't sign in", { description: error.message });
  }

  async function signUp() {
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) {
      toast.error("Couldn't create the account", { description: error.message });
      return;
    }
    if (!data.session) {
      setSent(true);
      toast.success("Check your email to confirm your address");
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (res.error) toast.error("Google sign-in failed", { description: res.error.message });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-subtle px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-hero text-white shadow-glow">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight">CoverVerse</span>
        </Link>

        <Card className="shadow-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-xl">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <p className="text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Open it to
                finish setting up your account, then come back here to sign in.
              </p>
            ) : (
              <Tabs defaultValue="signin">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-4 space-y-3">
                  <EmailFields email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
                  <Button onClick={signIn} disabled={busy} className="w-full bg-gradient-hero text-white shadow-glow">
                    {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null} Sign in
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="mt-4 space-y-3">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ayesha Rahman" className="mt-1" />
                  </div>
                  <EmailFields email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
                  <Button onClick={signUp} disabled={busy} className="w-full bg-gradient-hero text-white shadow-glow">
                    {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null} Create account
                  </Button>
                </TabsContent>
              </Tabs>
            )}

            {!sent && (
              <>
                <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
                </div>
                <Button variant="outline" className="w-full" onClick={google}>
                  Continue with Google
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          You can also{" "}
          <Link to="/create" className="underline underline-offset-4">
            keep designing without an account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function EmailFields({
  email,
  setEmail,
  password,
  setPassword,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
}) {
  return (
    <>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1" />
      </div>
    </>
  );
}