CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  city text NOT NULL,
  expected_price text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT name_len CHECK (char_length(name) BETWEEN 1 AND 100),
  CONSTRAINT email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT city_len CHECK (char_length(city) BETWEEN 1 AND 100),
  CONSTRAINT price_len CHECK (char_length(expected_price) BETWEEN 1 AND 50)
);
GRANT INSERT ON public.waitlist_signups TO anon, authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON public.waitlist_signups FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.waitlist_count()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT count(*)::int FROM public.waitlist_signups $$;
GRANT EXECUTE ON FUNCTION public.waitlist_count() TO anon, authenticated;