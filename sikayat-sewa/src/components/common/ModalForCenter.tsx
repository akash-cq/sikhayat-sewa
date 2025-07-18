import React from "react";

export default function ModalForCenter({
  children,
  onClose
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {



  return (
    <div className="mb-4 w-250 h-100  bg-white absolute top-20 left-30 z-10 rounded-lg shadow-xl/10 p-4">
      <div className="flex w-full h-5 flex-row-reverse cursor-pointer" onClick={onClose}>
        ✕
      </div>
      {children}
    </div>
  );
}
