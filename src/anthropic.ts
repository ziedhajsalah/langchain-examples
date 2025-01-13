import dotenv from "dotenv";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

dotenv.config();

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

export async function getClaudeOutput(input: string) {
  const claude = new ChatAnthropic({
    anthropicApiKey,
    model: "claude-3-5-haiku-20241022",
    temperature: 0,
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    `What are three good names for a company that makes {product}?`,
  );

  const outputParser = new StringOutputParser();

  const sequence = RunnableSequence.from([prompt, claude, outputParser]);
  const response = await sequence.batch([
    { product: "coffee" },
    { product: "cake" },
  ]);

  return response;
}

export async function getClaudeOutputStream(input: string) {
  const claude = new ChatAnthropic({
    anthropicApiKey,
    model: "claude-3-5-haiku-20241022",
    temperature: 0,
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    `What are three good names for a company that makes {product}?`,
  );

  const outputParser = new StringOutputParser();

  // const chain = prompt.pipe(claude).pipe(outputParser);

  // const response = await chain.invoke({ product: "shiny objects" });
  const sequence = RunnableSequence.from([prompt, claude, outputParser]);
  const response = await sequence.stream({ product: "coffee" });

  return response;
}
