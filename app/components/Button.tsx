"use client";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      className="bg-black text-white px-4 py-2 rounded-full"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
