-- Add featured_image_url column for rectangular (16:9) card/preview images
ALTER TABLE articles ADD COLUMN featured_image_url TEXT;
