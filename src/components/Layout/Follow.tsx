import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_CURRENT_FOLLOWING,
  UPDATE_CURRENT_FOLLOWER,
  UPDATE_CURRENT_FOLLOWING,
} from "../../graphql/queries/followQuery";
import { RootState } from "../../redux/store";
import { server_url, supabase_key } from "../../utils/constants";
import { Icon } from "@iconify/react";
import { updateFollowing } from "../../redux/slices/followsSlice";

interface UserNode {
  id: string;
  full_name: string;
  username: string;
}

interface User {
  node: UserNode;
}

interface FollowProps {
  users: User[];
  postTrigger: boolean;
  setFollow: (value: boolean) => void;
  setPostTrigger: (value: boolean) => void;
}

function Follow({
  users,
  setFollow,
  setPostTrigger,
  postTrigger,
}: FollowProps) {
  const userData = useSelector((state: RootState) => state.auth.user);
  const followData = useSelector((state: RootState) => state.follows.data);
  const dispatch = useDispatch();

  const handleFollow = async (followedUserId: string) => {
    try {
      const followingResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: FETCH_CURRENT_FOLLOWING,
          variables: {
            userId: userData?.id,
          },
        }),
      });

      const followerResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: FETCH_CURRENT_FOLLOWING,
          variables: {
            userId: followedUserId,
          },
        }),
      });

      const followingData = await followingResponse.json();
      const followerData = await followerResponse.json();
      if (followingData.errors)
        throw new Error(followingData.errors[0].message);
      if (followerData.errors) throw new Error(followerData.errors[0].message);

      const currentFollowing =
        followingData.data.followsCollection.edges[0]?.node.following_id || [];
      const currentFollower =
        followerData.data.followsCollection.edges[0]?.node.follower_id || [];

      const updatedFollowing = [...currentFollowing, followedUserId];
      const updatedFollower = [...currentFollower, userData?.id];
      dispatch(updateFollowing({ following_id: updatedFollowing }));

      const updateFollowingResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: UPDATE_CURRENT_FOLLOWING,
          variables: {
            userId: userData?.id,
            following_id: updatedFollowing,
          },
        }),
      });

      const updateFollowerResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: UPDATE_CURRENT_FOLLOWER,
          variables: {
            userId: followedUserId,
            follower_id: updatedFollower,
          },
        }),
      });
      const updateFollowingData = await updateFollowingResponse.json();
      const updateFollowerData = await updateFollowerResponse.json();

      if (updateFollowingData.errors)
        throw new Error(updateFollowingData.errors[0].message);
      if (updateFollowerData.errors)
        throw new Error(updateFollowerData.errors[0].message);
      setPostTrigger(!postTrigger);
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleUnfollow = async (unfollowedUserId: string) => {
    try {
      const followingResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: FETCH_CURRENT_FOLLOWING,
          variables: {
            userId: userData?.id,
          },
        }),
      });

      const followerResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: FETCH_CURRENT_FOLLOWING,
          variables: {
            userId: unfollowedUserId,
          },
        }),
      });

      const followingData = await followingResponse.json();
      const followerData = await followerResponse.json();

      if (followingData.errors)
        throw new Error(followingData.errors[0].message);
      if (followerData.errors) throw new Error(followerData.errors[0].message);

      const currentFollowing =
        followingData.data.followsCollection.edges[0]?.node.following_id || [];
      const currentFollower =
        followerData.data.followsCollection.edges[0]?.node.follower_id || [];

      const updatedFollowing = currentFollowing.filter(
        (id: string) => id !== unfollowedUserId
      );
      dispatch(updateFollowing({ following_id: updatedFollowing }));

      const updatedFollower = currentFollower.filter(
        (id: string) => id !== userData?.id
      );

      const updateFollowingResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: UPDATE_CURRENT_FOLLOWING,
          variables: {
            userId: userData?.id,
            following_id: updatedFollowing,
          },
        }),
      });

      const updateFollowerResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: UPDATE_CURRENT_FOLLOWER,
          variables: {
            userId: unfollowedUserId,
            follower_id: updatedFollower,
          },
        }),
      });

      const updateFollowingData = await updateFollowingResponse.json();
      const updateFollowerData = await updateFollowerResponse.json();

      if (updateFollowingData.errors)
        throw new Error(updateFollowingData.errors[0].message);
      if (updateFollowerData.errors)
        throw new Error(updateFollowerData.errors[0].message);
      setPostTrigger(!postTrigger);
    } catch (error: any) {
      console.error("Error during unfollow:", error);
    }
  };

  console.log(users);

  return (
    <div className="shadow-md rounded-lg bg-[#ffff] z-50 w-[300px] max-h-[300px] absolute top-[90px] right-[50px] p-5 flex flex-col gap-2 overflow-scroll scrollbar">
      <Icon
        width={20}
        icon="ic:round-close"
        style={{ color: "black" }}
        className="absolute top-2 right-2 hover:cursor-pointer"
        onClick={() => setFollow(false)}
      />
      {users
        .filter((item) => item.node.id !== userData?.id)
        .map((item) => (
          <div className="flex items-center gap-2 w-full" key={item.node.id}>
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center relative ">
              <Icon
                width={20}
                icon="iconamoon:profile-bold"
                style={{ color: "black" }}
              />
            </div>
            <p className="nunito text-[14px] text-black">
              {item.node.username}
            </p>
            {followData.following_id.includes(item.node.id) ? (
              <div
                onClick={() => handleUnfollow(item.node.id)}
                className="group w-[80px] h-[25px] absolute right-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 overflow-hidden shadow-lg flex items-center justify-center hover:cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
                <button className="relative text-sm bottom-[2px] z-10">
                  Unfollow
                </button>
              </div>
            ) : (
              <div
                onClick={() => handleFollow(item.node.id)}
                className="group w-[80px] h-[25px] absolute right-8 rounded-full bg-gradient-to-r from-purple-700 to-purple-500 overflow-hidden shadow-lg flex items-center justify-center hover:cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
                <button className="relative text-sm bottom-[2px] z-10">
                  Follow
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default Follow;
