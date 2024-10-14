import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post, deleteMutation, updateMutation }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
    staleTime: 5000,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError)
    return (
      <div>
        <h3>Error</h3>
        <p>{error.toString()}</p>
      </div>
    );

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isPending && <div>Deleting...</div>}
      {deleteMutation.isSuccess && <div>Delete Mutation Complete</div>}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isPending && <div>Updating...</div>}
      {updateMutation.isSuccess && <div>Update Mutation Complete</div>}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
