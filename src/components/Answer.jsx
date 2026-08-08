import { useEffect, useState } from "react"
import { checkHeading, replaceHeadingStarts } from "../helper"

const Answer = ({ans, totalResult, index})=>{

    const[heading, setHeading] = useState(false)
    const[answer, setAnswer] = useState(ans)

    useEffect(()=>{
        if(checkHeading(ans)){
            setHeading(true);
            setAnswer(replaceHeadingStarts(ans));
        }

        
    }, [])

    

    return(
        <>
            {
                index==0 && totalResult>1 ?<span className="pt-2 text-xl block text-white">{answer}</span>
                :heading?<span className={"pt-2 text-lg block text-white"} >{answer}</span> 
            :<span className="pl-8 text-sm" >{answer}</span>
            }
        </>
    )
}
export default Answer