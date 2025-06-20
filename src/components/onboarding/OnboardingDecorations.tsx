
export const OnboardingDecorations = () => {
  return (
    <div className="fixed top-1/2 right-8 transform -translate-y-1/2 space-y-4 hidden lg:block">
      <div className="w-64 h-16 bg-white rounded-lg shadow-sm border flex items-center px-4 space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded mb-1"></div>
          <div className="h-2 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>
      
      <div className="w-64 h-16 bg-white rounded-lg shadow-sm border flex items-center px-4 space-x-3 ml-8">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded mb-1"></div>
          <div className="h-2 bg-gray-100 rounded w-3/4"></div>
        </div>
      </div>

      <div className="w-64 h-16 bg-white rounded-lg shadow-sm border flex items-center px-4 space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded mb-1"></div>
          <div className="h-2 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>

      <div className="w-64 h-16 bg-white rounded-lg shadow-sm border flex items-center px-4 space-x-3 ml-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded mb-1"></div>
          <div className="h-2 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};
