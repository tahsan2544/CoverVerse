import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell, PageSection } from "@/components/AppShell";
import { RouteError, RouteNotFound } from "@/components/RouteError";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — CoverVerse" },
      { name: "description", content: "Update the name, institution and short bio that appear on your CoverVerse account." },
      { property: "og:title", content: "Your profile — CoverVerse" },
      { property: "og:description", content: "Manage your CoverVerse account details." },
    ],
  }),
  component: ProfilePage,
  errorComponent: RouteError,
  notFoundComponent: () => <RouteNotFound />,
});

function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, institution, bio")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      setDisplayName(data?.display_name ?? "");
      setInstitution(data?.institution ?? "");
      setBio(data?.bio ?? "");
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        institution: institution.trim() || null,
        bio: bio.trim() || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  }

  return (
    <AppShell title="Your profile" description="Details shown on your account">
      <div className="mx-auto max-w-2xl">
        <PageSection title="Account details" description={user?.email ?? undefined}>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ayesha Rahman"
                  disabled={loading}
                  maxLength={80}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">School / institution</Label>
                <Input
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Cambridge International School"
                  disabled={loading}
                  maxLength={120}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Short bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Class 10 · Science"
                  rows={3}
                  disabled={loading}
                  maxLength={300}
                />
              </div>
              <Button onClick={save} disabled={saving || loading}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </CardContent>
          </Card>
        </PageSection>
      </div>
    </AppShell>
  );
}