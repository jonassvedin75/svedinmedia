// Summarize idea flow.
'use server';

/**
 * @fileOverview Summarizes an idea using AI.
 *
 * - summarizeIdea - A function that summarizes an idea.
 * - SummarizeIdeaInput - The input type for the summarizeIdea function.
 * - SummarizeIdeaOutput - The return type for the summarizeIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIdeaInputSchema = z.object({
  idea: z.string().describe('The idea to summarize.'),
});
export type SummarizeIdeaInput = z.infer<typeof SummarizeIdeaInputSchema>;

const SummarizeIdeaOutputSchema = z.object({
  summary: z.string().describe('The summary of the idea.'),
});
export type SummarizeIdeaOutput = z.infer<typeof SummarizeIdeaOutputSchema>;

export async function summarizeIdea(input: SummarizeIdeaInput): Promise<SummarizeIdeaOutput> {
  return summarizeIdeaFlow(input);
}

const summarizeIdeaPrompt = ai.definePrompt({
  name: 'summarizeIdeaPrompt',
  input: {schema: SummarizeIdeaInputSchema},
  output: {schema: SummarizeIdeaOutputSchema},
  prompt: `Summarize the following idea:\n\n{{{idea}}}`, 
});

const summarizeIdeaFlow = ai.defineFlow(
  {
    name: 'summarizeIdeaFlow',
    inputSchema: SummarizeIdeaInputSchema,
    outputSchema: SummarizeIdeaOutputSchema,
  },
  async input => {
    const {output} = await summarizeIdeaPrompt(input);
    return output!;
  }
);
