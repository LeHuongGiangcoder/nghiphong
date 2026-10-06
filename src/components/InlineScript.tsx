/**
 * An inline `<script>` that runs once, while the document is parsing.
 *
 * The type switch is the documented way to render one of these without a
 * development warning — see "Preventing a flash before hydration" in the Next
 * docs. The server writes a real script, the hydrating client writes inert
 * `text/plain`, and `suppressHydrationWarning` lets the DOM's version stand so
 * the script is never re-run.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
