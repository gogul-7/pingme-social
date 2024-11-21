import HomeNav from "./HomeNav";
import { Icon } from "@iconify/react";
import Sidebar from "./Sidebar";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Profile from "./Profile";
import { server_url, supabase_key } from "../../utils/constants";
import { FETCH_USER_BY_IDS, FETCH_USERS } from "../../graphql/queries/users";
import { login } from "../../redux/slices/authSlice";
import { CREATE_POST } from "../../graphql/mutations/posts";
import Posts from "./Posts";
import Follow from "./Follow";
import { FETCH_FOLLOWS } from "../../graphql/queries/followQuery";
import Loader from "../UI/Loader";
import { handleFetchUSer, handleUpload } from "../../utils/apiUtils";

interface Tag {
  node: {
    id: string;
    username: string;
    full_name: string;
    profile_pic: string;
  };
}

function Home() {
  const [toggleField, setToggleField] = useState(false);
  const [toggleFollow, setToggleFollow] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);
  const [toggleTagList, setToggleTagList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postTrigger, setPostTrigger] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [caption, setCaption] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [users, setUsers] = useState<Tag[]>([]);
  const [tagNameList, setTagNameList] = useState<String[]>([]);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const userData = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileInfo({ name: file.name, size: file.size / 1000 });
    }
  };

  useEffect(() => {
    if (!userData) handleFetch();
  }, [userData]);

  const email = localStorage.getItem("email");

  const handleFetch = async () => {
    if (email) {
      try {
        const data = await handleFetchUSer(email);
        dispatch(login({ user: data }));
      } catch (error: any) {
        console.error(error);
      }
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const publicUri = await handleUpload(file!);
      const response = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: CREATE_POST,
          variables: {
            imageUrl: publicUri,
            userId: userData?.id,
            caption: caption,
            tags: tagNameList,
          },
        }),
      });
      const { errors } = await response.json();
      if (errors) throw new Error(errors[0].message);

      setLoading(false);
      setPreview(undefined);
      setCaption("");
      setPostTrigger(!postTrigger);
      setToggleField(false);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${server_url}/graphql/v1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: supabase_key,
          },
          body: JSON.stringify({
            query: FETCH_USERS,
          }),
        });
        const { data, errors } = await response.json();
        console.log(data);

        if (errors) {
          throw new Error(errors[0].message);
        }
        setUsers(data.usersCollection.edges);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const handleFetchUserByIds = async () => {
      try {
        const followsResponse = await fetch(`${server_url}/graphql/v1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: supabase_key,
          },
          body: JSON.stringify({
            query: FETCH_FOLLOWS,
            variables: {
              userId: userData?.id,
            },
          }),
        });
        const { data, errors } = await followsResponse.json();
        if (errors) throw new Error(errors[0].message);
        const following =
          data.followsCollection.edges[0]?.node.following_id || [];
        const followers =
          data.followsCollection.edges[0]?.node.follower_id || [];
        const tagListId = [...followers, ...following];
        console.log(tagListId);

        const fetchUsers = await fetch(`${server_url}/graphql/v1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: supabase_key,
          },
          body: JSON.stringify({
            query: FETCH_USER_BY_IDS,
            variables: {
              userIds: tagListId,
            },
          }),
        });
        const tagListData = await fetchUsers.json();

        setTagList(tagListData.data.usersCollection.edges);
      } catch (error) {
        console.log(error);
      }
    };
    handleFetchUserByIds();
  }, [userData?.id]);

  const handleAddTag = (id: String) => {
    setTagNameList([...tagNameList, id]);
  };
  const handleRemoveTag = (id: String) => {
    const newList = tagNameList.filter((item) => item !== id);
    setTagNameList(newList);
  };

  return (
    <div className="flex w-full bg-[#fcfbfc]">
      <Sidebar userData={userData!} setToggle={setToggleProfile} />
      <div className="w-full h-[100svh] overflow-scroll scrollbar relative">
        <HomeNav setToggleFollow={setToggleFollow} />
        {toggleFollow && (
          <Follow
            users={users}
            setFollow={setToggleFollow}
            setPostTrigger={setPostTrigger}
            postTrigger={postTrigger}
          />
        )}
        <div className="w-full px-14 py-10 flex flex-col items-center">
          <div className="bg-white p-5 px-10 shadow-sm rounded-lg flex flex-col gap-4 w-full">
            <div className="flex items-center justify-evenly gap-5">
              <div className="w-10 h-10 rounded-full bg-white shadow-lg flex overflow-hidden items-center justify-center">
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
              <input
                onClick={() => setToggleField(true)}
                onChange={(e) => setCaption(e.target.value)}
                value={caption}
                type="text"
                placeholder="Whats new, Tim?"
                className="bg-white rounded-[30px] nunito ps-5 text-sm focus:outline-none text-[#828296] border-[1px] h-10 w-full"
              />
            </div>
            {toggleField && (
              <>
                {!preview ? (
                  <div className="border-b-[1px] w-full flex gap-2 items-center py-2">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      ref={inputRef}
                      onChange={handleFileChange}
                    />
                    <div
                      onClick={() => inputRef.current?.click()}
                      className="h-8 w-8 rounded-full bg-[#f7f7f7] flex items-center justify-center hover:cursor-pointer"
                    >
                      <Icon
                        width={16}
                        icon="heroicons-outline:paper-clip"
                        color="#882ae7"
                      />
                    </div>
                    <p
                      onClick={() => inputRef.current?.click()}
                      className="nunito text-sm font-medium text-[#882ae7] hover:cursor-pointer"
                    >
                      Attach Media
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-10 bg-[#f8f9fb] rounded-full flex justify-between items-center px-3">
                    <div className="flex items-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-10 h-8 rounded-lg"
                      />
                      <p className="ms-3 nunito text-[12px] font-medium text-[#24231e]">
                        {fileInfo?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="ms-3 nunito text-[12px] font-medium text-[#24231e]">
                        {fileInfo?.size} kb
                      </p>
                      <div className="border-e-[1px] h-5 w-1 border-grey" />
                      <Icon
                        icon="zondicons:close-outline"
                        color="#24231e"
                        className="hover:cursor-pointer"
                        onClick={() => setPreview(undefined)}
                      />
                    </div>
                  </div>
                )}
                <div className="border-b-[1px] w-full flex gap-2 items-center py-2 relative">
                  {toggleTagList && (
                    <div className="shadow-md rounded-lg bg-[#ffff] z-50 w-[300px] max-h-[180px] absolute left-[20px] top-[50px] p-5 flex flex-col gap-2 overflow-scroll scrollbar">
                      <Icon
                        width={20}
                        icon="ic:round-close"
                        style={{ color: "black" }}
                        className="absolute top-1 right-1 hover:cursor-pointer"
                        onClick={() => setToggleTagList(false)}
                      />
                      {tagList
                        .filter(
                          (item) => !tagNameList.includes(item.node.username)
                        )
                        .map((item) => (
                          <div
                            onClick={() => handleAddTag(item.node.username)}
                            className="flex items-center gap-2 w-full hover:bg-[#f6f7f9] cursor-pointer"
                            key={item.node.id}
                          >
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
                          </div>
                        ))}
                    </div>
                  )}
                  <div
                    onClick={() => setToggleTagList(true)}
                    className="h-8 w-8 rounded-full bg-[#f7f7f7] flex items-center justify-center hover:cursor-pointer"
                  >
                    <p className="text-md text-[#882ae7]">@</p>
                  </div>
                  <p
                    onClick={() => setToggleTagList(true)}
                    className="nunito text-sm font-medium text-[#882ae7] hover:cursor-pointer"
                  >
                    Tag People
                  </p>
                  {tagNameList.length !== 0 &&
                    tagNameList.map((item) => (
                      <div className="flex items-center rounded-[30px] bg-[#d8d8d8] px-3 py-1 gap-3">
                        <p className="nunito text-sm text-black">{item}</p>
                        <Icon
                          width={15}
                          icon="ic:round-close"
                          style={{ color: "black" }}
                          className="hover:cursor-pointer"
                          onClick={() => handleRemoveTag(item)}
                        />
                      </div>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-5">
                  <p
                    onClick={() => setToggleField(false)}
                    className="nunito text-sm font-medium  text-[#882ae7] hover:cursor-pointer"
                  >
                    Cancel
                  </p>
                  {loading ? (
                    <div className="group w-[150px] h-[30px] z-40 rounded-full bg-gradient-to-r from-purple-700 to-purple-500 relative overflow-hidden shadow-lg flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
                      <button
                        onClick={handleCreatePost}
                        disabled
                        className="relative text-sm bottom-[2px] z-10 flex items-center gap-2"
                      >
                        Posting...
                        <Loader width={5} />
                      </button>
                    </div>
                  ) : (
                    <div className="group w-[150px] h-[30px] z-40 rounded-full bg-gradient-to-r from-purple-700 to-purple-500 relative overflow-hidden shadow-lg flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
                      <button
                        onClick={handleCreatePost}
                        className="relative text-sm bottom-[2px] z-10 flex items-center gap-2"
                      >
                        Post Update
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <Posts postTrigger={postTrigger} />
      </div>
      <Profile toggle={toggleProfile} setToggle={setToggleProfile} />
    </div>
  );
}

export default Home;
