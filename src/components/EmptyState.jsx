
export default function EmptyState({ image, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center
      h-[60vh] text-center text-gray-600 dark:text-gray-400">
      <img src={image} alt={title} className="w-48 mb-6" />
      <h2 className="text-lg font-medium mb-2">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
  );
}
