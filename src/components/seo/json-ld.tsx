/**
 * Renders a JSON-LD block. Input comes only from src/lib/structured-data.ts,
 * never from user input, and `<` is escaped so the payload cannot break out of
 * the script element.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
