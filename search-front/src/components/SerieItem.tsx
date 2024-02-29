import { useState } from "react";
import { Button } from "./ui/button";
import { CrossCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { VITE_API_URL } from "../CONSTANT";

export const SerieCard = ({
  serie,
}: {
  serie: {
    title: string;
    score?: number;
    watched?: boolean;
  };
}) => {
  const { uuid } = useUserStore();
  const queryClient = useQueryClient();
  const markAsWatched = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watched", "search"] });
    },
    mutationFn: async (title: string) => {
      return fetch(VITE_API_URL + "/api/markAsWatched", {
        method: "POST",
        body: JSON.stringify({
          serie: title,
        }),
        headers: {
          User: uuid,
        },
      }).then((res) => res.json());
    },
  });
  const markAsUnwatched = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["watched", "search"],
      });
    },
    mutationFn: async (title: string) => {
      return fetch(VITE_API_URL + "/api/markAsUnwatched", {
        method: "POST",
        body: JSON.stringify({
          serie: title,
        }),
        headers: {
          User: uuid,
        },
      }).then((res) => res.json());
    },
  });
  const [isSeen, setIsSeen] = useState(serie.watched || false);

  return (
    <div className="w-72 rounded overflow-hidden border m-4 bg-white hover:bg-amber-50">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{serie.title}</div>
        {serie.score && <p>Rank: {serie.score}</p>}
      </div>
      <div className="px-6 pb-4">
        {isSeen ? (
          <Button
            onClick={() => {
              setIsSeen(false);
              markAsUnwatched.mutate(serie.title);
            }}
          >
            <CrossCircledIcon className="mr-2 h-4 w-4" /> Supprimer des vus
          </Button>
        ) : (
          <Button
            onClick={() => {
              setIsSeen(true);
              markAsWatched.mutate(serie.title);
            }}
          >
            <CheckCircledIcon className="mr-2 h-4 w-4" /> Marquer comme vu
          </Button>
        )}
      </div>
    </div>
  );
};
