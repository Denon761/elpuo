/**
 * Renders a JSON-LD structured-data block. Server component — the script
 * ships in the initial HTML so crawlers and AI systems see it without JS.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: no user input, and </script>
      // cannot appear in a JSON string without being escaped as <\/script>.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
