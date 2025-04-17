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
      const parsed = JSON.parse(raw.replace(/['"]/g, '"')); // 작은따옴표 → JSON 호환
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

  let list = [];
  let result = [];
  for (let c = 0; c < filtered.length; c++) {
    const chart = filtered[c];
    if (chart) {
      const { data, index, length } = chart;
      const headerRowspanCnt = Array.from({ length: data[0].length }, () => 0);

      // 헤더의 공백 제거를 위한 탐색
      for (let i = 0; i < data[0].length; i++) {
        const head = data[0][i];
        if (head === "") {
          let prevIdx = i;
          for (let j = i - 1; j >= 0; j--) {
            if (data[0][j] !== "") {
              prevIdx = j;
              break;
            }
          }
          if (prevIdx !== i) {
            headerRowspanCnt[prevIdx] += 1;
          }
        } else {
          headerRowspanCnt[i] += 1;
        }
      }

      const header = [];
      for (let i = 0; i < data[0].length; i++) {
        const thData = data[0][i];
        if (thData === "") continue;
        header.push(
          <th
            key={`${thData.slice(1, 3)}_${i}`}
            colSpan={headerRowspanCnt[i]}
            className="border border-gray-300 bg-gray-100 p-2 text-xs text-center"
          >
            {thData.replaceAll("\n", " ").trim()}
          </th>
        );
      }

      // 바디 렌더링
      const bodyRows = [];
      for (let i = 1; i < data.length; i++) {
        const row = [];
        for (let j = 0; j < data[i].length; j++) {
          row.push(
            <td
              key={`${data[i][j].slice(1, 3)}_${j}`}
              className="border border-gray-300 p-2 text-xs text-center"
            >
              {data[i][j].replaceAll("\n", " ").trim()}
            </td>
          );
        }
        bodyRows.push(
          <tr key={i}>
            {row}
          </tr>
        )
      }

      // const bodyRows = data.slice(1).map((row, i) => (
      //   <tr key={i}>
      //     {row.map((cell, j) => (
      //       <td
      //         key={`${cell.slice(1, 3)}_${j}`}
      //         className="border border-gray-300 p-2 text-xs text-center"
      //       >
      //         {cell.replaceAll("\n", " ").trim()}
      //       </td>
      //     ))}
      //   </tr>
      // ));

      list.push({
        data: (
          <table
            key={`table_${c}`}
            className="w-full border border-gray-400 border-collapse my-3 text-xs"
          >
            <thead key={`th_${c}`}>
              <tr>{header}</tr>
            </thead>
            <tbody key={`tb_${c}`}>{bodyRows}</tbody>
          </table>
        ),
        index: index,
        length: length,
      });
    }
  }

  if (list.length) {
    result.push(content.slice(0, list[0].index));
    for (let j = 0; j < list.length; j++) {
      const { data, index, length } = list[j];
      const nextIdx = j < list.length - 1 ? list[j].index : content.length;
      result.push(data);
      result.push(content.slice(index + length + 1, nextIdx));
    }
    return result;
  } else return content;
};

export { checkChartTypeList };
