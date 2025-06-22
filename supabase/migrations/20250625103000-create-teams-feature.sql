-- Create the teams table
CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add comments to the teams table
COMMENT ON TABLE public.teams IS 'Stores team information';
COMMENT ON COLUMN public.teams.owner_id IS 'The user who owns and manages the team';

-- Create the team_members table
CREATE TABLE public.team_members (
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- Add comments to the team_members table
COMMENT ON TABLE public.team_members IS 'Links users to teams';

-- Enable Row Level Security for both tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for the 'teams' table
-- 1. Owners can do anything with their teams
CREATE POLICY "Team owners can manage their own teams"
  ON public.teams
  FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 2. Team members can view the teams they belong to
CREATE POLICY "Team members can view their own teams"
  ON public.teams
  FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for the 'team_members' table
-- 1. Team owners can manage their team's members
CREATE POLICY "Team owners can manage their team members"
  ON public.team_members
  FOR ALL
  USING (
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
    )
  );

-- 2. Users can view their own membership
CREATE POLICY "Users can view their own team membership"
  ON public.team_members
  FOR SELECT
  USING (user_id = auth.uid());

-- 3. Users can leave a team (delete their own membership)
CREATE POLICY "Users can leave their own teams"
  ON public.team_members
  FOR DELETE
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_teams_owner_id ON public.teams(owner_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id); 