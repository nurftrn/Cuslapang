export default function Loading() {
  return (
    <div className="px-8 md:px-28 py-10">

      {/* TITLE */}
      <div className="h-12 w-[320px] bg-gray-200 rounded animate-pulse mb-3"></div>

      <div className="h-6 w-[500px] bg-gray-200 rounded animate-pulse mb-8"></div>

      {/* FILTER BUTTON */}
      <div className="flex gap-4 mb-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 w-28 rounded-full bg-gray-200 animate-pulse"
          ></div>
        ))}
      </div>

      {/* CARDS */}
      <div className="space-y-6">

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border rounded-3xl overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">

              {/* IMAGE */}
              <div className="lg:w-[320px] h-[250px] bg-gray-200 animate-pulse"></div>

              {/* CONTENT */}
              <div className="flex-1 p-7">

                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>

                <div className="h-10 w-[300px] bg-gray-200 rounded animate-pulse mb-4"></div>

                <div className="space-y-3 mb-6">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* BADGES */}
                <div className="flex gap-3 mb-6 flex-wrap">
                  {[1, 2, 3, 4].map((b) => (
                    <div
                      key={b}
                      className="h-10 w-28 rounded-full bg-gray-200 animate-pulse"
                    ></div>
                  ))}
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-4">
                  <div className="h-12 w-40 rounded-full bg-gray-200 animate-pulse"></div>

                  <div className="h-12 w-44 rounded-full bg-gray-200 animate-pulse"></div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}