import pdfjs from "pdfjs-dist/es5/build/pdf.js";
// @ts-ignore
//import pdfjsWorker from "pdfjs-dist/es5/build/pdf.worker.entry.js";
//pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import fs from "fs";

const run = async () => {
  let w;
  w = await pdfjs.getDocument(fs.readFileSync("konto.pdf")).promise;
  //w = await pdfjs.getDocument({ url: "konto.pdf" }).promise;

  for (let pageNum = 0; pageNum < w.numPages; pageNum++) {
    let page = null;
    try {
      page = await w.getPage(pageNum);
    } catch (e) {}
    if (page == null) continue;

    const content = await page.getTextContent();
    const strings = content.items.map((i) => i.str);

    let row = "";
    let isProducing = false;
    let currMinMaxMonthYear: MinMax | null = null;
    let rows: string[] = [];

    strings.forEach((el, idx) => {
      if (el.includes("Periode")) {
        currMinMaxMonthYear = extractMinMaxMonthYear(el);
      }
      if (isEnd(el)) {
        rows.push(row + " -- " + el);
        isProducing = false;
      } else if (isProducing) {
        row += " -- " + el;
      } else if (isStart(idx, strings)) {
        row = currMinMaxMonthYear?.min + ": " + el;
        isProducing = true;
      }
    });

    console.log(rows.join("\n"));
  }
};

type MinMax = { min: string; max: string };
const extractMinMaxMonthYear = (item: string): MinMax => {
  const reg = /Periode: \d\d[.](?<min>\d\d[.]\d{4}) til \d\d[.](?<max>\d\d[.]\d{4})/i;
  const g = item.match(reg)?.groups ?? {};
  return { min: g.min, max: g.max } as MinMax;
};

const isEnd = (item: string) => item.includes("Arkivreferanse:");

const isStart = (idx: number, items: string[]) => {
  if (idx >= items.length - 7) {
    return false;
  }
  const isDayMonth = (value: string) => {
    if (value.length != 5) {
      return false;
    }
    const [day, month] = value.split(".").map(Number);
    return day > 0 && day <= 31 && month > 0 && month <= 12;
  };

  return isDayMonth(items[idx]) && isDayMonth(items[idx + 1]);
};

run();
