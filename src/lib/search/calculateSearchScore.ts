import { normalizeSearchText } from "@/lib/search/normalizeSearchText";

function getEditDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () => []);

  for (let i = 0; i <= a.length; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function isSimilar(term: string, candidate: string): boolean {
  if (term === candidate) {
    return true;
  }

  const distance = getEditDistance(term, candidate);
  return distance <= 1 || distance <= Math.floor(candidate.length * 0.15);
}

export function calculateSearchScore(
  query: string,
  target: string,
  aliases: string[] = [],
): { score: number; matchedTerms: string[] } {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedTarget = normalizeSearchText(target);
  const normalizedAliases = aliases.map(normalizeSearchText);

  if (!normalizedQuery) {
    return { score: 0, matchedTerms: [] };
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const targetTokens = normalizedTarget.split(" ").filter(Boolean);

  const matchedTerms: string[] = [];
  let score = 0;

  for (const token of queryTokens) {
    const exactMatch = targetTokens.find((term) => term === token);
    const aliasMatch = normalizedAliases.find((alias) => alias.includes(token) || token.includes(alias));
    const similarMatch = targetTokens.find((term) => isSimilar(token, term));

    if (exactMatch) {
      matchedTerms.push(token);
      score += 2;
      continue;
    }

    if (aliasMatch) {
      matchedTerms.push(token);
      score += 1.5;
      continue;
    }

    if (similarMatch) {
      matchedTerms.push(token);
      score += 1;
    }
  }

  const bestScore = queryTokens.length * 2;
  return {
    score: bestScore > 0 ? score / bestScore : 0,
    matchedTerms,
  };
}
