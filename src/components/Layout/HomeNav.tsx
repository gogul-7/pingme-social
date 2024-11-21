import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const options = [
  {
    id: 1,
    icon: "ci:user-add",
  },
  {
    id: 2,
    icon: "solar:bell-outline",
  },
  {
    id: 3,
    icon: "material-symbols:mail-outline",
  },
  {
    id: 4,
    icon: "iconamoon:shopping-bag-light",
  },
];

function HomeNav({
  setToggleFollow,
}: {
  setToggleFollow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const handleToggle = (id: number) => {
    if (id === 1) setToggleFollow(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-[80px] w-full border-b-[.5px] border-slate-200 flex items-center px-20 justify-between">
      <div className="flex items-center">
        <Icon icon="ic:sharp-search" color="#828296" width={20} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-[#fcfbfc] nunito ps-2 text-sm focus:outline-none text-[#828296]"
        />
      </div>
      <div className="flex gap-3 items-center">
        {options.map((item) => (
          <div
            onClick={() => handleToggle(item.id)}
            key={item.id}
            className="h-10 w-10 rounded-full flex items-center justify-center bg-[#f8f9fb] hover:cursor-pointer"
          >
            <Icon icon={item.icon} color="#434141" width={20} />
          </div>
        ))}
        <Icon
          icon="cuida:logout-outline"
          color="red"
          width={20}
          className="hover:cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

export default HomeNav;
