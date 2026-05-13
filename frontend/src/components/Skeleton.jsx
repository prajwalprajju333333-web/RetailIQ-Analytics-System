// Skeleton loader component for professional loading states

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-6 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="flex-1 h-8 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonTable = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="h-6 bg-gray-300 rounded w-48"></div>
    </div>
    <div className="p-6 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-gray-300 rounded flex-1"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 3, columns = 3 }) => {
  const columnClasses = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };
  
  return (
    <div className={`grid grid-cols-1 ${columnClasses[columns] || 'md:grid-cols-3'} gap-6`}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
