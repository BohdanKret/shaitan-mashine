import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface CheckedButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CheckedButton({
  children,
  isActive,
  isDisabled,
  onClick,
}: CheckedButtonProps) {
  return (
    <Button
      variant={!isDisabled ? "outline" : "secondary"}
      disabled={isDisabled}
      className={clsx("cursor-pointer", isActive && "border-[#1677ff]")}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
