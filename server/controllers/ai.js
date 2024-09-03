const { default: OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: "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", // Your OpenAI API key here, I used "-" to avoid errors when the key is not set but you should not do that
});


const chat = async (req,res) => {
    const userMessage = req.body.body;
    if (!userMessage) {
      res.send({
        messages: [
          {
            text: "Nigga?",
          },
        ],
      });
      return;
    }
  
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      temperature: 0.6,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
          You are a gym assistant.
          You will always reply with a JSON array of messages. With a maximum of 1 messages.
          `,
        },
        {
          role: "user",
          content: userMessage || "Hello",
        },
      ],
    });
    let messages = JSON.parse(completion.choices[0].message.content);
    if (messages.messages) {
      messages = messages.messages; // ChatGPT is not 100% reliable, sometimes it directly returns an array and sometimes a JSON object with a messages property
    }
  
    console.log(messages);
    res.send({ messages });
};

module.exports = {
    chat,
};