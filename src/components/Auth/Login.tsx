import { Icon } from "@iconify/react";
import logo from "../../assets/logo.png";
import Input from "../UI/Input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import Loader from "../UI/Loader";
import { handleFetchUSer } from "../../utils/apiUtils";

function Login() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const loginData = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      localStorage.setItem(
        "token",
        (loginData as any)?._tokenResponse?.refreshToken!
      );
      const data = await handleFetchUSer(formData.email);
      dispatch(login({ data }));
      localStorage.setItem("email", formData.email);
      setLoading(false);
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      if (error.message.includes("auth/invalid-credential")) {
        setError("Incorrect email/password. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Error signing up:", error.message);
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
            placeholder="Email or Username"
            name="email"
            onChange={handleChange}
            value={formData.email}
            type="email"
          />
          <div className="relative flex items-center">
            <Input
              icon={<Icon icon="icon-park-outline:key" color="rgb(79,79,88)" />}
              placeholder="Password"
              name="password"
              type={type ? "password" : "text"}
              onChange={handleChange}
              value={formData.password}
            />
            <Icon
              icon={!type ? "mdi:eye-outline" : "iconamoon:eye-off-fill"}
              color="rgba(130,36,227,1"
              className="absolute right-4 hover:cursor-pointer"
              width={20}
              onClick={() => setType(!type)}
            />
          </div>
          {error && <p className="nunito text-sm text-[#ff3c3c]">{error}</p>}
          {loading ? (
            <div className="group w-64 h-10 mt-3 rounded-3xl bg-gradient-to-r from-purple-700 to-purple-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
              <button
                onClick={handleLogin}
                disabled
                className="relative w-full h-full bottom-[2px] z-10 flex items-center gap-2 justify-center"
              >
                Logging in.. <Loader width={8} />
              </button>
            </div>
          ) : (
            <div className="group w-64 h-10 mt-3 rounded-3xl bg-gradient-to-r from-purple-700 to-purple-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"></div>
              <button
                onClick={handleLogin}
                className="relative w-full h-full bottom-[2px] z-10"
              >
                Log into your account
              </button>
            </div>
          )}
          <Link to={"/signup"}>
            <p className="nunito mt-2 font-semibold text-[rgba(130,36,227)]">
              Signup
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
