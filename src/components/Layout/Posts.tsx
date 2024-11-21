import { useSelector } from "react-redux";
import { FETCH_FOLLOWS } from "../../graphql/queries/followQuery";
import { server_url, supabase_key } from "../../utils/constants";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { FETCH_POSTS_BY_USER_IDS } from "../../graphql/queries/posts";
import getRelativeTime from "../../utils/validateTime";
import { UPDATE_LIKES } from "../../graphql/mutations/posts";
import PostLoader from "../UI/PostLoader";
import { deletePostWithId } from "../../utils/apiUtils";

interface Post {
  id: string;
  title: string;
  caption: string;
  users: {
    username: string;
    profile_pic: string;
    id: string;
  };
  image_url: string;
  created_at: string;
  likes: string[];
}

function Posts({ postTrigger }: { postTrigger: boolean }) {
  const userData = useSelector((state: RootState) => state.auth.user);
  const [posts, setposts] = useState<Post[]>([]);
  const [trigger, setTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletePost, setDeletePost] = useState<string[]>([]);

  useEffect(() => {
    if (userData) {
      fetchPosts();
    }
  }, [userData, trigger, postTrigger]);

  const handleDeletePost = async (id: string) => {
    handleDeletePost(id);
    try {
      const response = await deletePostWithId(id);
      console.log(response);
      setTrigger((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (id: string) => {
    const updatedPosts = [...posts];
    const postIndex = updatedPosts.findIndex((post) => post.id === id);

    if (postIndex === -1) return;

    const post = updatedPosts[postIndex];

    const postLikes = post.likes || [];

    if (!postLikes.includes(userData?.id!)) {
      postLikes.push(userData?.id!);
    }

    post.likes = postLikes;

    setposts(updatedPosts);

    try {
      const response = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: UPDATE_LIKES,
          variables: {
            postId: id,
            likes: postLikes,
          },
        }),
      });

      const likeData = await response.json();
      if (likeData.errors) throw new Error(likeData.errors[0].message);
    } catch (error: any) {
      console.error(error);
      const revertedPosts = [...posts];
      revertedPosts[postIndex].likes = revertedPosts[postIndex].likes.filter(
        (likeId: string) => likeId !== userData?.id
      );
      setposts(revertedPosts);
    }
  };

  const handleUnlike = async (id: string) => {
    const updatedPosts = [...posts];
    const postIndex = updatedPosts.findIndex((post) => post.id === id);

    if (postIndex === -1) return;

    const post = updatedPosts[postIndex];

    const updatedLikes = post.likes.filter(
      (likeId: string) => likeId !== userData?.id
    );
    post.likes = updatedLikes;

    setposts(updatedPosts);

    try {
      const response = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: UPDATE_LIKES,
          variables: {
            postId: id,
            likes: updatedLikes,
          },
        }),
      });

      const likeData = await response.json();
      if (likeData.errors) throw new Error(likeData.errors[0].message);
    } catch (error: any) {
      console.error(error);
      const revertedPosts = [...posts];
      revertedPosts[postIndex].likes.push(userData?.id!);
      setposts(revertedPosts);
    }
  };

  const fetchPosts = async () => {
    const userId = userData?.id;

    try {
      setLoading(true);
      const followsResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: FETCH_FOLLOWS,
          variables: { userId },
        }),
      });

      const { data: followsData, errors: followsErrors } =
        await followsResponse.json();
      if (followsErrors) throw new Error(followsErrors[0].message);

      const follows = followsData.followsCollection.edges[0]?.node;

      if (!follows) throw new Error("No followers or following data found.");

      const userIds = [
        userId,
        ...(follows.follower_id || []),
        ...(follows.following_id || []),
      ];

      const postsResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: FETCH_POSTS_BY_USER_IDS,
          variables: { userIds },
        }),
      });

      const { data: postsData, errors: postsErrors } =
        await postsResponse.json();
      if (postsErrors) throw new Error(postsErrors[0].message);

      const posts = postsData.postsCollection.edges.map(
        (edge: any) => edge.node
      );

      setposts(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    if (deletePost.includes(id)) {
      const newArr = deletePost.filter((item) => item !== id);
      setDeletePost(newArr);
    } else setDeletePost([...deletePost, id]);
  };

  if (loading) return <PostLoader />;

  return (
    <div className="w-full flex justify-center">
      {posts.length === 0 && (
        <p className="nunito text-black absolute">
          Follow someone to see posts!!
        </p>
      )}
      <div className="border-s-4 border-[#eef2f5] w-[90%]">
        {posts.map((item) => (
          <div key={item.id} className="relative p-20">
            {item.users.id === userData?.id && (
              <>
                {deletePost.includes(item.id) && (
                  <div
                    onClick={() => handleDeletePost(item.id)}
                    className="flex items-center gap-2 absolute top-[1px] left-[392px] rounded shadow p-1 hover:cursor-pointer"
                  >
                    <Icon icon="mdi:delete-circle" color="black" />
                    <p className="nunito text-black text-sm">Delete Post</p>
                  </div>
                )}
                <div
                  onClick={() => handleDeleteClick(item.id)}
                  className="absolute top-0 left-[350px] hover:cursor-pointer hover:border rounded-full p-2"
                >
                  <Icon icon="charm:menu-kebab" color="#343232" />
                </div>
              </>
            )}
            <div className="absolute flex items-center left-[-20px] top-[-5px] gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-lg flex  items-center justify-center relative overflow-hidden">
                {item.users.profile_pic ? (
                  <img
                    src={item.users.profile_pic}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon
                    width={20}
                    icon="iconamoon:profile-bold"
                    style={{ color: "black" }}
                  />
                )}
              </div>
              <div>
                <div className="flex gap-2 items-center">
                  <p className="nunito text-[16px] text-black">
                    {item.users.username}
                  </p>
                  <p className="nunito text-[#343232] text-[14px] mb-1">
                    posted an update
                  </p>
                </div>
                <p className="nunito text-[#858383] text-[12px] mt-1">
                  {getRelativeTime(item.created_at)}
                </p>
              </div>
            </div>
            <p className="nunito text-[#343232] text-[14px] mb-5">
              {item.caption}
            </p>
            <img src={item.image_url} alt="" className="max-w-[300px]" />
            <div className="border-y-[1px] mt-4 w-[300px] py-3">
              {item.likes?.includes(userData?.id!) ? (
                <div
                  onClick={() => handleUnlike(item.id)}
                  className="flex items-cenetr gap-1 hover:cursor-pointer"
                >
                  <Icon icon="solar:like-bold" color="#6578f8" width={18} />
                  <p className="text-black nunito mt-[-2px] text-[#6578f8]">
                    Liked
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => handleLike(item.id)}
                  className="flex items-cenetr gap-1 hover:cursor-pointer"
                >
                  <Icon icon="solar:like-broken" color="#939393" width={18} />
                  <p className="text-black nunito mt-[-2px] text-[#939393]">
                    Like
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
