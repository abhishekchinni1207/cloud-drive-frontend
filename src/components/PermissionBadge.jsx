export default function PermissionBadge({ role }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs ${
        role === 'editor'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {role}
    </span>
  );
}
