import React from "react";

type chartType = {
  data: string[][];
  index: number;
  length: number;
};

type tableArrayType = {
  data: React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >;
  index: number;
  length: number;
} | undefined;

/**
 * 주어진 문자열 데이터에서 표 데이터로의 변환이 필요한 데이터를 filter 해주는 함수
 * @param {string} content
 * @returns {chartType[] | undefined} filteredArray
 */
const filterChartData = (
  content: string,
  matches: RegExpMatchArray
): chartType[] | undefined => {
  const filtered: chartType[] | undefined = [];

  for (let row of matches) {
    try {
      const parsed = JSON.parse(row.replace(/['"]/g, '"')); // 작은따옴표 → JSON 호환
      if (
        Array.isArray(parsed) &&
        parsed.length >= 2 &&
        parsed.every((row) => Array.isArray(row))
      ) {
        filtered.push({
          data: parsed,
          index: content.indexOf(row),
          length: row.length,
        });
      }
    } catch (e) {
      continue;
    }
  }
  return filtered;
};

/**
 *  헤더의 rowspan 개수를 세는 함수
 * @param headerData 헤더 데이터
 * @returns {number[]} 헤더의 rowspan 개수 배열
 */
const countHeaderRowspan = (headerData: string[]): number[] => {
  const headerRowspanCnt = Array.from({ length: headerData.length }, () => 0);
  // 헤더의 공백 제거를 위한 탐색
  for (let i = 0; i < headerData.length; i++) {
    const head = headerData[i];
    if (head === "") {
      let prevIdx = i;
      for (let j = i - 1; j >= 0; j--) {
        if (headerData[j] !== "") {
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
  return headerRowspanCnt;
};

/**
 * 테이블의 헤더를 만들어주는 함수
 * @param headerData 헤더 데이터
 * @param headerRowspanCnt 헤더의 rowspan 개수
 * @returns {JSX.Element[]} 헤더의 JSX 엘리먼트 배열
 */
const makeTableHeader = (headerData: string[], headerRowspanCnt: number[]) => {
  const result: JSX.Element[] = [];

  for (let i = 0; i < headerData.length; i++) {
    const thData = headerData[i];
    if (thData === "") continue; // 공백인 경우 skip
    result.push(
      <th
        key={`${thData.slice(1, 3)}_${i}`}
        colSpan={headerRowspanCnt[i]}
        className="border border-gray-300 bg-gray-100 p-2 text-xs text-center"
      >
        {thData.replaceAll("\n", " ").trim()}
      </th>
    );
  }
  return result;
};

/**
 * 테이블의 바디를 만들어주는 함수
 * @param bodyData 바디 데이터
 * @returns {JSX.Element[]} 바디의 JSX 엘리먼트 배열
 */
const makeBodyRow = (bodyData: string[][]) => {
  const bodyRows = [];
  for (let i = 1; i < bodyData.length; i++) {
    const row = [];
    for (let j = 0; j < bodyData[i].length; j++) {
      row.push(
        <td
          key={`${bodyData[i][j].slice(1, 3)}_${j}`}
          className="border border-gray-300 p-2 text-xs text-center"
        >
          {bodyData[i][j].replaceAll("\n", " ").trim()}
        </td>
      );
    }
    bodyRows.push(<tr key={i}>{row}</tr>);
  }
  return bodyRows;
};

/**
 * 테이블에 들어갈 tr 및 td 태그의 배열을 만들어주는 함수
 * @param {chartType[]} filteredArray (테이블 양식에 맞는 문자열들의 배열)
 * @returns {tableArrayType[]} 테이블에 들어갈 HTMLElement들(tr, td)
 */
const makeTableData = (filteredArray: chartType[]): tableArrayType[] => {
  let tableArray: tableArrayType[] = [];

  for (let c = 0; c < filteredArray.length; c++) {
    const chart = filteredArray[c];
    if (chart) {
      const { data, index, length } = chart;
      const headerRowspanCnt = countHeaderRowspan(data[0]); // 헤더의 rowspan 개수 세기
      const header = makeTableHeader(data[0], headerRowspanCnt);
      const bodyRows = makeBodyRow(data);

      tableArray.push({
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
  return tableArray;
};

/**
 * 가공된 테이블 데이터를 최종적으로 기존 문자열에서 테이블 부분만 수정하는 함수
 * @param {string} content - 원본 텍스트
 * @param {tableArrayType[]} tableData - 테이블 HTMLElement 배열
 * @returns {(string | JSX.Element)[]} 변환된 문자열 및 테이블 요소의 배열
 */
const makeTableArray = (
  content: string,
  tableData: tableArrayType[]
): (string | JSX.Element)[] => {
  let result = [];

  result.push(content.slice(0, tableData[0].index));
  for (let j = 0; j < tableData.length; j++) {
    const { data, index, length } = tableData[j];
    const nextIdx = j < tableData.length - 1 ? tableData[j + 1].index : content.length;
    result.push(data);
    result.push(content.slice(index + length + 1, nextIdx));
  }

  return result;
};

// 해결 방향: 들어온 문자열을 replace하는 방향으로(차트 데이터를 가공해서)
const transStringToChartData = (content: string) => {
  const matches = content.match(/\[\[.*?\]\]/g);
  if (!matches) return content;

  const filtered = filterChartData(content, matches);
  const tableData = makeTableData(filtered);

  if (tableData.length) {
    return makeTableArray(content, tableData);
  } else return content;
};

export { transStringToChartData };