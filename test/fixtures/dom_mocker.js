/* eslint indent: "off" */

const body = (code) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
<body>
  <div>
    ${code}
  </div>
</body>
</html>`;

const preWrap = (code) => `<pre><code>${code}</code></pre>`;

/*
 * Takes an array of snippets and optionally prewraps them,
 * then appends to the HTML body and returns the result
 */
export default function appendSnippets (snippets, wrap = true) {
  const children = wrap ? snippets.map(preWrap) : snippets;
  return body(children.join('\n'));
}
