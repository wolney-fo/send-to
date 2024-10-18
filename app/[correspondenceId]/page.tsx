"use client";
import { useState, useEffect } from "react";
import { copyTextToClipboard } from "../utils/copy-text-to-clipboard";
import { formatUrl } from "../utils/format-url";

export default function Page({
  params,
}: {
  params: { correspondenceId: string };
}) {
  const { correspondenceId } = params;
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent("This is the correspondence content =D.");
  }, [correspondenceId]);

  const urlPatternRegex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;

  return (
    <main className="pt-48 pb-24 font-medium text-center text-slate-800">
      <div className="flex flex-col gap-1 p-12 border w-3/4 md:w-2/4 max-w-screen-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Received correspondence</h1>

        <textarea
          rows={8}
          value={content}
          disabled
          className="p-4 font-mono rounded-lg w-full mx-auto outline-none duration-300 border"
        ></textarea>

        <div className="flex items-center justify-center gap-4">
          <button
            disabled={!content}
            onClick={() => copyTextToClipboard(content)}
            className="inline-block text-white bg-black duration-300 disabled:opacity-60 disabled:cursor-not-allowed p-2 w-full rounded-lg"
          >
            Copy to clipboard
          </button>

          {content.match(urlPatternRegex) && (
            <a
              href={formatUrl(content)}
              className="inline-block text-white bg-black duration-300 disabled:opacity-60 disabled:cursor-not-allowed p-2 w-full rounded-lg"
            >
              Open in browser
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
