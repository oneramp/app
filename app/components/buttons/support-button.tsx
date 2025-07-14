import React from "react";
import { Button } from "../ui/button";
import { BiSupport } from "react-icons/bi";

const SupportButton = ({ transactionId }: { transactionId: string }) => {
  const handleContactSupport = (event: React.MouseEvent) => {
    // Prevent the event from bubbling up and prevent default behavior
    event.preventDefault();
    event.stopPropagation();

    window.location.href = `mailto:eliash@oneramp.io?subject=Support Request for Transaction ${transactionId}`;
  };

  return (
    <Button
      type="button"
      onClick={handleContactSupport}
      className="w-1/2 bg-neutral-800 hover:bg-transparent gap-2 text-neutral-300 flex flex-row items-center text-base font-semibold h-14 rounded-xl transition-colors"
    >
      Contact Support
      <BiSupport size={20} />
    </Button>
  );
};

export default SupportButton;
