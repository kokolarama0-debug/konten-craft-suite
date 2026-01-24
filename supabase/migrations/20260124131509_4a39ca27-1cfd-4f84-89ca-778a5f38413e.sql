-- Add user_id column to generated_images
ALTER TABLE public.generated_images 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to content_drafts
ALTER TABLE public.content_drafts 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX idx_generated_images_user_id ON public.generated_images(user_id);
CREATE INDEX idx_content_drafts_user_id ON public.content_drafts(user_id);

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all access to generated_images" ON public.generated_images;
DROP POLICY IF EXISTS "Allow all access to content_drafts" ON public.content_drafts;

-- Create secure RLS policies for generated_images
CREATE POLICY "Users can view their own images"
ON public.generated_images
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images"
ON public.generated_images
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
ON public.generated_images
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
ON public.generated_images
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create secure RLS policies for content_drafts
CREATE POLICY "Users can view their own drafts"
ON public.content_drafts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts"
ON public.content_drafts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
ON public.content_drafts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
ON public.content_drafts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);