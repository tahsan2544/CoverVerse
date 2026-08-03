-- profiles extras
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS institution text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- user_preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text NOT NULL DEFAULT 'system',
  accent text,
  font_size text NOT NULL DEFAULT 'medium',
  density text NOT NULL DEFAULT 'comfortable',
  sidebar_collapsed boolean NOT NULL DEFAULT false,
  default_format text NOT NULL DEFAULT 'pdf',
  default_paper text NOT NULL DEFAULT 'a4',
  default_dpi integer NOT NULL DEFAULT 2,
  watermark boolean NOT NULL DEFAULT false,
  email_notifications boolean NOT NULL DEFAULT true,
  inapp_notifications boolean NOT NULL DEFAULT true,
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferences TO authenticated;
GRANT ALL ON public.user_preferences TO service_role;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own preferences" ON public.user_preferences
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_preferences_touch BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- covers
CREATE TABLE IF NOT EXISTS public.covers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled cover',
  subject text,
  template_id text NOT NULL,
  is_draft boolean NOT NULL DEFAULT true,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  thumbnail text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS covers_user_updated_idx ON public.covers (user_id, updated_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.covers TO authenticated;
GRANT ALL ON public.covers TO service_role;
ALTER TABLE public.covers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own covers" ON public.covers
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER covers_touch BEFORE UPDATE ON public.covers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- export_history
CREATE TABLE IF NOT EXISTS public.export_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_id uuid REFERENCES public.covers(id) ON DELETE SET NULL,
  title text,
  template_id text,
  format text NOT NULL DEFAULT 'pdf',
  paper text NOT NULL DEFAULT 'a4',
  dpi integer NOT NULL DEFAULT 2,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS export_history_user_idx ON public.export_history (user_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.export_history TO authenticated;
GRANT ALL ON public.export_history TO service_role;
ALTER TABLE public.export_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own exports" ON public.export_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own exports" ON public.export_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own exports" ON public.export_history
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ai_artwork gallery
CREATE TABLE IF NOT EXISTS public.ai_artwork (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  style text,
  image text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_artwork_user_idx ON public.ai_artwork (user_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.ai_artwork TO authenticated;
GRANT ALL ON public.ai_artwork TO service_role;
ALTER TABLE public.ai_artwork ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own artwork" ON public.ai_artwork
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'feedback',
  message text NOT NULL,
  page text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.feedback TO authenticated;
GRANT UPDATE ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own feedback" ON public.feedback
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own feedback or admin" ON public.feedback
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update feedback" ON public.feedback
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER feedback_touch BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- admin-managed custom templates
CREATE TABLE IF NOT EXISTS public.custom_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  layout text NOT NULL,
  palette text NOT NULL,
  orientation text NOT NULL DEFAULT 'portrait',
  font_id text,
  categories text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.custom_templates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_templates TO authenticated;
GRANT ALL ON public.custom_templates TO service_role;
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published templates" ON public.custom_templates
  FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert templates" ON public.custom_templates
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update templates" ON public.custom_templates
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete templates" ON public.custom_templates
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER custom_templates_touch BEFORE UPDATE ON public.custom_templates
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();