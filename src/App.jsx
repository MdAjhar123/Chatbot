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
  const scrollToAns = useRef()

 
  const handleAskQuestion = async () => {
    
    if (!question && !selectedHistory) {
      return false;
    }

    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = [question, ...history];
        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        // setRecentHistory(question);  I HAVE TO CHECK WHICH ONE IS CORRECT
        setRecentHistory([question]);
      }
    }

    const payloadData = question?question:selectedHistory
    const payload = {
      "contents": [{
          "parts": [{ "text": payloadData }],
        }]
    };

    setLoader(true);
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim());

    // console.log(dataString);
    setResult([...result,{ type: "q", text: question?question:selectedHistory },{ type: "a", text: dataString }]);
    setQuestion("");

    setTimeout(() => {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight
    }, 500);
    setLoader(false)
    
  };
  // console.log(recentHistory);


  const isEnter = (event) => {
    if (event.key == "Enter") {
      handleAskQuestion();
    }
  };

  useEffect(()=> {
    handleAskQuestion()
  }, [selectedHistory]);



  return (
    <div className="grid grid-cols-5 h-screen text-center">

      {/* passing state props to recentSearch component */}
      <RecentSearch 
        recentHistory={recentHistory} 
        setRecentHistory={setRecentHistory}
        setSelectedHistory={setSelectedHistory}
      />

      <div className="col-span-4 p-10">
        <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
          Hello User, Ask me Anything
        </h1>
        {loader?<span className="loader"></span>:null}

        <div ref={scrollToAns} className="container h-100 overflow-auto">
          <div className="text-zinc-300">

            <ul>
              {result.map((item, index) => (
                <QuestionAnswer key={index} item={item} index={index}/>
              ))}
            </ul>

          </div>
        </div>

        <div className="bg-zinc-800 w-1/2 text-white p-1 pr-5 m-auto rounded-4xl border border-zinc-800 flex h-16">
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
  );
}

export default App;
