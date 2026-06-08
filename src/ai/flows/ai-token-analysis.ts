'use server';
/**
 * @fileOverview An AI agent that provides a comprehensive analysis of a specific cryptocurrency token.
 *
 * - aiTokenAnalysis - A function that handles the AI-generated token analysis process.
 * - AITokenAnalysisInput - The input type for the aiTokenAnalysis function.
 * - AITokenAnalysisOutput - The return type for the aiTokenAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AITokenAnalysisInputSchema = z.object({
  tokenSymbol: z
    .string()
    .describe(
      'The ticker symbol or full name of the cryptocurrency token to analyze.'
    ),
});
export type AITokenAnalysisInput = z.infer<typeof AITokenAnalysisInputSchema>;

const AITokenAnalysisOutputSchema = z.object({
  tokenSymbol: z
    .string()
    .describe('The ticker symbol of the analyzed cryptocurrency token.'),
  overview: z
    .string()
    .describe('A brief, high-level overview of the token and its purpose.'),
  fundamentals: z
    .string()
    .describe(
      'Key fundamental aspects of the token, including its utility, technology, team, and roadmap.'
    ),
  whitepaperSummary: z
    .string()
    .describe(
      'A summary of the project whitepaper, highlighting its core ideas, innovations, and vision.'
    ),
  sentiment: z
    .string()
    .describe(
      'An aggregated sentiment analysis based on general market perception, news, and social media trends.'
    ),
  riskFactors: z
    .string()
    .describe(
      'Potential risks and considerations associated with investing in this token.'
    ),
  conclusion: z
    .string()
    .describe(
      'A concluding statement or recommendation based on the analysis.'
    ),
});
export type AITokenAnalysisOutput = z.infer<typeof AITokenAnalysisOutputSchema>;

export async function aiTokenAnalysis(
  input: AITokenAnalysisInput
): Promise<AITokenAnalysisOutput> {
  return aiTokenAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTokenAnalysisPrompt',
  input: {schema: AITokenAnalysisInputSchema},
  output: {schema: AITokenAnalysisOutputSchema},
  prompt: `You are an expert cryptocurrency analyst providing comprehensive, unbiased reports on digital assets.
Your task is to generate a detailed analysis for the cryptocurrency token specified by the user.

Provide the analysis in a structured JSON format matching the output schema provided.
Base your analysis on publicly available information up to your last training data cut-off.

Token Symbol: {{{tokenSymbol}}}`,
});

const aiTokenAnalysisFlow = ai.defineFlow(
  {
    name: 'aiTokenAnalysisFlow',
    inputSchema: AITokenAnalysisInputSchema,
    outputSchema: AITokenAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
