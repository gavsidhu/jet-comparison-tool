import openai from "@/lib/openai"
import { Jet } from "@prisma/client"

const exampleJSON = {
    rank: "<integer: rank of the jet based on comparison>", name: "<string: name of the jet>", value: "<string/integer: value of the jet for the comparison>"
}

type Criteria = "topSpeed" | "maxSeating" | "fuelEfficiency"

type RequestBody = {
    criteria: Criteria,
    jets: Jet[]
}

const criteriaPrompts = {
    "topSpeed": "top speed (return value with units)",
    "maxSeating": "max speed (return value as integer)",
    "fuelEfficiency": "fuel efficiency (return value with units)"
}


export async function POST(request: Request) {
    const body = await request.json() as RequestBody
    const { criteria, jets } = body

    let promptMsg = `Compare and rank the following jets by ${criteriaPrompts[criteria]}:\n`;

    jets.forEach(jet => {
        promptMsg += `${jet.name}\n`
    })

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a helpful assistant that compares jets by a comparison critera and outputs the results as a JSON Array. Each object should have the following structure: ${JSON.stringify(exampleJSON)}. Return the data under the key "results"`,
            },
            { role: "user", content: promptMsg },
        ],
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
        max_tokens: 500,
        seed: 888
    });

    return Response.json(completion.choices[0].message.content?.trim())
}
