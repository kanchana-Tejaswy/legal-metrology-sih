-- =====================================================================
-- Supabase Storage Buckets Configuration for Legal Metrology System
-- =====================================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('documents', 'documents', false),
    ('photos', 'photos', true),
    ('evidence', 'evidence', false),
    ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
-- Documents: Only authenticated owners can upload, LMO/GATC/Admin can read
CREATE POLICY "Owners can upload documents" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authorized verifiers and admins can read documents" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'documents');

-- Photos: Public read for instrument photos, authenticated upload
CREATE POLICY "Authenticated users can upload photos" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Public can view photos" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'photos');

-- Evidence: Only verifiers and admins can upload and view
CREATE POLICY "Verifiers can upload evidence" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'evidence');

CREATE POLICY "Verifiers and admins can read evidence" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'evidence');

-- Certificates: Public read (for QR verification download)
CREATE POLICY "Public read certificates" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'certificates');

CREATE POLICY "System can upload certificates" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'certificates');
