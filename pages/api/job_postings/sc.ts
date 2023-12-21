import { NextApiRequest, NextApiResponse } from "next";
import { chromium } from "playwright";
import sizeOf from "image-size";
import OpenAI from "openai";

import { insert } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { url } = req.body;

    try {
      const browser = await chromium.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(10000);
      await page.screenshot({
        path: "screenshot.png",
        fullPage: true,
      });
      //   const base64 = buffer.toString("base64");
      //   const dims = sizeOf(buffer);
      const dims = sizeOf("screenshot.png");
      browser.close();
      console.log(dims);
      //   const response = await openai.chat.completions.create({
      //     model: "gpt-4-vision-preview",
      //     stream: false,
      //     messages: [
      //       {
      //         role: "system",
      //         content:
      //           "You are Resume Ralph, the world's leading resume assistant. You help users assess job opportunities and customize their resumes to most closely match the job description. Your task right now is to extract the job posting from a website screenshot that is provided to you by the user. You will extract the job description accurately and completely. Focus on extracting key elements like responsibilities, qualifications, and requirements, word for word. Ignore irrelevant content such as website navigation, footers, 'similar job' sections and other information not relevant to the job posting. Return the extracted text in Markdown syntax.",
      //       },
      //       {
      //         role: "user",
      //         content: [
      //           {
      //             type: "image_url",
      //             image_url: {
      //               url: `data:image/jpeg;base64,${base64}`,
      //             },
      //           },
      //         ],
      //       },
      //     ],
      //     max_tokens: 500,
      //   });
      //   console.log(response);
      //   const data = response["choices"][0].message.content;
      //   console.log(data);

      res.status(200).json({ url, dims,  });
    } catch (error: unknown) {
      const message = (error as Error).message || "Unable to save job posting.";
      res.status(500).json({ message: message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
