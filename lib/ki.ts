import Anthropic from "@anthropic-ai/sdk";

export const KI_MODELL = "claude-opus-5";

/**
 * Holt den Antworttext aus einer Claude-Antwort.
 *
 * Wichtig: Opus 5 denkt vor dem Antworten, deshalb kann der erste Block ein
 * Denkblock sein. Wir sammeln daher alle Textblöcke ein, statt blind den
 * ersten Block zu nehmen.
 */
export function antwortText(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

/**
 * Wenn Claude eine Anfrage aus Sicherheitsgründen ablehnt, kommt kein Text
 * zurück. Das kann bei drastischen Szenentexten passieren (Gewalt, Krimi).
 * Dann geben wir eine verständliche Meldung statt einer leeren Antwort.
 */
export function abgelehnt(message: Anthropic.Message): boolean {
  return message.stop_reason === "refusal";
}

export const ABLEHNUNG_TEXT =
  "Zu dieser Anfrage kann ich leider nichts sagen. Formuliere sie gern anders oder frag mich etwas anderes.";
