
import { useState } from 'react'
import './App.css'
import { URL } from './constant'
import Answer from './components/Answer'

function App() {
  
  const [question, setQuestion] =  useState("")
  const [result, setResult] = useState([])
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem('history')))

  const payload = {
    "contents": [
      {
        "parts": [
          {
            "text": question
          }
        ]
      }
    ]
  }
  const handleAskQuestion = async()=>{
    
    if(!question){
      return false
    }

    if(localStorage.getItem('history')){
      let history = JSON.parse(localStorage.getItem('history'))
      history = [question, ...history]
      localStorage.setItem('history', JSON.stringify(history))
      setRecentHistory(history)
    }
    else{
      localStorage.setItem('history', JSON.stringify([question]))
      setRecentHistory(question)
    }

    let response = await fetch(URL, {
      method:"POST",
      body: JSON.stringify(payload)
    })
    response = await response.json()
    let dataString = response.candidates[0].content.parts[0].text
    dataString = dataString.split("* ")
    dataString = dataString.map((item)=>item.trim())

    // console.log(dataString);
    setResult([...result, {type:'q', text: question}, {type:'a', text: dataString}])
    setQuestion('')
    

  }
  // console.log(recentHistory);

  const clearHistory = ()=>{
    localStorage.clear();
    setRecentHistory([])
  }

  const isEnter = (event)=>{
    if(event.key == "Enter"){
      handleAskQuestion()
    }
  }
  

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      <div className='col-span-1 bg-zinc-800 pt-3'>
        <h1 className='text-white text-xl flex text-center justify-center'>
          <span>Recent Search</span>
        <button onClick={clearHistory} className='cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></button>
        </h1>
        <ul className='text-left overflow-auto mt-2'>
          {
            recentHistory && recentHistory.map((item)=>(
              <li className='pl-5 px-5 truncate text-zinc-400 hover:bg-zinc-700 cursor-pointer hover:text-zinc-200'>{item}</li>
            ))
          }
        </ul>
      </div>
      
      <div className='col-span-4 p-10'>
        <div className='container h-100 overflow-auto'>
          <div className='text-white'>
       
            <ul>
              {
                result.map((item,index)=>(
                  <div key={index+Math.random} className={item.type=='q'?"flex justify-end":''}>
                    { 
                      item.type=='q'?
                      <li key={index} className='text-right p-1 border-8 border-zinc-700 bg-zinc-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl w-fit text-just'><Answer ans={item.text} totalResult={1} index={index} type={item.type} /></li>
                      :item.text.map((ansItem, ansIndex)=> (
                        <li key={ansIndex} className='text-left p-1'><Answer ans={ansItem} totalResult={result.length} type={item.type} index={ansIndex} /></li>
                      ))
                    }
                  </div>
                ))
              }
            </ul>
            
          </div>
          
        </div>

        <div className='bg-zinc-800 w-1/2 text-white p-1 pr-5 m-auto rounded-4xl border border-zinc-800 flex h-16'>
          <input type="text" value={question} onKeyDown={isEnter} onChange={(e)=>setQuestion(e.target.value)} className='w-full h-full p-3 outline-none' placeholder='Ask me anything'/>
          <button onClick={handleAskQuestion}>Ask</button>
        </div>
      </div>
    </div>
  )
}

export default App
