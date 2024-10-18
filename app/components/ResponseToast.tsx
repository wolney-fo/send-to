import * as Toast from "@radix-ui/react-toast";
import { Dispatch, SetStateAction } from "react";

interface ResponseToastProps {
  title: string;
  description: string;
  closeButton: string;
  toastState: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function ResponseToast(props: ResponseToastProps) {
  return (
    <Toast.Provider duration={1000 * 5} swipeDirection="right">
      <Toast.Root
        open={props.toastState}
        onOpenChange={props.onOpenChange}
        className="text-left bg-white border rounded-md p-4 grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-4 items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
      >
        <div>
          <Toast.Title className="[grid-area:_title] text-black font-bold text-md">
            {props.title}
          </Toast.Title>
          <Toast.Description className="[grid-area:_description] m-0 text-slate-600 text-sm leading-[1.3]">
            {props.description}
          </Toast.Description>
        </div>
        <Toast.Close className="rounded font-medium text-xs px-4 py-2 text-white bg-black border border-black hover:opacity-85">
          {props.closeButton}
        </Toast.Close>
      </Toast.Root>

      <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  );
}
