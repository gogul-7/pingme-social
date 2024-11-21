import { ChangeEvent } from "react";

interface InputProps {
  placeholder: string;
  value: string;
  name: string;
  disable: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function ProfileInput({
  placeholder,
  value,
  onChange,
  name,
  disable,
}: InputProps) {
  return (
    <div className="relative flex items-center">
      <input
        className="rounded-3xl bg-[#f7f7f7] h-10 w-[230px] text-[#717183] text-sm ps-5 border border-transparent focus:border-[#828296] focus:outline-none pb-[1px]"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disable}
      ></input>
      {/* <div className="w-9 h-9 bg-white rounded-full absolute ms-[3px] flex items-center justify-center">
        {icon}
      </div> */}
    </div>
  );
}

export default ProfileInput;
