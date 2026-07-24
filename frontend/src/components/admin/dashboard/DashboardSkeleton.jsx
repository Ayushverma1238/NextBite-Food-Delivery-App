const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl bg-white p-5 shadow">
    <div className="mb-4 h-5 w-24 rounded bg-slate-200"></div>
    <div className="mb-3 h-10 w-20 rounded bg-slate-300"></div>
    <div className="h-4 w-28 rounded bg-slate-200"></div>
  </div>
);

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 w-">
      {/* Header */}
      <div className="animate-pulse rounded-3xl bg-white p-6 shadow">
        <div className="h-8 w-72 rounded bg-slate-300"></div>
        <div className="mt-3 h-4 w-56 rounded bg-slate-200"></div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="animate-pulse rounded-3xl bg-white p-6 shadow lg:col-span-2">
          <div className="mb-5 h-6 w-48 rounded bg-slate-300"></div>

          <div className="h-80 rounded-2xl bg-slate-200"></div>
        </div>

        <div className="animate-pulse rounded-3xl bg-white p-6 shadow">
          <div className="mb-5 h-6 w-40 rounded bg-slate-300"></div>

          <div className="mx-auto h-72 w-72 rounded-full bg-slate-200"></div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-pulse rounded-3xl bg-white p-6 shadow">
          <div className="mb-5 h-6 w-40 rounded bg-slate-300"></div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4"
              >
                <div className="h-14 w-14 rounded-xl bg-slate-200"></div>

                <div className="flex-1">
                  <div className="h-4 w-40 rounded bg-slate-300"></div>
                  <div className="mt-2 h-3 w-24 rounded bg-slate-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-pulse rounded-3xl bg-white p-6 shadow">
          <div className="mb-5 h-6 w-40 rounded bg-slate-300"></div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4"
              >
                <div className="h-14 w-14 rounded-xl bg-slate-200"></div>

                <div className="flex-1">
                  <div className="h-4 w-40 rounded bg-slate-300"></div>
                  <div className="mt-2 h-3 w-24 rounded bg-slate-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="animate-pulse rounded-3xl bg-white p-6 shadow">
        <div className="mb-6 h-6 w-52 rounded bg-slate-300"></div>

        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-7 gap-4"
            >
              <div className="h-5 rounded bg-slate-200"></div>
              <div className="h-5 rounded bg-slate-200"></div>
              <div className="h-5 rounded bg-slate-200"></div>
              <div className="h-5 rounded bg-slate-200"></div>
              <div className="h-5 rounded bg-slate-200"></div>
              <div className="h-5 rounded bg-slate-200"></div>
              <div className="h-5 rounded bg-slate-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;