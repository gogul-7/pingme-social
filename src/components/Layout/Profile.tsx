import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import ProfileInput from "../UI/ProfileInput";
import { server_url, supabase_key } from "../../utils/constants";
import { EDIT_USER } from "../../graphql/mutations/user";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import Loader from "../UI/Loader";
import { handleUpload } from "../../utils/apiUtils";

interface ProfileProps {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

function Profile({ toggle, setToggle }: ProfileProps) {
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone: "",
    bio: "",
  });
  const userData = useSelector((state: RootState) => state.auth.user);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const email = localStorage.getItem("email");

  console.log(fileInfo);

  useEffect(() => {
    if (userData) {
      setFormData({
        full_name: userData?.full_name,
        username: userData.username,
        phone: userData.phone_number,
        bio: userData.bio,
      });
    }
  }, [userData]);

  const handleToggle = () => {
    if (!toggle) setToggle(true);
    else {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileInfo({ name: file.name, size: file.size / 1000 });
    }
  };

  const handleUpdate = async () => {
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
          query: EDIT_USER,
          variables: {
            id: userData?.id,
            full_name: formData.full_name,
            username: formData.username,
            phone_number: formData.phone,
            bio: formData.bio,
            profile_pic: publicUri,
          },
        }),
      });

      const { errors } = await response.json();
      if (errors) throw new Error(errors[0].message);
      setMessage("User updated successfully!");
      setLoading(false);
      setDisable(true);
      console.log(message);
    } catch (error: any) {
      console.error(error);
      setMessage(`Failed to update user: ${error.message}`);
    }
  };

  return (
    <div
      className={`border-s-[1px] ${
        toggle ? "w-[400px]" : "w-[100px]"
      } flex flex-col items-center gap-5 py-10 transition-all ease-in-out duration-300`}
    >
      {toggle && (
        <Icon
          width={20}
          icon="ic:round-close"
          style={{ color: "black" }}
          className="absolute top-5 right-5 hover:cursor-pointer"
          onClick={() => setToggle(false)}
        />
      )}
      <div
        onClick={handleToggle}
        className={`${
          toggle ? "w-28 h-28" : "w-10 h-10"
        } rounded-full bg-white shadow-lg mb-3 flex transition-all ease-in-out duration-300 items-center justify-center hover:cursor-pointer overflow-hidden`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        {preview ? (
          <img
            src={preview}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : userData?.profile_pic ? (
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
      {toggle && (
        <>
          <ProfileInput
            name="username"
            onChange={handleChange}
            value={formData.username}
            placeholder="@username"
            disable={disable}
          />
          <ProfileInput
            name="full_name"
            onChange={handleChange}
            value={formData.full_name}
            placeholder="Full Name"
            disable={disable}
          />
          <ProfileInput
            name="email"
            onChange={handleChange}
            value={email!}
            placeholder="Email"
            disable={true}
          />
          <ProfileInput
            name="phone"
            onChange={handleChange}
            value={formData.phone}
            placeholder="Phone number"
            disable={disable}
          />
          <ProfileInput
            name="bio"
            onChange={handleChange}
            value={formData.bio}
            placeholder="About you"
            disable={disable}
          />
          <div className="flex justify-end w-[90%] items-center gap-3">
            {disable ? (
              <div
                onClick={() => setDisable(false)}
                className="group w-[100px] h-[30px]  rounded-full bg-gradient-to-r from-purple-700 to-purple-500 relative overflow-hidden shadow-lg flex items-center justify-center hover:cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
                <button className="relative text-sm bottom-[2px] z-10">
                  Edit
                </button>
              </div>
            ) : (
              <>
                <p
                  onClick={() => setDisable(true)}
                  className="nunito text-sm font-medium text-[#882ae7] hover:cursor-pointer"
                >
                  Cancel
                </p>
                <div
                  onClick={handleUpdate}
                  className="group w-[100px] h-[30px]  rounded-full bg-gradient-to-r from-purple-700 to-purple-500 relative overflow-hidden shadow-lg flex items-center justify-center hover:cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
                  <button className="relative text-sm bottom-[2px] z-10 flex items-center gap-2">
                    Save {loading && <Loader width={5} />}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
