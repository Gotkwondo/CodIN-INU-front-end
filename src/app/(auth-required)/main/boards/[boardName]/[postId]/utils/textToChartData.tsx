// 해결 방향: 들어온 문자열을 replace하는 방향으로(차트 데이터를 가공해서)
const checkChartTypeList = (content: string) => {
  const matches = content.match(/\[\[.*?\]\]/g);
  if (!matches) return content;

  const filtered = matches.map((raw) => {
    try {
      const parsed = JSON.parse(raw.replace(/'/g, '"')); // 작은따옴표 → JSON 호환
      if (
        Array.isArray(parsed) &&
        parsed.length >= 2 &&
        parsed.every((row) => Array.isArray(row))
      ) {
        return {
          data: parsed,
          index: content.indexOf(raw),
          length: raw.length,
        };
        // return [parsed, post.content.indexOf(raw), raw.length];
      }
    } catch (e) {
      return content;
    }
  });
  console.log(filtered);
};

export { checkChartTypeList };