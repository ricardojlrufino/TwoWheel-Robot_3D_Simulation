const url = 'https://englab.dawsoncollege.qc.ca:8080';

export interface HexiResult {
  stdout: string;
  stderr: string;
  hex: string;
}

export async function buildHex(source: string) {
  const resp = await fetch(url + '/build', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sketch: source })
  });
  return (await resp.json()) as HexiResult;
}
