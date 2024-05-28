import { useEffect, useRef, useState } from "react";
import "./css/index.css";
import heic2any from "heic2any";
import html2canvas from "html2canvas";
import saveAs from "file-saver";

interface ImageData {
  index: number;
  src: string;
}

type SaveImage = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => Promise<void>;

const imageData: ImageData[] = [
  {
    index: 0,
    src: "/public/plus.png",
  },
  {
    index: 1,
    src: "/public/plus.png",
  },
  {
    index: 2,
    src: "/public/plus.png",
  },
  {
    index: 3,
    src: "/public/plus.png",
  },
];

function App() {
  const imgRef = useRef(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [imgFile, setImgFile] = useState<ImageData[]>(imageData);
  const [importImg, setImportImg] = useState<number>(0);

  // 첨부이미지 개수 state변경
  useEffect(() => {
    // console.log("imgFile:::::::: ", imgFile);
    const imgCount = imgFile.filter((item) => item.src === "/public/plus.png").length;
    // console.log(imgCount);
    setImportImg(4 - imgCount);
  }, [imgFile]);

  // 이미지 저장 함수 (이벤트를 전달)
  const saveImgFile: SaveImage = async (e, index) => {
    const files = e.target.files!;

    // console.log("target", e.target.files);
    // 첨부한 파일이 없다면 return
    if (!files[0]) return;

    // 기존 imgFile State를 얕게 복사
    const newImgFiles = [...imgFile];
    // console.log("newImgFiles", newImgFiles);

    for (const file of files) {
      // imageUrl 선언
      let imageUrl: string;

      // 이미지 타입이 heic라면 jpeg로 확장자 변환
      if (file.type === "image/heic" || file.type === "image/HEIC") {
        const resultBlob = await heic2any({ blob: file, toType: "image/jpeg" });
        const convertedFile = new File([resultBlob as Blob], file.name.split(".")[0] + ".jpeg", {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });
        // 이미지 첨부를 위해 jpeg로 변환후의 URL 생성
        imageUrl = URL.createObjectURL(convertedFile);
      } else {
        // 확장자가 heic가 아닌 파일 첨부 URL 생성
        imageUrl = URL.createObjectURL(file);
      }

      // 개별첨부, 일괄첨부에 따른 처리
      if (index) {
        // console.log("indx", index);
        newImgFiles[index] = { index: index, src: imageUrl };
        setImgFile(newImgFiles);
        // console.log(imgFile);
        return;
      }

      // 빈 슬롯의 인덱스를 찾아 이미지 첨부
      const emptySlotIndex = newImgFiles.findIndex((item) => item.src === "/public/plus.png");
      // console.log("emptySlotIndex", emptySlotIndex);
      if (emptySlotIndex === -1) {
        return alert("최대 4개 사진만 첨부할 수 있습니다. 사진을 수정하시려면 개별 첨부를 해주시거나, 초기화시킨 후 다시시도해주시기 바랍니다.");
      }
      newImgFiles[emptySlotIndex] = { index: emptySlotIndex, src: imageUrl };
      setImgFile(newImgFiles);
    }
  };

  // 이미지 내보내기 동작 함수
  const handleDownload = async () => {
    if (!divRef.current) return;

    try {
      const div = divRef.current;
      const canvas = await html2canvas(div, { scale: 2 });
      canvas.toBlob((blob) => {
        if (blob !== null) {
          saveAs(blob, "result.png");
        }
      });
    } catch (error) {
      console.error("Error converting div to image:", error);
    }
  };

  const resetImage = () => {
    if (confirm("정말 초기화하시겠습니까??") == true) {
      setImgFile(imageData);
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="w-screen min-h-screen bg-yellow-100 pb-10 overflow-auto flex flex-wrap justify-center">
        <div className="w-full text-center py-4">
          <img className="w-[350px] mx-auto" src="/public/logo.png" />
          <p>1️⃣ '이미지 추가하기'버튼을 클릭하여 사진 4장을 선택 & 첨부</p>
          <p>2️⃣ '이미지 내보내기'버튼을 클릭 😺</p>
        </div>
        <div className="w-full h-auto m-auto flex flex-wrap justify-center">
          <div ref={divRef} className="w-56 h-auto flex flex-wrap justify-center ">
            <div className="absolute left-0 right-0 mx-auto w-56">
              <img src="/public/frame.png" alt="" />
            </div>
            <div className="pt-[91px] pb-[33px] z-10">
              {imgFile.map((item, index) => (
                <div key={index}>
                  <input onChange={(e) => saveImgFile(e, index)} type="file" id={`image_${index}`} className="hidden" />
                  <label htmlFor={`image_${index}`} key={index} className="w-[200px] h-[112px] mb-[10px] bg-slate-50 overflow-hidden object-cover relative flex justify-center items-center">
                    <img src={item.src} width={"auto"} height={100} alt="img" className="z-90" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-56 relative ">
          <p className="absolute right-[-40px] top-[-40px] font-bold">{importImg}/4</p>
          {importImg === 4 ? (
            <button onClick={resetImage} className="w-full block my-3 cursor-pointer px-12 py-2 bg-yellow-100 rounded-lg text-blue-600 border-solid border-2 border-blue-600">
              🔄 초기화
            </button>
          ) : (
            <label className="block my-3 cursor-pointer px-12 py-2 bg-yellow-100 rounded-lg text-blue-600 border-solid border-2 border-blue-600" htmlFor="image_one">
              📂 이미지 추가하기
            </label>
          )}
          {/* file 첨부 input */}
          <input type="file" onChange={(e) => saveImgFile(e)} id="image_one" multiple accept="image/*, .heic" className="hidden absolute" ref={imgRef} />
          <button onClick={handleDownload} className="cursor-pointer px-12 py-2 bg-yellow-100 rounded-lg text-blue-600 border-solid border-2 border-blue-600">
            📂 이미지 내보내기
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
