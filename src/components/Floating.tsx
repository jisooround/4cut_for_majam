import React, { useState } from "react";

const Floating = () => {
  const [show, setShow] = useState<boolean>(false);

  const onClickIcon = () => {
    setShow(true);
  };

  const onClickClose = () => {
    setShow(false);
  };
  return (
    <>
      {show ? (
        <div className="fixed bottom-10 right-6 w-[300px] h-[500px] rounded-xl bg-white shadow-lg z-50">
          <button onClick={onClickClose}>close</button>
        </div>
      ) : null}
      <div onClick={onClickIcon} className="fixed bottom-10 right-6">
        <img className="animate-updown w-16 cursor-pointer z-100" src="/setting.png" alt="" />
      </div>
    </>
  );
};

export default Floating;
