'use client';

const DashboardPageLoader = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-gray-300 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-lg">Loading Dashboard...</p>
    </div>
  );
};

export default DashboardPageLoader;
