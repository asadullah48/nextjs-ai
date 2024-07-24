"use client";

//import the custom hook for getting the response from the OpenAI API
import useOpenAI from './hooks/useOpenAI';


import {useState, useRef, useEffect, FormEvent} from 'react';

type Message = {
  role: string;
  content: string;
};

export default function Home() {
  //initialize the custom hook
  const getCompletion = useOpenAI();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  //initial chats for the site
  let content: Message[]  = [
    {role: "user", content: "Are you ready to write about any topic for me"},
    {role: "assistant", content: "Always ready bruv. what is your topic?"}
  ]

  //this state stores the input value
  let [input, setInput] = useState<string>('');
  //this state stores the chats
  let [chats, setChats] = useState<Message[]>(content);
  //this state keeps track of when the AI is typing
  let [isTyping, setIsTyping] = useState<boolean>(false);

  //handleChat event handler for the submit event
  let handleChat = async (prompt: string, e: FormEvent) => {
    //prevent the form from reloading the entire page when submitting
    e.preventDefault();

    //if there is no value in the input or it is clicked when the isTyping is true, do nothing
    if (!prompt || isTyping) return;

    //set isTyping state to true. 'true' adds an element displaying 'AI typing'
    setIsTyping(true);

    //clear the content of the input state. This also clears the input element which displays the value.
    setInput('');

    //updates the chats state with the prompt sent from the input
    setChats(prevChats => {
      const updatedChats = [...prevChats, { role: 'user', content: prompt}];
      return updatedChats;
    });

    try {
      //send the prompt through the openai api and wait for the response
      const result = await getCompletion(prompt);
      
      //update the chat prompt with response gotten from the openai api
      setChats(prevChats => {
        const updatedChats = [...prevChats, Object(result)];
        return updatedChats;
      });

      //set isTyping state to false. 'false' removes the element displaying 'AI typing'
      setIsTyping(false)

    } catch (error) {
      //catch any possible error from the request
      console.error("Error fetching completion:", error);

      //set isTyping state to false. 'false' removes the element displaying 'AI typing'
      setIsTyping(false)
    }
  }
  useEffect(() => {
    if (chatContainerRef.current) {
      //whenever the chats state is updated, scroll to the bottom of the container element to display the recent messages
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chats]);

  return (
  <main ref={chatContainerRef} className='h-[100vh] overflow-y-scroll bg-[rgba(55,55,55,1)]'>
    
      <header className="fixed w-[100%] top-0 left-0 p-[10px] px-[20px] text-white text-center bg-[#242424]">
        <a className='text-[15px]'>WriterAI</a>
      </header>

      {/*this section displays the chats*/}
      <div className=' py-[100px]'>
        <div className='w-[90%] md:w-[80%] lg:w-[70%] mx-auto'>
          {
            //the content of chats state is looped to display the content. if the content is from the user, it will be aligned to the right. if it's from the AI, it'll be aligned to the left
            chats.map((data, index) => (
              <div key={index} className={`${data.role == 'user'? 'text-right': 'text-left'} my-[30px]`}>
                <p className="text-[15px] bg-[#4d4d4dff] max-w-[60%] p-[10px] lg:p-[20px] rounded-xl text-left text-[#f2f2f2ff] inline-block">
                  {data.content}
                </p>
              </div>
            ))
          }
          {/*if the isTyping state is true, display the element. if not, hide it.*/}
          <div className={isTyping? 'block': 'hidden'}> 
            <div className='text-left my-[30px]'>
              <p className="text-[15px] bg-[#4d4d4dff] max-w-[60%] p-[10px] lg:p-[20px]  rounded-xl text-center text-[#f2f2f2ff] inline-block">
                AI Typing...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='fixed w-[100%] p-[10px] bottom-0 bg-[#242424]'>
        {/*when the form is submitted, activate a submit event that sends the value of the input and the event to the handleChat function */}
        <form action='' onSubmit={(e) => handleChat(input, e)}>
          <input className=" lg:w-[50%] w-[70%] ml-[5%] lg:ml-[20%] p-[10px] outline-none bg-[#4d4d4dff] text-[15px] text-[#f2f2f2ff]" type='text' value={input} placeholder='Ask your questions' onChange={ (e) => setInput(e.target.value)}/>
          <button className='py-[10px] px-[20px] bg-black text-[15px] text-[#f2f2f2ff]'>Ask</button>
        </form>
      </div>
  </main>
  );
}
