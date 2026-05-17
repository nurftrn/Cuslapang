export default function Loading() {
  return (
    <div className="px-8 md:px-28 py-10">
      <div className="animate-pulse">

        {/* TITLE */}
        <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>

        {/* SEARCH */}
        <div className="h-12 w-full bg-gray-200 rounded-xl mb-8"></div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((item) => (
            <div
              key={item}
              className="border rounded-2xl overflow-hidden"
            >
              <div className="h-48 bg-gray-200"></div>

              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded w-28"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}