import {
  getDeviceCode,
  pollCompletedDeviceCode,
  type EOSAuth,
} from "./egs-auth/index.js";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export function bootstrap(auth: EOSAuth): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const push = (text: string) =>
        controller.enqueue(encoder.encode(`${text}\n\n`));

      const { code, url } = await getDeviceCode();
      push(`Go to "${url}" to verify.`);

      for (let _ = 0; _ < 10; _++) {
        await sleep(10 * 1000);
        const result = await pollCompletedDeviceCode(code);

        if (result.type === "success") {
          push(`Auth success! Response: (${JSON.stringify(result.data)})`);
          auth.set(result.data);
          controller.close();
        } else {
          push(`Message: "${result.error}"`);
        }
      }

      push("Timeout");
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
