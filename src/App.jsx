import { useEffect, useRef, useState } from "react";
import "./App.css";
import { URL } from "./constant";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")),
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const [loader, setLoader] = useState(false);
  const scrollToAns = useRef();

  const handleAskQuestion = async () => {
    if (!question && !selectedHistory) {
      return false;
    }

    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = history.slice(0, 13); //14 questions display in Recent Search
        history = [question, ...history];
        history = history.map(
          (item) => item.charAt(0).toUpperCase() + item.slice(1).trim(),
        ); //Each letter of Recent Search Start with capital letter

        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        // setRecentHistory(question);  I HAVE TO CHECK WHICH ONE IS CORRECT
        setRecentHistory([question]);
      }
    }

    const payloadData = question ? question : selectedHistory;
    const payload = {
      contents: [
        {
          parts: [{ text: payloadData }],
        },
      ],
    };

    setLoader(true);
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    // dataString = dataString.split("* ");
    // dataString = dataString.map((item) => item.trim());

    // console.log(dataString);
    setResult([
      ...result,
      { type: "q", text: question ? question : selectedHistory },
      { type: "a", text: [dataString] },
    ]);
    setQuestion("");

    // Scroll to the top of the latest question instead of scrollHeight,
    // so long answers are read top-down instead of dropping at the end
    setTimeout(() => {
      const questions = scrollToAns.current.querySelectorAll(".justify-end");
      const lastQuestion = questions[questions.length - 1];
      if (lastQuestion) {
        lastQuestion.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
    // setTimeout(() => {
    //   scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight
    // }, 500);
    setLoader(false);
  };
  // console.log(recentHistory);

  const isEnter = (event) => {
    if (event.key == "Enter") {
      handleAskQuestion();
    }
  };

  useEffect(() => {
    handleAskQuestion();
  }, [selectedHistory]);

  // DARK MODE FEATURE
  const [darkMode, setDarkMode] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // console.log(darkMode);
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);


  return (
    <div className={darkMode == "dark" ? "dark" : "light"}>
      <div className="flex flex-col md:grid md:grid-cols-5 h-dvh text-center relative overflow-hidden">

        {/* DARK MODE TOGGLE BUTTON */}
        <button
          onClick={() => setDarkMode(darkMode === "dark" ? "light" : "dark")}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 dark:bg-zinc-800 bg-white dark:text-white text-zinc-800 border dark:border-zinc-700 border-zinc-300 px-3 py-2 rounded-full shadow-md transition-colors cursor-pointer"
        >
          {darkMode === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
              <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
              <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/>
            </svg>
          )}
          <span className="text-sm hidden sm:inline">
            {darkMode === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button> 
        
        {/* MOBILE SIDEBAR TOGGLE BUTTON */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 dark:bg-zinc-800 bg-white dark:text-white text-zinc-800 p-2 rounded-lg shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" fill="currentColor">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
          </svg>
        </button>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}


        {/* passing state props to recentSearch component */}
        {/* Sidebar drawer — slides in/out on mobile, always visible as a column on md+ */}
        <div
            className={`fixed md:static top-0 left-0 h-full w-64 md:w-auto md:col-span-1 z-40 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
          >
            <RecentSearch
              recentHistory={recentHistory}
              setRecentHistory={setRecentHistory}
              setSelectedHistory={(item) => {
                setSelectedHistory(item);
                setSidebarOpen(false);
              }}
            />
        </div>

        {/* h-screen + flex-col + overflow-hidden splits this into fixed header/scroll/input sections */}
        <div className="w-full md:col-span-4 h-dvh flex flex-col overflow-hidden">
          <div className="px-4 sm:px-6 md:px-10 pt-16 md:pt-10 shrink-0 my-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
              Hello User, Ask me Anything
            </h1>
            {loader ? <span className="loader"></span> : null}
          </div>

          {/* min-h-0 is required for overflow-y-auto to actually work inside a flex child */}
          <div
            ref={scrollToAns}
            className="flex-1 min-h-0 overflow-y-auto chat-scroll"
          >
            <div className="dark:text-zinc-300 text-zinc-800 px-4 sm:px-6 md:px-10">
              <ul>
                {result.map((item, index) => (
                  <QuestionAnswer key={index} item={item} index={index} />
                ))}
              </ul>
            </div>
          </div>
          
          <div className="dark:bg-zinc-800 w-[92%] md:w-1/2 bg-red-100 dark:text-white text-zinc-800 p-1 pr-5 m-auto rounded-4xl border border-zinc-800 flex h-16 shrink-0 mb-8">
            <input
              type="text"
              value={question}
              onKeyDown={isEnter}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full h-full p-3 outline-none"
              placeholder="Ask me anything"
            />
            <button onClick={handleAskQuestion}>Ask</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
