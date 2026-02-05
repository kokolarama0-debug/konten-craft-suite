-- Add aspect_ratio column to video_projects table
ALTER TABLE public.video_projects
ADD COLUMN aspect_ratio text NOT NULL DEFAULT '16:9';