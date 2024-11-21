import { ReactNode, ChangeEvent } from "react";

interface InputProps {
  icon: ReactNode;
  placeholder: string;
  value: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type: string;
}

function Input({ icon, placeholder, value, onChange, name, type }: InputProps) {
  return (
    <div className="relative flex items-center">
      <input
        className="rounded-3xl bg-[#f7f7f7] h-10 w-64 text-[#717183] text-sm ps-14 border border-transparent focus:border-[rgba(130,36,227,1)] focus:outline-none pb-[1px]"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        type={type}
      ></input>
      <div className="w-9 h-9 bg-white rounded-full absolute ms-[3px] flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

export default Input;
