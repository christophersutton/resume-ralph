import * as cheerio from "cheerio";

export function cleanHTML(content: string): string {
  const $ = cheerio.load(content);

  // Remove script tags
  $("script").remove();
  $("img").remove();
  $("footer").remove();
  $(".hidden").remove();
  //linkedin similar jobs section
  console.log("Before removal:", $('.js-similar-jobs-list').length > 0);

  $(".js-similar-jobs-list").remove();
  $("form").remove();
  $("nav").remove();
  $("iframe").remove();
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

  //   $("li").each((index, element) => {
  //     if ($(element).find("a").length === 0) {
  //       // Check if <li> does not contain <a>
  //       const deepestChildText = getDeepestChildText(element);
  //       $(element).empty().append(deepestChildText);
  //     }
  //   });

  return $.html();
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
