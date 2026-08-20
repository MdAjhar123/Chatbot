
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
    setResult([...result, {type:'q', text:question},{type:'a', text:dataString}])
    

  }
  console.log(recentHistory);
  

  return (
    <div className='grid grid-cols-5 text-center'>
      <div className='col-span-1 bg-zinc-800 h-screen'>
        <ul>
          {
            recentHistory.map((item)=>(
              <li>{item}</li>
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
          <input type="text" value={question} onChange={(e)=>setQuestion(e.target.value)} className='w-full h-full p-3 outline-none' placeholder='Ask me anything'/>
          <button onClick={handleAskQuestion}>Ask</button>
        </div>
      </div>
    </div>
  )
}

export default App
