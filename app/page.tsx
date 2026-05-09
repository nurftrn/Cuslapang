"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [courts, setCourts] = useState<any[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [selectedSport, setSelectedSport] = useState("")
  const [sports, setSports] = useState<any[]>([])

  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {

      // FETCH SPORTS
      const { data: sportsData, error: sportsError } =
        await supabase
          .from("sports")
          .select("*")

      if (sportsError) {
        console.log(sportsError)
      } else {
        setSports(sportsData || [])
      }

      // FETCH COURTS
      const { data: courtsData, error: courtsError } =
        await supabase
          .from("courts")
          .select(`
            *,
            sports (
              name,
              icon
            ),
            sport_centers (
              cities (
                name
              )
            )
          `)
              console.log(courts)
      if (courtsError) {
        console.log(courtsError)
      } else {
        setCourts(courtsData || [])
      }
    }

    fetchData()

  }, [])

  return (
    <div className="px-8 md:px-28 py-6">
      
      {/* HERO */}
      <div className="relative rounded-2xl overflow-hidden h-[300px] mb-10">
        <img src="/images/hero.jpeg" alt="Hero Sports Field" className="w-full h-full object-cover"/>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-10 text-white">
          <h1 className="text-4xl font-bold mb-3">Book Sports Fields Online,<br />Fast & Easy</h1>
          <p className="mb-5 text-base opacity-90">No need to visit in person, everything can be done here.</p>

          <div className="flex gap-3">
            <button onClick={() => setShowModal(true)} className="bg-white text-black px-5 py-2 rounded-full text-base hover:scale-105 transition">
              Book Now
            </button>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-bold mb-4">What do you want to play?</h1>
      
      {/* CATEGORIES */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {sports.map((sport, s) => (
          <div key={s} className="bg-gradient-to-br from-teal-200 to-yellow-200 p-6 rounded-2xl shadow hover:shadow-lg hover:scale-105 transition cursor-pointer"  
            onClick={() => { setSelectedSport(sport.name)
              // FILTER COURTS SESUAI SPORT
              const filtered = courts.filter(
                (court) =>
                  court.sports?.name?.toLowerCase() ===
                  sport.name.toLowerCase()
              )
              // AMBIL KOTA UNIK
              const cities = [
                ...new Set(
                  filtered
                    .map(
                      (court) =>
                        court.sport_centers?.cities?.name
                    )
                    .filter(Boolean)
                ),
              ] as string[]

              setAvailableCities(cities)
              setShowModal(true)
            }}>
            <h3 className="font-semibold text-base mb-10">
              {sport.name}
            </h3>
            <div className="text-9xl text-right">
              {sport.icon}
            </div>
          </div>
        ))}
      </div>

      {/* FIELD MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >

          <div
            className="bg-white p-6 rounded-xl w-[300px]"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 className="text-lg font-semibold mb-4">
              Select Location
            </h2>

            <div className="flex flex-col gap-3">
              {availableCities.map((city, i) => (
                <button
                  key={i}
                  onClick={() =>
                    router.push(
                      `/courts?city=${city.toLowerCase()}&sport=${selectedSport.toLowerCase()}`
                    )
                  }
                  className="bg-gray-100 p-2 rounded hover:bg-gray-200"
                >
                  {city}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-500"
            >
              Cancel
            </button>

          </div>

        </div>
      )}
    </div>
  );
}