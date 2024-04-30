import { useEffect, useRef, useState } from "react";
import "./css/index.css";
import heic2any from "heic2any";

function App() {
  const imgRef = useRef(null);
  const [imgFile, setImgFile] = useState<string[]>([]);

  useEffect(() => {
    console.log("imgfile::::::::::::::: ", imgFile);
  }, [imgFile]);

  const saveImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;

    if (!files[0]) return;
    if (imgFile.length + files.length > 4) {
      return alert("최대 4개 사진만 첨부할 수 있습니다.");
    }
    console.log("files::", files[0].type);

    for (const file of files) {
      if (file.type === "image/heic" || file.type === "image/HEIC") {
        const resultBlob = await heic2any({ blob: file, toType: "image/jpeg" });
        if (Array.isArray(resultBlob)) {
          for (const blob of resultBlob) {
            const convertedFile = new File([blob], file.name.split(".")[0] + ".jpeg", {
              type: "image/jpeg",
              lastModified: new Date().getTime(),
            });
            setImgFile((prev) => [...prev, URL.createObjectURL(convertedFile)]);
          }
        } else {
          const convertedFile = new File([resultBlob], file.name.split(".")[0] + ".jpeg", {
            type: "image/jpeg",
            lastModified: new Date().getTime(),
          });
          setImgFile((prev) => [...prev, URL.createObjectURL(convertedFile)]);
        }
      } else {
        setImgFile((prev) => [...prev, URL.createObjectURL(file)]);
      }
    }
  };

  return (
    <>
      <div className="w-screen h-screen bg-blue-600">
        <div className="text-center py-10">
          <h2 className="text-5xl">마천동 성당 어린이날</h2>
          <h4>인생네컷~!</h4>
        </div>
        <div className="w-1/3 aspect-square bg-blue-600 m-auto relative flex justify-end">
          <label className="cursor-pointer absolute bottom-[-100px] px-12 py-2 bg-blue-600 rounded-lg text-white border-solid border-2 border-white-600" htmlFor="image_one">
            📂 이미지 추가하기
          </label>
          <label className="cursor-pointer absolute bottom-[-160px] right-[0] px-12 py-2 bg-blue-600 rounded-lg text-white border-solid border-2 border-white-600" htmlFor="image_one">
            📂 이미지 내보내기
          </label>
          <input type="file" onChange={(e) => saveImgFile(e)} id="image_one" multiple accept="image/*, .heic" className="hidden absolute" ref={imgRef} />
          <div className="">
            {imgFile.map((item, index) => {
              return (
                <div key={index} className="w-56 aspect-video bg-slate-50 overflow-hidden object-cover relative mb-3 pb-3 flex justify-center items-center">
                  <img src={imgFile.length === 0 ? "/public/sohee.png" : item} width={"auto"} height={100} alt="img" className="z-90" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
