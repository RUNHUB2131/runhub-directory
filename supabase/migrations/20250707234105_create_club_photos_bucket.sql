-- Create club-photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('club-photos', 'club-photos', true);

-- Allow public read access to club photos
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'club-photos');

-- Allow authenticated users to upload club photos
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'club-photos');

-- Allow authenticated users to update club photos
CREATE POLICY "Authenticated Update" ON storage.objects
FOR UPDATE USING (bucket_id = 'club-photos');

-- Allow authenticated users to delete club photos
CREATE POLICY "Authenticated Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'club-photos');
