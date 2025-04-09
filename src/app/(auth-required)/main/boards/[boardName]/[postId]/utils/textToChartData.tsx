import React from "react";
import { useRef } from "react";

type chartType = {
  data: string[][];
  index: number;
  length: number;
};

// 해결 방향: 들어온 문자열을 replace하는 방향으로(차트 데이터를 가공해서)
const checkChartTypeList = (content: string) => {
  const matches = content.match(/\[\[.*?\]\]/g);
  if (!matches) return content;

  const filtered: chartType[] | undefined = matches.map((raw) => {
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
      }
    } catch (e) {
      return;
    }
  });
  const list = [];
  let result = [];
  for (let chart of filtered) {
    if (chart) {
      const { data, index, length } = chart;
      let newData = [];
      let headerLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = data[i];
        let newCol = [];
        for (let j = 0; j < col.length; j++) {
          const td = col[j];
          if (
            (td !== "" || /(\\[nrtbf\\'""])/.test(td)) && // 이스케이프 코드의 유지를 위한 정규 표현식
            !/[\u2190-\u21FF]/.test(td) // 화살표 제거를 위한 정규 표현식
          ) {
            if (i === 0) headerLength += 1;
            newCol[j] = (
              <td className="border border-gray-300 text-xs p-1">
                {td.replaceAll("\n", " ").trim()}
              </td>
            );
          }
        }
        if (newCol.length > 0) {
          newData.push(<tr className="border border-gray-300">{...newCol}</tr>);
        }
      }
      list.push({
        data: (
          <table className="w-full border-collapse border border-gray-400 my-3">
            {...newData}
          </table>
        ),
        index: index,
        length: length,
      });
    }
  }
  if (list.length) {
    result.push(content.slice(0, list[0].index));
    if (list.length === 1) {
      const { data, index, length } = list[0];
      result.push(data);
      result.push(content.slice(index + length + 1, content.length));
    }
    return result;
  } else return content;
};

export { checkChartTypeList };