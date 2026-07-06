-- Seed or update the admin password
INSERT INTO public.admin_settings (key, value)
VALUES ('admin_password', 'NXTPruthwiraj@26')
ON CONFLICT (key) 
DO UPDATE SET value = EXCLUDED.value, updated_at = now();
