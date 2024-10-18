import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["sw-people"],
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
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) {
            fetchNextPage();
          }
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((page) =>
          page.results.map((result) => (
            <Person
              key={result.name}
              name={result.name}
              hairColor={result.hair_color}
              eyeColor={result.eye_color}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
