import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  user_id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  members: TeamMember[];
}

export const teamService = {
  async getTeamsForCurrentUser(): Promise<Team[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name, owner_id')
      .eq('owner_id', user.id);

    if (teamsError) throw teamsError;

    // For each team, get its members' user_ids
    const teamMemberPromises = teams.map(async (team) => {
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', team.id);

      if (membersError) throw membersError;

      const userIds = members.map(m => m.user_id);
      if (userIds.length === 0) {
        return { ...team, members: [] };
      }

      // Get member details from the users and profiles tables
      const { data: users, error: usersError } = await supabase.rpc('admin_get_all_users');
      if (usersError) throw usersError;

      const memberDetails = users
        .filter(u => userIds.includes(u.id))
        .map(u => ({
          user_id: u.id,
          email: u.email,
          first_name: u.raw_user_meta_data?.first_name,
          last_name: u.raw_user_meta_data?.last_name,
        }));
        
      return { ...team, members: memberDetails };
    });

    return Promise.all(teamMemberPromises);
  },

  async createTeam(name: string): Promise<Team> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('teams')
      .insert({ name, owner_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return { ...data, members: [] };
  },

  async addMemberToTeam(teamId: string, userId: string) {
    const { error } = await supabase
      .from('team_members')
      .insert({ team_id: teamId, user_id: userId });
    if (error) throw error;
  },

  async removeMemberFromTeam(teamId: string, userId: string) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);
    if (error) throw error;
  },

  async updateTeamName(teamId: string, name: string) {
    const { error } = await supabase
      .from('teams')
      .update({ name })
      .eq('id', teamId);
    if (error) throw error;
  },

  async deleteTeam(teamId: string) {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);
    if (error) throw error;
  }
}; 