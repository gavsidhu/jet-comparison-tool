import openai from "@/lib/openai"
import { Jet } from "@prisma/client"

const exampleJSON = {
    name: "<string: name of the jet>", value: "<string/integer: value of the jet for the comparison>"
}

type Criteria = "topSpeed" | "maxSeating" | "fuelEfficiency"

type RequestBody = {
    criteria: Criteria,
    jets: Jet[]
}

const criteriaPrompts = {
    "topSpeed": "top speed (return as integer. measured in mph. do not return units)",
    "maxSeating": "maximum seating (return value as integer)",
    "fuelEfficiency": "fuel efficiency (return value as integer. measured in gallons per hour. do not return units"
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
                content: `You are a helpful assistant that compares jets by a comparison critera and outputs the results as a JSON Array. Each object should have the following structure: ${JSON.stringify(exampleJSON)}. Return the data under the key "results". The objects should be `,
            },
            { role: "user", content: promptMsg },
        ],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
        max_tokens: 500,
        seed: 888
    });

    const res = JSON.parse(completion.choices[0].message.content?.trim() as string)

    const sortedResults = res.results.sort((a: any, b: any) => parseInt(b.value) - parseInt(a.value));
    console.log(sortedResults)

    return Response.json(sortedResults, { status: 200 })
}
