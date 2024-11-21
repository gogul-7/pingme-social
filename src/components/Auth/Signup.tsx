import { Icon } from "@iconify/react";
import logo from "../../assets/logo.png";
import Input from "../UI/Input";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { SIGNUP_USER } from "../../graphql/mutations/auth";
import { login } from "../../redux/slices/authSlice";
import { server_url, supabase_key } from "../../utils/constants";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { CREATE_FOLLOWS } from "../../graphql/mutations/follows";
import Loader from "../UI/Loader";
import { handleFetchUSer } from "../../utils/apiUtils";

function Signup() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    cnfPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [type, setType] = useState(true);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);

  const handleSignUp = async () => {
    if (formData.username.length === 0) {
      setError("Enter a username");
    } else {
      setLoading(true);
      setError("");
      try {
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        localStorage.setItem("email", formData.email);
        await handleSubmit();
        const data = await handleFetchUSer(formData.email);
        dispatch(login({ data }));
        localStorage.setItem("email", formData.email);
        setLoading(false);
        navigate("/");
      } catch (error: any) {
        setLoading(false);
        if (error.message.includes("auth/email-already-in-use")) {
          setError("User already exist. Please login to continue.");
        } else {
          setError("An error occurred. Please try again later.");
        }
        console.error("Error signing up:", error.message);
      }
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (formData.password !== formData.cnfPassword) {
      setError("Password doesn't match");
      setDisable(true);
    } else {
      setError("");
      setDisable(false);
    }
  }, [formData.password, formData.cnfPassword]);
  4;

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: SIGNUP_USER,
          variables: {
            email: formData.email,
            username: formData.username,
          },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) throw new Error(errors[0].message);

      const newUserId = data.insertIntousersCollection.records[0].id;
      const followResponse = await fetch(`${server_url}/graphql/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: supabase_key,
        },
        body: JSON.stringify({
          query: CREATE_FOLLOWS,
          variables: {
            user_id: newUserId,
          },
        }),
      });

      const { errors: followErrors } = await followResponse.json();
      if (followErrors) throw new Error(followErrors[0].message);

      dispatch(login({ user: data.insertIntousersCollection.records[0] }));
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      setError(`Signup failed: ${error.message}`);
    }
  };

  return (
    <div className="pt-24 flex justify-center w-full pb-32">
      <div className="mt-20 w-2/4 h-auto flex">
        <div className="w-2/4 bg-[rgba(130,36,227,1)] h-full p-8 flex flex-col gap-3 py-24">
          <p className="nunito text-xl font-semibold">Join Our Club</p>
          <p className="nunito text-sm w-4/5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.Ut elit
            tellus, luctus.
          </p>
          <div className="flex flex-col mt-5 gap-4">
            <div className="flex items-center gap-2">
              <div className="border p-3 rounded-xl">
                <Icon icon="fluent:people-community-48-filled" width={15} />
              </div>
              <div className="mb-1">
                <p className="nunito text-xl font-semibold">Community</p>
                <p className="nunito text-sm">At vero eos et accusamus et.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="border p-3 rounded-xl">
                <Icon icon="ic:baseline-work" width={15} />
              </div>
              <div className="mb-1">
                <p className="nunito text-xl font-semibold">Job Search</p>
                <p className="nunito text-sm">At vero eos et accusamus et.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="border p-3 rounded-xl">
                <Icon icon="mdi:shopping" width={15} />
              </div>
              <div className="mb-1">
                <p className="nunito text-xl font-semibold">Online Shop</p>
                <p className="nunito text-sm">At vero eos et accusamus et.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/4 bg-[#fff] h-full p-5 flex flex-col items-center py-20 gap-2">
          <img src={logo} alt="logo" width={80} />
          <p className="nunito text-2xl text-[rgb(79,79,88)] font-semibold">
            Welcome
          </p>
          <Input
            icon={<Icon icon="lucide:user-round" color="rgb(79,79,88)" />}
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            type="email"
          />
          <Input
            icon={<Icon icon="meteor-icons:at" color="rgb(79,79,88)" />}
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={formData.username}
            type="text"
          />
          <div className="relative flex items-center">
            <Input
              icon={<Icon icon="icon-park-outline:key" color="rgb(79,79,88)" />}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              type={type ? "password" : "text"}
            />
            <Icon
              icon={!type ? "mdi:eye-outline" : "iconamoon:eye-off-fill"}
              color="rgba(130,36,227,1"
              className="absolute right-4 hover:cursor-pointer"
              width={20}
              onClick={() => setType(!type)}
            />
          </div>
          <Input
            icon={<Icon icon="icon-park-outline:key" color="rgb(79,79,88)" />}
            placeholder="Confirm Password"
            name="cnfPassword"
            onChange={handleChange}
            value={formData.cnfPassword}
            type={type ? "password" : "text"}
          />
          {error && <p className="nunito text-sm text-[#ff3c3c]">{error}</p>}
          {loading ? (
            <div className="group w-64 h-10 mt-3 rounded-3xl bg-gradient-to-r from-purple-700 to-purple-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
              <button
                className="relative w-full h-full bottom-[2px] z-10 flex items-center gap-2 justify-center"
                disabled
              >
                Signing up.. <Loader width={8} />
              </button>
            </div>
          ) : (
            <div className="group w-64 h-10 mt-3 rounded-3xl bg-gradient-to-r from-purple-700 to-purple-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
              <button
                disabled={disable}
                className="relative w-full h-full bottom-[2px] z-10"
                onClick={handleSignUp}
              >
                Sign up
              </button>
            </div>
          )}
          <Link to={"/login"}>
            <p className="nunito mt-2 font-semibold text-[rgba(130,36,227)]">
              Login
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
