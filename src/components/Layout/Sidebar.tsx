import { useEffect } from "react";
import logo from "../../assets/logo.png";
import { Icon } from "@iconify/react";
import { server_url, supabase_key } from "../../utils/constants";
import { FETCH_CURRENT_FOLLOWING } from "../../graphql/queries/followQuery";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollow } from "../../redux/slices/followsSlice";
import { RootState } from "../../redux/store";

const category = [
  {
    id: 1,
    name: "Activity",
    icon: "material-symbols-light:browse-activity",
  },
  {
    id: 2,
    name: "Photos",
    icon: "ic:outline-photo",
  },
  {
    id: 3,
    name: "Watch",
    icon: "basil:play-outline",
  },
  {
    id: 4,
    name: "People",
    icon: "meteor-icons:user",
  },
  {
    id: 5,
    name: "Shop",
    icon: "iconoir:shop",
  },
  {
    id: 6,
    name: "Jobs",
    icon: "hugeicons:new-job",
  },
];

interface InputProps {
  userData: {
    id: string;
    full_name: string;
    username: string;
    profile_pic: string;
  };
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ userData, setToggle }: InputProps) {
  const dispatch = useDispatch();
  const followData = useSelector((state: RootState) => state.follows.data);

  useEffect(() => {
    const fetchFollowing = async () => {
      const followingResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: FETCH_CURRENT_FOLLOWING,
          variables: {
            userId: userData.id,
          },
        }),
      });
      const followingData = await followingResponse.json();
      if (followingData.errors)
        throw new Error(followingData.errors[0].message);
      const data = followingData.data.followsCollection.edges[0]?.node;
      console.log("data", data);
      dispatch(fetchFollow({ data: data }));
    };
    fetchFollowing();
  }, [userData?.id]);

  return (
    <div className="w-[450px] bg-[#f6f7f9] h-svh overflow-scroll scrollbar">
      <div className="h-[400px] bg-gradient-to-br from-zinc-700 to-zinc-900 flex flex-col items-center pt-[80px] relative">
        <img src={logo} alt="logo" width={80} />
        <p className="nunito text-2xl ">pingme</p>
        <p className="nunito text-[10px] mt-1">Social Network</p>
        <div className="bg-white h-[250px] w-[250px] rounded-md absolute top-[230px] flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex  items-center justify-center overflow-hidden border-2 border-[#ffff]">
            {userData?.profile_pic ? (
              <img
                src={userData?.profile_pic}
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
          <p className="nunito text-md mt-2 text-black">
            {userData?.full_name || userData?.username}
          </p>
          <div className="w-3/4 bg-[#cbd5e1] mt-3 h-[1px]" />
          <div className="flex gap-5 mt-2">
            <div className="flex flex-col items-center">
              <p className="nunito text-sm mt-2 text-black font-semibold">
                Followers
              </p>
              <p className="nunito text-md text-black">
                {followData.follower_id.length}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="nunito text-sm mt-2 text-black font-semibold">
                Following
              </p>
              <p className="nunito text-md text-black">
                {followData.following_id.length}
              </p>
            </div>
          </div>
          {userData &&
            !Object.values(userData).every(
              (value) => value !== null && value !== ""
            ) && (
              <p className="nunito text-sm text-center mt-2 text-black ">
                Your Profile Details are incomplete. <br />{" "}
                <span
                  className="underline hover:cursor-pointer"
                  onClick={() => setToggle(true)}
                >
                  Update now
                </span>
              </p>
            )}
        </div>
      </div>
      <div className="min-h-[200px] bg-[#f6f7f9] w-full p-5 pt-[130px] flex justify-center items-center">
        <div className="grid grid-cols-2 gap-10">
          {category.map((item) => (
            <div key={item.id} className="flex flex-col items-center  h-20">
              <Icon icon={item.icon} width={24} color="#828296" />
              <p className="nunito text-md text-[#828296]">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
