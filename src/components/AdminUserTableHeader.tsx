
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const AdminUserTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>User</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Roles</TableHead>
        <TableHead>Business</TableHead>
        <TableHead>Onboarding</TableHead>
        <TableHead>Joined</TableHead>
        <TableHead className="w-[70px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
