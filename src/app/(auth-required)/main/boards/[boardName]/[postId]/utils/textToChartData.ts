// const matches = post.content.match(/\[\[.*?\]\]/g);
// const idx = post.content.indexOf(matches[0]);
// const filtered = matches.map((raw) => {
//   try {
//     const parsed = JSON.parse(raw.replace(/'/g, '"')); // 작은따옴표 → JSON 호환
//     if (
//       Array.isArray(parsed) &&
//       parsed.length >= 2 &&
//       parsed.every((row) => Array.isArray(row))
//     ) {
//       return parsed;
//     }
//   } catch (e) {
//     return null;
//   }
// });
// console.log(matches);
// const test = post.content.split(matches[0]);
// console.log(test);

// 해결 방향: 들어온 문자열을 replace하는 방향으로(차트 데이터를 가공해서)
const checkChartTypeList = (content: string) => {
  const matches = content.match(/\[\[.*?\]\]/g);
  const filtered = matches.map((raw) => {
    try {
      
    } catch (e) {
      return null;
    }
  })
}


// const matches = post.content.match(/\[\[.*?\]\]/g);
// console.log("matches", matches);
// const filtered = matches.map((raw) => {
//   try {
//     const parsed = JSON.parse(raw.replace(/'/g, '"')); // 작은따옴표 → JSON 호환
//     // console.log(parsed)
//     if (
//       Array.isArray(parsed) &&
//       parsed.length >= 2 &&
//       parsed.every((row) => Array.isArray(row))
//     ) {
//       return {
//         data: parsed,
//         index: post.content.indexOf(raw),
//         length: raw.length,
//       };
//       // return [parsed, post.content.indexOf(raw), raw.length];
//     }
//   } catch (e) {
//     return;
//   }
// });