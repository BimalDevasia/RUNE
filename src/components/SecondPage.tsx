import "./customscroll.css"
const taglines=[{id:"AI-Powered Learning",desc:"Turn textbooks into interactive quizzes and study guides instantly!",src:"./aipowered.png"},
  {id:"Your Smart Study Companion",desc:"Generate answers, MCQs, and more—study smarter, not harder!",src:"./smartstudy.png"},
  {id:"From Textbooks to Test Prep",desc:"Generate quizzes, summaries, and answers with ease!",src:"./brain.png"}
]
function SecondPage() {
  return (
    <div className="no_overflow w-svw h-svh overflow-hidden flex flex-col" style={{backgroundImage:"URL(./hero.png)"}}>
        <div className="text-primary_green text-6xl font-bold w-full flex justify-center py-14 font-ubuntu_mono">
          Why Choose RUNE ?
        </div>
        <div>

         <div className="flex items-center justify-center w-full h-full gap-16 font-ubuntu_mono text-center ">
         {taglines.map((items,index)=>(
          <div key={index} className="w-[360px] h-[407px] rounded-3xl bg-black text-white flex flex-col justify-center items-center px-10 ">
            <img src={items.src} alt=""  />
            <div className="text-3xl font-bold">{items.id}</div>
            <div className="text-xl">{items.desc}</div>
          </div>
         ))}
         </div>
          
        </div>
    </div>
  )
}

export default SecondPage