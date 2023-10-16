import { IFilm } from "@/types/film";
import Image from "next/image";
import { useEffect, useState } from "react";
import LabelIcon from "../../assets/icons/label.svg";
import EyeIcon from "../../assets/icons/eye.svg";
import EyeSlashIcon from "../../assets/icons/eye-slash.svg";
import PlusIcon from "../../assets/icons/plus.svg";
import ValidField from "../valid-field";

const ACTIONS = [
  {
    id: 1,
    ActiveIcon: PlusIcon,
    PassiveIcon: LabelIcon,
    activeText: "I will watch",
    passiveText: "Remove from watchlist",
    value: "watchlist"
  },
  {
    id: 2,
    ActiveIcon: EyeIcon,
    PassiveIcon: EyeSlashIcon,
    activeText: "Seen",
    passiveText: "unseen",
    value: "history"
  },
] as const;

type StorageKey = typeof ACTIONS[number]["value"];

type RatingType = { rating: number, filmId: string }

function FilmCard({ Poster, Title, Year, imdbID }: IFilm) {
  const [isInStorages, setInStorages] = useState<{
    watchlist: boolean,
    history: boolean,
    rating: null | RatingType
  }>({
    watchlist: false,
    history: false,
    rating: null
  });

  useEffect(() => {
    const checkIsInLocalStorage = (key: StorageKey | "rating") => {
      const storageData = localStorage.getItem(key);

      if (!storageData) return false;
      const isInStorage = storageData ? JSON.parse(storageData).find((value: string) => value === imdbID) : false;
      return isInStorage;
    };

    const checkRating = () => {
      const storageData = localStorage.getItem("rating");
      if (!storageData) return null;
      const isInStorage = storageData ? JSON.parse(storageData).find((value: RatingType) => value.filmId === imdbID) : null;
      return isInStorage;
    }

    setInStorages({
      watchlist: !!checkIsInLocalStorage("watchlist"),
      history: !!checkIsInLocalStorage("history"),
      rating: checkRating()
    })
  }, [imdbID]);

  const handleSave = (key: string, filmId: string) => {
    const oldData = JSON.parse(localStorage.getItem(key) || "[]");
    
    localStorage.setItem(key, JSON.stringify([...oldData, filmId]));
    const setObject: Record<string, null | boolean> = {
      [key]: true
    };
    
    if(key === "watchlist") {
      deleteRating(filmId);
      setObject.rating = null;
    };

    const state = removeFromLocalStorage(key === "history" ? "watchlist" : "history", filmId);
    
    setInStorages((prev) => ({
      ...prev,
      ...state,
      ...setObject
    }));
  };

  const removeFromLocalStorage = (key: string, filmId: string) => {
    
    const oldData = JSON.parse(localStorage.getItem(key) || "[]");
    oldData.splice(oldData.indexOf(filmId), 1);
    
    localStorage.setItem(key, JSON.stringify(oldData));

    return {
      [key]: false
    };

  }

  const handleRemove = (key: string, filmId: string) => {
    const state = removeFromLocalStorage(key, filmId);

    if(key === "history") {
      deleteRating(filmId);
    }
    
    setInStorages(prev=> ({
      ...prev,
      ...state,
      rating: null
    }))
  };

  const handleChangeRating = (rating: number, filmId: string) => {
    const oldData = JSON.parse(localStorage.getItem("rating") || "[]");
    
    const foundedItemIdx = oldData.findIndex(({filmId: oldFilmId}: {filmId: string}) => oldFilmId === filmId);
    const value = { filmId, rating };
    
    if(foundedItemIdx !== -1) {
      oldData[foundedItemIdx].rating = rating
      localStorage.setItem("rating", JSON.stringify(oldData));
    } else {
      localStorage.setItem("rating", JSON.stringify([...oldData, value]));
    }
    const oldHistory = JSON.parse(localStorage.getItem("history") || "[]");
    const oldWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");

    if(!oldHistory.find((value: string) => value === filmId)) {
      localStorage.setItem("history", JSON.stringify([...oldHistory, filmId]));
    }
    const foundedWatchIdx = oldWatchlist.findIndex((value: string) => value === filmId);
    
    if(foundedWatchIdx !== -1) {
      oldWatchlist.splice(foundedWatchIdx, 1)
      localStorage.setItem("watchlist", JSON.stringify(oldWatchlist));
    }

    setInStorages({
      watchlist: false,
      "rating": value,
      history: true
    });
  };

  const deleteRating = (filmId: string) => {
    const oldData = JSON.parse(localStorage.getItem("rating") || "[]");
    const foundedItemIdx = oldData.findIndex(({filmId: oldFilmId}: {filmId: string}) => oldFilmId === filmId);
    if(foundedItemIdx !== -1) {
      oldData.splice(foundedItemIdx, 1)
      localStorage.setItem("rating", JSON.stringify(oldData));
    }
  }

  return (
    <div className="mt-5">
      <ValidField field={Poster}>
        <Image src={Poster} alt={Title} width={320} height={420} priority className="h-[420px] object-cover" />
      </ValidField>
      <ValidField field={Title}>
        <h2 className="font-bold w-[320px]">{Title}</h2>
      </ValidField>
      <ValidField field={Year}>
        <h4>Year: {Year}</h4>
      </ValidField>
      <div className="flex gap-2">
        {ACTIONS.map(({ id, ActiveIcon, PassiveIcon, activeText, passiveText, value }) => {
          const isInStorage = isInStorages[value];
          const Icon = isInStorage ? PassiveIcon : ActiveIcon;
          const text = isInStorage ? passiveText : activeText;
          const toggle = isInStorage ? handleRemove : handleSave

          return (
            <button
              key={id}
              className={`${!isInStorage ? "bg-orange-600" : "bg-violet-800"} flex flex-col text-xs items-center gap-1 mt-2  p-2 rounded-lg text-white w-1/2 hover:bg-white hover:text-black transition-colors`}
              onClick={() => toggle(value, imdbID)}
            >
              <Icon width="20px" />
              {text}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        {new Array(5).fill(null).map((_, idx) => (
          <button onClick={() => handleChangeRating(idx + 1, imdbID)} key={idx} className={`${isInStorages.rating?.rating === idx +1 ? "bg-orange-600" : "bg-gray-400" } w-[60px] h-[60px] rounded-full flex items-center justify-center text-xl`}>
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
export default FilmCard;