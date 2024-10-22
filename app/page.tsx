"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "./components/Form";
import {
  ComposeCorrespondenceFormSchema,
  composeCorrespondenceFormSchema,
} from "./schemas/compose-correspondence-form-schema";

export default function Home() {
  const [accessUrl, setAccessUrl] = useState("");

  const composeCorrespondenceForm = useForm<ComposeCorrespondenceFormSchema>({
    resolver: zodResolver(composeCorrespondenceFormSchema),
  });

  async function onSubmit(data: ComposeCorrespondenceFormSchema) {
    await fetch("/api/compose", {
      method: "POST",
      body: JSON.stringify({
        content: data.content,
        time_to_live: data.time_to_live,
      }),
    })
      .then((response) => response.json())
      .then((data) => setAccessUrl(data.data.access_url))
      .catch(() => alert("Erro"));
  }

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = composeCorrespondenceForm;

  return (
    <main className="pt-48 pb-24 font-medium text-center text-slate-800">
      <FormProvider {...composeCorrespondenceForm}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-1 p-12 pb-0 border w-3/4 md:w-2/4 max-w-screen-2xl mx-auto"
        >
          <h1 className="text-2xl font-bold mb-8">Send to</h1>

          <div className="flex flex-col gap-4 mb-16">
            <Form.Field>
              <Form.Label htmlFor="content">Content</Form.Label>
              <Form.Textarea
                name="content"
                placeholder="A long text..."
                rows={3}
                className="p-4 font-mono rounded-lg w-full mx-auto outline-none duration-300 border"
              ></Form.Textarea>
              <Form.ErrorMessage field="content" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="time_to_live">Time to live</Form.Label>
              <Form.Select
                name="time_to_live"
                className="p-4 font-mono bg-white rounded-lg w-full mx-auto outline-none duration-300 border"
              >
                <option value={2 * 60}>2 min</option>
                <option value={5 * 60}>5 min</option>
                <option value={15 * 60}>15 min</option>
                <option value={30 * 60}>30 min</option>
              </Form.Select>
            </Form.Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-block text-white bg-black duration-300 disabled:opacity-60 disabled:cursor-not-allowed p-2 w-full rounded-lg"
            >
              Send it
            </button>

            {accessUrl && (
              <p className="p-4 font-mono bg-slate-100 border rounded">
                {accessUrl.slice(-6)}
              </p>
            )}
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
