export default function ShareLinkBox({ link }) {
  return (
    <div className="border p-2 rounded flex justify-between items-center">
      <span className="truncate">{link}</span>
      <button
        onClick={() => navigator.clipboard.writeText(link)}
        className="text-blue-600"
      >
        Copy
      </button>
    </div>
  );
}
