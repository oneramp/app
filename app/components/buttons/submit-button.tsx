import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

const SubmitButton = ({
  className,
  onClick,
  disabled,
  children,
}: {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <Button
      className={cn(
        "w-full text-white text-base font-bold h-14 mt-2 rounded-2xl",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
