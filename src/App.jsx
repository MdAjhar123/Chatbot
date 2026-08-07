
import './App.css'

function App() {

  return (
    <div className='grid grid-cols-5 text-center'>
      <div className='col-span-1 bg-zinc-800 h-screen'>side bar </div>
      
      <div className='col-span-4 p-10'>main bar
        <div className='container h-90'>
          Main content after result
        </div>
        <div className='bg-zinc-800 w-1/2 text-white p-1 pr-5 m-auto rounded-4xl border border-zinc-800 flex h-16'>
          <input type="text" className='w-full h-full p-3 outline-none' placeholder='Ask me anything'/>
          <button>Ask</button>
        </div>
      </div>
    </div>
  )
}

export default App
