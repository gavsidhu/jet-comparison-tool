import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const promptExamples: { [key: string]: ChatCompletionMessageParam[] } = {
    "topSpeed": [
        {
            role: "system",
            content: `You are a helpful assistant that compares jets by a comparison criteria and outputs the results as a JSON using the following structure: 
                [
                    {
                        "name": "the name of the jet",
                        "rank": "the rank of the jet compared to other jets in the comparison based on the value",
                        "value": "the specific comparison metric value"
                    },
                    ...
                ]

                Return all jets ranked.
                `
        },
        {
            role: "user",
            content: `Compare and rank the following jets by Top Speed: 
                Gulfstream G650
                Gulfstream G280
                Learjet 75 Liberty
                
                Please include all jets in the rankings
                `
        },
        {
            role: "assistant",
            content: `[
                {"name": "Gulfstream G650", "rank":"1", "value":"704 mph"},
                {"name": "Gulfstream G280", "rank":"2", "value":"559 mph"},
                {"name": "Learjet 75 Liberty", "rank":"3", "value":"535 mph"}

            ]`
        }
    ],
}

export default openai
