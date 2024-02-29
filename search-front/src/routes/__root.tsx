import { VITE_API_URL } from "@/CONSTANT";
import { ServerDataLoaded } from "@/components/ServerDataLoaded";
import { Button } from "@/components/ui/button";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const Links = [
  { name: "Recherche", path: "/" },
  { name: "Recommendations", path: "/recommendations" },
  { name: "Déja vu", path: "/deja-vu" },
];

const onReimport = () => {
  fetch(VITE_API_URL + "/import", {
    method: "POST",
  }).then((res) => res.json());
};

export const Route = createRootRoute({
  component: () => (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center gap-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2835/2835400.png"
              className="h-16"
              alt="Flowbite Logo"
            />
            <Button onClick={onReimport}>Re-import Data </Button>
          </div>
          <div className="block w-auto" id="navbar-default">
            <ul className="font-medium flex p-0 flex-row space-x-8 mt-0 border-0 bg-white dark:bg-gray-900 dark:border-gray-700">
              {Links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="[&.active]:font-bold block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <hr />
      <ServerDataLoaded />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
