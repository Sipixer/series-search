import { SerieCard } from "@/components/SerieItem";
import { Input } from "@/components/ui/input";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { VITE_API_URL } from "@/CONSTANT";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [search, setSearch] = useState("");
  const { uuid } = useUserStore();
  const [series, setSeries] = useState<
    {
      title: string;
      score: number;
      watched?: boolean;
    }[]
  >([]);

  useEffect(() => {
    if (search.length === 0) return setSeries([]);
    fetch(VITE_API_URL + "/api/search/" + search, {
      headers: {
        User: uuid,
      },
    })
      .then((res) => res.json())
      .then((data) => setSeries(data));
  }, [search, uuid]);
  return (
    <div className="flex justify-center flex-col items-center p-10">
      <div className="w-96 flex gap-10 flex-col">
        <h1 className="text-xl font-bold text-center">
          Rechercher votre serie
        </h1>
        <Input
          type="text"
          placeholder="Breaking Bad"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-10 mt-10 flex-wrap">
        {series.map((serie) => (
          <SerieCard key={serie.title} serie={serie} />
        ))}
      </div>
    </div>
  );
}
