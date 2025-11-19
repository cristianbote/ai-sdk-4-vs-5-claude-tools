import { anthropic } from 'v4-anthropic';
import { anthropic as anthropic5 } from '@ai-sdk/anthropic';
import { generateText } from 'v4-ai';
import { generateText as generateText5 } from 'ai';
import { tool, Output } from 'v4-ai';
import { tool as tool5, Output as Output5 } from 'ai';
import { z } from 'zod';

const model = 'claude-sonnet-4-5-20250929';

const toolsv5 = {
  getWeather: tool5({
    description: 'Get the weather for a given city',
    inputSchema: z.object({
      city: z.string().describe('The city to get the weather for'),
    }),
    execute: async ({ city }) => `The weather in ${city} is sunny`,
  }),
};

const toolsv4 = {
  getWeather: tool({
    description: 'Get the weather for a given city',
    parameters: z.object({
      city: z.string().describe('The city to get the weather for'),
    }),
    execute: async ({ city }) => `The weather in ${city} is sunny`,
  }),
};

async function generateTextV4({ model, prompt, system, output }) {
  try {
    const result = await generateText({
      model: anthropic(model),
      experimental_output: Output.object({
        schema: output,
      }),
      system: system,
      prompt: prompt,
      tools: toolsv4,
    });
    console.log({
      responsev4: JSON.stringify(result?.response?.messages, null, 2),
    });
  } catch (error) {
    console.error({
      errorv4: error,
    });
  }
}

async function generateTextV5({ model, system, prompt, output }) {
  try {
    const result = await generateText5({
      model: anthropic5(model),
      experimental_output: Output5.object({
        schema: output,
      }),
      system: system,
      prompt: prompt,
      tools: toolsv5,
    });
    console.log({
      responsev5: JSON.stringify(result?.response?.messages, null, 2),
    });
  } catch (error) {
    console.error({
      errorv5: error,
    });
  }
}

const payload = {
  model,
  system: 'You are a weather assistant. You are given a city and you need to return the weather for that city.',
  prompt: 'What is the weather in Tokyo?',
  output: z.object({
    weather: z.string().describe('The weather for the given city'),
  }),
};

await Promise.allSettled([generateTextV4(payload), generateTextV5(payload)]);
