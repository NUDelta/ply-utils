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
 * Takes an array of snippets and preWraps them,
 * then appends to the HTML body and returns the result
 */
export default function appendSnippets (snippets) {
  const children = snippets.map(preWrap)
    .join('\n');

  return body(children);
}