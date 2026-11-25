import { NavLink } from 'react-router-dom';
import { Card } from './ui/Card';

export default function UserCard({ user }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">
        {user.name}
      </h2>

      {user.email && (
        <p className="mt-1 text-muted">
          {user.email}
        </p>
      )}

      <NavLink
        to={`/users/${user.id}`}
        className="mt-3 inline-block text-primary hover:underline"
      >
        View profile
      </NavLink>
    </Card>
  );
}