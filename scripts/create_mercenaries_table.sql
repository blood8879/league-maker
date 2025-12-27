-- Create mercenaries table for Phase 3
CREATE TABLE IF NOT EXISTS public.mercenaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    position TEXT NOT NULL,
    level TEXT NOT NULL,
    introduction TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mercenaries_match_id ON public.mercenaries(match_id);
CREATE INDEX IF NOT EXISTS idx_mercenaries_user_id ON public.mercenaries(user_id);
CREATE INDEX IF NOT EXISTS idx_mercenaries_team_id ON public.mercenaries(team_id);
CREATE INDEX IF NOT EXISTS idx_mercenaries_status ON public.mercenaries(status);

-- Enable Row Level Security
ALTER TABLE public.mercenaries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view mercenaries" ON public.mercenaries
    FOR SELECT USING (true);

CREATE POLICY "Users can create mercenary applications" ON public.mercenaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Team captains can update mercenary status" ON public.mercenaries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = mercenaries.team_id
            AND team_members.user_id = auth.uid()
            AND team_members.role = 'captain'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mercenaries_updated_at BEFORE UPDATE ON public.mercenaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
