
export const OnboardingDecorations = () => {
  return (
    <div className="fixed top-1/2 right-8 transform -translate-y-1/2 space-y-6 hidden lg:block">
      <div className="w-72 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center px-6 space-x-4 hover:shadow-xl transition-shadow duration-300">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 rounded-full"></div>
          <div className="h-2 bg-slate-100 rounded-full w-4/5"></div>
        </div>
      </div>
      
      <div className="w-72 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center px-6 space-x-4 ml-8 hover:shadow-xl transition-shadow duration-300">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 rounded-full"></div>
          <div className="h-2 bg-slate-100 rounded-full w-3/4"></div>
        </div>
      </div>

      <div className="w-72 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center px-6 space-x-4 hover:shadow-xl transition-shadow duration-300">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 rounded-full"></div>
          <div className="h-2 bg-slate-100 rounded-full w-2/3"></div>
        </div>
      </div>

      <div className="w-72 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center px-6 space-x-4 ml-4 hover:shadow-xl transition-shadow duration-300">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 rounded-full"></div>
          <div className="h-2 bg-slate-100 rounded-full w-5/6"></div>
        </div>
      </div>
    </div>
  );
};
