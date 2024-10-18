import type { SelectHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
}

export function Select(props: SelectProps) {
  const { register } = useFormContext();

  return (
    <select
      id={props.name}
      className="p-4 w-full h-[3.75rem] text-lg text-wma-black bg-white border border-slate-400 rounded-lg outline-none focus:border-wma-mid duration-200 box-border"
      {...register(props.name)}
      {...props}
    />
  );
}
