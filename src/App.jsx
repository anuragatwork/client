import { useState ,useEffect} from 'react'
import send from './assets/send.svg'
import user from './assets/user.png'
import loadingIcon from './assets/loader.svg'
import bot from "./assets/bot.png"
import axios from "axios";


function App() {
  const [input,setInput]=useState("");
  const [posts,setPosts]=useState([]);
  useEffect(()=>{
    document.querySelector(".layout").scrollHeight;
  },[posts]);
  const fetchBotResponse=async ()=>{
    const {data}= await axios.post(
      "https://code-ui2d.onrender.com", //server location uri
      {message:input}, // input
      { 
        headers:{ //headers
          "Content-Type" : "application/json",
        },
      }
    )
    return data;
  };
  const onSubmit=()=>{
      if(input.trim()==='') return;
      let saveInput=input;
      //when user submit the prompt erase the prompt from the ui add our prompt in ui
      updatePosts(saveInput,false);
      setInput("");
      //in mean time show lopading and before that 
      updatePosts("loading  please wait ... ",true);
      //fetch the response for the query submitted just now
      fetchBotResponse().then((res)=>{
        let response=res.botResponse;
        //we got the reponse hence remove the loading and set new post
        setPosts(prevState=>{
          //removing the loading 
          prevState.pop();
          //adding new post
          return [...prevState,
            {type:"user",post:saveInput},
            {type:"bot",post:response}];
        });
        console.log(response);
      });

    }
  const updatePosts=(post,isLoading)=>{
      setPosts(prevState=>{
        return [...prevState,{type:isLoading?"loading":"user",post:post}];
      });
  }


  const onKeyUp=(e)=>{
    if(e.key==="Enter" || e.which===13){
      onSubmit();
    }
    
  }

  return (
    <main className='chatGPT-app'>
      <section className='chat-container'>
        <div className="layout">
          {posts.map((post, index) => (
            <div className={`chat-bubble ${post.type==="bot"|| post.type==="loading" ? "bot":""}`}  key={index}>
              <div className="avatar">
                <img src={post.type==="bot"|| post.type==="loading" ? bot:user} alt="user image" />
              </div>
              {post.type==="loading" ?
                (
                  <div className="loader">
                  <img src={loadingIcon} alt="loading" />
                  </div>
                )
                :
                (
                  <div className="post">
                    {post.post}
                  </div>
                )
              } 
            </div>
          ))} 
        </div>
      </section>
      <footer>
        <input 
          value={input}
         className="composebar"
         autoFocus={true}
          type="text" 
          placeholder='Ask anything'
          onChange={(e)=>{setInput(e.target.value)}}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="send btn" />
        </div>
      </footer>
    </main>
  );
}

export default App
