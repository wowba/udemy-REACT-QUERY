import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const { data, isFetching, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["sw-species"],
      queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    });

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {isFetching && (
        <div
          style={{
            position: "fixed",
            top: "5px",
            right: "5px",
          }}
        >
          Loading...
        </div>
      )}
      <InfiniteScroll
        hasMore={hasNextPage}
        loadMore={() => {
          if (!isFetching) fetchNextPage();
        }}
      >
        {data.pages.map((page) =>
          page.results.map((result) => (
            <Species
              key={result.name}
              name={result.name}
              language={result.language}
              averageLifespan={result.average_lifespan}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
