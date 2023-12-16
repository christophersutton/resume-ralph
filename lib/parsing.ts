import * as cheerio from "cheerio";
import { chromium } from "playwright";
import TurndownService from "turndown";

export async function fetchSPAContent(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5000);
    const content = await page.evaluate(() => document.body.innerHTML);

    return cleanHTML(content);
  } catch (error) {
    console.error("Error fetching SPA content:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

export function cleanHTML(content: string): string {
  const $ = cheerio.load(content);

  // Remove script tags
  $("script").remove();
  $("style").remove();
  $("img").remove();
  $("footer").remove();
  $(".hidden").remove();
  //linkedin similar jobs section
  console.log("Before removal:", $(".js-similar-jobs-list").length > 0);

  $(".js-similar-jobs-list").remove();
  $("form").remove();
  $("nav").remove();
  //   $("iframe").remove();
  $("[style*='display: none']").remove();

  // Function to get the deepest child's text
  const getDeepestChildText = (element: cheerio.Element): string => {
    let children = $(element).children();
    while (children.length > 0) {
      element = children.first()[0];
      children = $(element).children();
    }
    return $(element).text();
  };

  // Iterate over each <a> tag and clean it
  $("a").each((index, element) => {
    const deepestChildText = getDeepestChildText(element);
    $(element).empty().append(deepestChildText);
  });

  return $.html();
}

export function createMarkdown(html: string) {
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(html);
  return cleanMarkdown(markdown);
}

function removeNewlinesInLinks(markdownText: string) {
  const brokenLinkPattern = /\[([^\]]+)\]\n+?\(([^)]+)\)/g;
  return markdownText.replace(brokenLinkPattern, "[$1]($2)");
}
function consolidateAdjacentLinks(markdownText: string) {
  const adjacentLinkPattern = /\]\(\w+\)\[/g;
  return markdownText.replace(adjacentLinkPattern, "](");
}
export function cleanMarkdown(markdownText: string) {
  return consolidateAdjacentLinks(removeNewlinesInLinks(markdownText));
}
