import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building2, UserPlus, UserMinus, Users, Crown, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BusinessMember {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  user: {
    email: string;
    profiles: {
      first_name: string;
      last_name: string;
      business_name: string;
    } | null;
  };
}

interface BusinessMembershipManagerProps {
  businessId: string;
  businessName: string;
  userRole: string;
}

export const BusinessMembershipManager: React.FC<BusinessMembershipManagerProps> = ({
  businessId,
  businessName,
  userRole
}) => {
  const [members, setMembers] = useState<BusinessMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isInviting, setIsInviting] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const canManageMembers = userRole === 'owner' || userRole === 'admin';

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_users')
        .select(`
          id,
          user_id,
          role,
          created_at,
          user:users!inner(
            email,
            profiles(first_name, last_name, business_name)
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load team members');
        return;
      }

      // Transform the data to match our interface
      const transformedData: BusinessMember[] = (data || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        role: item.role,
        created_at: item.created_at,
        user: {
          email: item.user.email,
          profiles: item.user.profiles?.[0] || null
        }
      }));

      setMembers(transformedData);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsInviting(true);
    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteEmail.trim())
        .maybeSingle();

      if (userError || !userData) {
        toast.error('User not found. Please make sure they have an account.');
        return;
      }

      // Check if user is already a member
      const existingMember = members.find(m => m.user_id === userData.id);
      if (existingMember) {
        toast.error('User is already a member of this business');
        return;
      }

      // Add user to business
      const { error: inviteError } = await supabase
        .from('business_users')
        .insert({
          business_id: businessId,
          user_id: userData.id,
          role: inviteRole
        });

      if (inviteError) {
        console.error('Error inviting member:', inviteError);
        toast.error('Failed to invite member');
        return;
      }

      toast.success('Member invited successfully');
      setInviteEmail('');
      setInviteRole('member');
      fetchMembers();
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error('Failed to invite member');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${memberEmail} from the team?`)) {
      return;
    }

    setIsRemoving(memberId);
    try {
      const { error } = await supabase
        .from('business_users')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('Error removing member:', error);
        toast.error('Failed to remove member');
        return;
      }

      toast.success('Member removed successfully');
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    } finally {
      setIsRemoving(null);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('business_users')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) {
        console.error('Error updating role:', error);
        toast.error('Failed to update role');
        return;
      }

      toast.success('Role updated successfully');
      fetchMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3" />;
      case 'admin':
        return <Shield className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [businessId]);

  if (!canManageMembers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            You need admin or owner permissions to manage team members.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Team Members - {businessName}
        </CardTitle>
        <CardDescription>
          Manage who has access to your business data and customers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite New Member */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Invite New Member</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={isInviting}
              />
            </div>
            <div>
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  {userRole === 'owner' && (
                    <SelectItem value="owner">Owner</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleInviteMember}
                disabled={isInviting || !inviteEmail.trim()}
                className="w-full"
              >
                {isInviting ? (
                  'Inviting...'
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Current Members</Label>
          {loading ? (
            <div className="text-center py-8">Loading members...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No members found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">
                          {member.user.profiles?.first_name && member.user.profiles?.last_name
                            ? `${member.user.profiles.first_name} ${member.user.profiles.last_name}`
                            : 'Unknown User'
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {userRole === 'owner' && member.role !== 'owner' && (
                          <Select
                            value={member.role}
                            onValueChange={(newRole) => handleUpdateRole(member.id, newRole)}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {member.role !== 'owner' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id, member.user.email)}
                            disabled={isRemoving === member.id}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 