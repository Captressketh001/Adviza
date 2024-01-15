import { useState, useEffect } from "react";
import { app } from "../../init";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import diceIcon from '../assets/images/icon-dice.svg'
import { infinity } from "ldrs";
import { hourglass } from "ldrs";

hourglass.register();
infinity.register();

const db = getFirestore(app);

const Advice = () => {
  const [shuffledDocuments, setShuffledDocuments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedAdvice, setDisplayedAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "advice"));
        const newData = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().status === true) {
            newData.push({ id: doc.id, data: doc.data() });
          }
        });
        setShuffledDocuments(shuffleDocuments(newData));
        setDisplayedAdvice(newData[3]);
        setIsLoading(false); // Initially display the first advice
      } catch (error) {
        toast.error("Error fetching advice:", error);
        setIsLoading(false);
      }
    };
    fetchAdvice();
  }, []);

  const shuffleDocuments = (arr) => {
    // Function to shuffle documents based on IDs
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const displayNextDocument = () => {
    const randomIndex = Math.floor(Math.random() * shuffledDocuments.length);
    setCurrentIndex(randomIndex);
    setDisplayedAdvice(shuffledDocuments[currentIndex]);
  };

  return (
    <div className="main-container">
      {isLoading ? (
        <>
        <div className="sm:flex sm:flex-row sm:gap-2 items-center flex flex-col gap-4">
        <l-infinity
          size="55"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.3"
          color="rgb(129 140 248)"
        ></l-infinity> 
        <p className="text-indigo-400">Adviza</p>
        </div>
        </>
      ) : displayedAdvice ? (
        displayedAdvice && (
          <main className="app-container">
            <p className="text-indigo-400 mt-5 sm:mt-0">Advice #{currentIndex}</p>
            <q className="mt-2">{displayedAdvice.data.content}</q>
            <small className="mt-5 text-indigo-400">{displayedAdvice.data.author}</small>
            <div className="icon" onClick={displayNextDocument}>
              <img src={diceIcon} alt="Dice Icon" />
            </div>
          </main>
        )
      ) : (
        <>
        <div className="sm:flex sm:flex-row sm:gap-0 items-center flex flex-col gap-4">
          <l-hourglass
            size="60"
            bg-opacity="0.1"
            speed="1.75"
            color="rgb(129 140 248)"
          ></l-hourglass>
          <p className="text-indigo-400">
            OOPs! Adviza will be back in a moment
          </p>
          </div>
        </>
        // </main>
      )}
      <ToastContainer />
    </div>
  );
};

export default Advice;
