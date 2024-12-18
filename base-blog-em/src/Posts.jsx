import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";

const MAX_POST_PAGE = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const goNextPage = () => setCurrentPage((prev) => prev + 1);
  const goPrevPage = () => setCurrentPage((prev) => prev - 1);

  const [selectedPost, setSelectedPost] = useState(null);

  // useQuery는 다양한 값을 받는다.
  // isLoading과 isFetching 차이
  // - isFetching
  // - 비동기 쿼리가 아직 해결되지 않음 -> 페이징 등을 사용할 때 중요함.
  // - isLoading
  // - 캐시된 데이터도 없고, 비동기 쿼리도 해결되지 않음.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", currentPage], // 쿼리키는 항상 배열로 받는다, v4 이상에서!
    queryFn: () => fetchPosts(currentPage), // 데이터를 받아오기 위해 실행할 함수
    staleTime: 5000, // staleTime의 기본값은 0
  });

  // 데이터 prefetch
  // 현재 페이지가 변경될 때 마다 useQueryClient를 이용해 미리 다음 페이지의 데이터를 불러온다
  const quertClient = useQueryClient();
  useEffect(() => {
    const nextPage = currentPage + 1;
    if (nextPage > MAX_POST_PAGE) return;

    quertClient.prefetchQuery({
      queryKey: ["posts", nextPage],
      queryFn: () => fetchPosts(nextPage),
      staleTime: 5000,
    });
  }, [currentPage, quertClient]);

  // Mutation
  // Mutation은 사용한 뒤, 리셋되어야 한다!
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });

  if (isLoading) {
    return <h3>loading</h3>;
  }

  if (isError) {
    return <h3> error </h3>;
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              updateMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={goPrevPage}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= MAX_POST_PAGE} onClick={goNextPage}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updateMutation={updateMutation}
        />
      )}
    </>
  );
}
