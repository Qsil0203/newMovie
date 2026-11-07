import { useEffect, useState } from "react";
import type { Movie } from "../../server/src/types/movie";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true)

   useEffect(() => {
    fetch("/api/movies")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при получении данных")
        return res.json()
      })
      .then((data) => {
        setMovies(data.items || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Ошибка на клиенте:", err)
        setLoading(false)
      })
  }, [])


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 p-4 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">КиноКаталог</h1>
          <form className="flex gap-2" onSubmit={(event) => event.preventDefault()}>
            <input 
              type="search" 
              aria-label="Поиск фильмов" 
              placeholder="Название фильма" 
              className="min-w-0 w-40 rounded bg-white px-3 py-2 text-sm text-black sm:w-64" 
            />
            <button type="submit" className="rounded bg-orange-500 px-4 py-2 text-sm">
              Найти
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <h2 className="mt-4 text-2xl font-bold">Популярные коллекции</h2>

        {loading ? (
          <div className="text-center py-10 font-medium">Загрузка фильмов...</div>
        ) : (
          <div>
            {movies.length > 0 && (
              <div className="mx-auto max-w-4xl my-10 px-12">
                <Carousel plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]} className="w-full">
                  <CarouselContent>
                    {movies.slice(0, 6).map((movie) => (
                      <CarouselItem key={`carousel-${movie.kinopoiskId}`} className="basis-1/1 sm:basis-1/2 md:basis-1/3">
                        <div className="p-1">
                          <Card className="overflow-hidden relative group cursor-pointer">
                            <CardContent className="flex aspect-[16/10] items-center justify-center p-0 relative">
                              {movie.posterUrlPreview ? (
                                <>
                                  <img 
                                    src={movie.posterUrlPreview} 
                                    alt={movie.nameRu || "Постер фильма"} 
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                  <span className="absolute bottom-3 left-3 right-3 text-white text-sm font-bold line-clamp-2 drop-shadow-md">
                                    {movie.nameRu || movie.nameOriginal}
                                  </span>
                                </>
                              ) : (
                                <div className="text-sm text-gray-500">Нет постера</div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {movies.map((movie) => (
                <div key={movie.kinopoiskId} className="overflow-hidden rounded bg-white shadow-sm border border-gray-200">
                  <div className="relative aspect-[2/3] w-full bg-gray-200">
                    {movie.posterUrlPreview ? (
                      <img 
                        src={movie.posterUrlPreview} 
                        alt={movie.nameRu || "Постер фильма"} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        Нет постера
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="font-bold block text-sm line-clamp-2 min-h-[40px]">
                      {movie.nameRu || movie.nameOriginal || movie.nameEn}
                    </span>
                    <p className="mt-1 text-xs text-gray-500">
                      {movie.year ? `${movie.year} год` : "Год неизвестен"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 truncate">
                      {movie.genres?.map(g => g.genre).join(', ') || "Жанры отсутствуют"}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-gray-700">
                      Рейтинг: {movie.ratingKinopoisk ?? "нет оценки"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
