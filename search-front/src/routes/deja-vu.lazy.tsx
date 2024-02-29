import { SerieCard } from "@/components/SerieItem";
import { useUserStore } from "@/store/userStore";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createLazyFileRoute("/deja-vu")({
  component: DejaVu,
});

function DejaVu() {
  const { uuid } = useUserStore();
  const query = useQuery({
    queryKey: [`watched`],
    queryFn: async () => {
      return fetch("http://localhost:3000/api/watched", {
        headers: {
          User: uuid,
        },
      })
        .then((res) => res.json())
        .then((data) => data as string[]);
    },
  });
  return (
    <div className="flex justify-center flex-col items-center p-10">
      <div className="w-96 flex gap-10 flex-col">
        <h1 className="text-xl font-bold text-center">
          Serie que vous avez deja vu
        </h1>
      </div>
      <div className="flex gap-10 mt-10 flex-wrap">
        {query.data?.map((serie, index) => (
          <SerieCard
            key={index}
            serie={{
              title: serie,
              watched: true,
            }}
          />
        ))}
      </div>
    </div>
  );
}
