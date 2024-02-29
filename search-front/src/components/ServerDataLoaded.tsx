import { useState, useEffect } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "./ui/progress";
import { ReloadIcon } from "@radix-ui/react-icons";

export function ServerDataLoaded() {
  const [status, setStatus] = useState<{
    loaded: boolean;
    progress?: number;
    total?: number;
  }>({
    loaded: true,
  });

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/status");

    eventSource.onmessage = (event) => {
      const json = JSON.parse(event.data);
      setStatus(json);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const onImport = () => {
    fetch("http://localhost:3000/import", {
      method: "POST",
    }).then((res) => res.json());
  };

  return (
    <AlertDialog open={!status.loaded}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Données non importé</AlertDialogTitle>
          {status.progress !== status.total ? (
            <AlertDialogDescription>
              Importation des données dans ElasticSearch...
              <Progress
                value={((status.progress || 1) / (status.total || 10)) * 100}
                max={100}
              />
              <p>
                {status.progress} / {status.total}
              </p>
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription>
              Le serveur n'a pas importer les données dans ElasticSearch.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {status.progress !== status.total ? (
            <AlertDialogAction disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Chargement
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={onImport}>
              Importer les données
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
