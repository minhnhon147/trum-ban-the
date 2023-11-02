"use client";

type Props = {
  title: string;
  text?: string | number;
};

const TextDetailTransaction = (props: Props) => {
  return (
    <div className="flex justify-between items-center m-2">
      <p className="">{props.title}</p>
      <p className="text-red-600 font-medium">{props.text}</p>
    </div>
  );
};

export default TextDetailTransaction;
