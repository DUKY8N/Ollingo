import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:11434";
const DEFAULT_MODEL = "gemma3:4b";
const DEFAULT_SOURCE_LANG = "English";
const DEFAULT_TARGET_LANG = "Korean";

interface TranslationParams {
  text: string;
  from?: string;
  to?: string;
  model?: string;
}

type PromptParams = Pick<TranslationParams, "text" | "from" | "to">;

const createTranslationPrompt = ({
  text,
  from = DEFAULT_SOURCE_LANG,
  to = DEFAULT_TARGET_LANG,
}: PromptParams): string => `Translate from ${from} to ${to}.
Core requirements:
- Consider full context and maintain terminology consistency
- Use established terms and translate idioms naturally for ${to}
- Keep technical identifiers in original form when appropriate
Quality guidelines:
- Ensure natural sentence structure and appropriate formality for ${to}
- Prioritize accuracy and clarity
Output: Translation only. Do not provide explanations, alternatives, or additional commentary.
${from}: ${text}
${to}:`;

const translateText = async (params: TranslationParams): Promise<string> => {
  const {
    text,
    from = DEFAULT_SOURCE_LANG,
    to = DEFAULT_TARGET_LANG,
    model = DEFAULT_MODEL,
  } = params;

  if (!text?.trim()) throw new Error("Text is required for translation");

  const res = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt: createTranslationPrompt({ text, from, to }),
      stream: false,
      options: { temperature: 0 },
    }),
  });

  if (!res.ok) throw new Error(`Translation service error (${res.status})`);

  const data: { response?: string } = await res.json();
  const result = data.response?.trim();

  if (!result) throw new Error("Empty response from translation service");

  return result;
};

const useTranslation = () => {
  return useMutation({
    mutationFn: translateText,
    retry: 2,
  });
};

export default useTranslation;
