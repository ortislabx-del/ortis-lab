import { UserRole } from "@/types/recipe";

const labels: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  production: "Production",
  viewer: "Lecteur",
};

const colors: Record<UserRole, string> = {
  admin: "badge-red",
  manager: "badge-blue",
  production: "badge-orange",
  viewer: "badge-gray",
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={colors[role]}>
      {labels[role]}
    </span>
  );
}
