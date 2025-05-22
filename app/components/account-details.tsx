import { useUserSelectionStore } from "@/store/user-selection";
import { Check, Loader } from "lucide-react";

export const FetchingAccountDetails = () => {
  return (
    <div className="flex items-center justify-between gap-2 text-neutral-600 text-sm">
      <Loader className="size-4 animate-spin" />
      <p>Verifying account name...</p>
    </div>
  );
};

const AccountDetails = () => {
  const { paymentMethod } = useUserSelectionStore();

  console.log("userPayLoad HERE::::", paymentMethod);
  return (
    <div className=" mb-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex p-1 text-white border-2 bg-neutral-900 border-[#bcbcff] rounded-lg px-4 text-sm font-medium border-gradient-to-r from-purple-500/20 to-indigo-500/20">
          {paymentMethod === "momo" ? <h3>OK</h3> : <h3>Catherine Jones</h3>}
        </div>

        {/* <FetchingAccountDetails /> */}

        <Check className="size-6 text-green-500" />
      </div>
    </div>
  );
};

export default AccountDetails;
