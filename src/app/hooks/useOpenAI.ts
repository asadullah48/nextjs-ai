import { useState } from 'react';
import OpenAI from 'openai';

const API_KEY = 'YOUR-API-KEY';

function useOpenAI() {
  const client = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

  const getCompletion = async (prompt: string) => {
    try {
      let completion = await client.chat.completions.create({
        messages: [
          { "role": "system", "content": "Your job is to write about any topic asked by the user" },
          { "role": "user", "content": prompt }
        ],
        model: "gpt-3.5-turbo",
      });
  
      return completion.choices[0].message;
    } catch(e){
      return {"role": "assistant", "content": "Something went wrong"}
    }
    
  };

  return getCompletion;
}

export default useOpenAI;
