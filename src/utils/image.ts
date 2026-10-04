import { MAX_BYTES, MAX_PIXELS } from "@/constants/constants";
import type { LoadedImage } from "@/types/types";

async function loadImage(
  source: File | string,
  signal: AbortSignal,
): Promise<LoadedImage> {
  let blob: Blob;
  let name: string;

  if (typeof source === "string") {
    const value = source.trim();

    if (!/^https?:\/\//i.test(value) && !/^data:image\//i.test(value)) {
      throw new Error("Use an HTTP(S) image URL or an image data URL.");
    }

    name = value.startsWith("data:")
      ? "Pasted image data"
      : new URL(value).pathname.split("/").pop() || "Remote image";

    let response: Response;

    try {
      response = await fetch(value, {
        signal,
        mode: "cors",
        credentials: "omit",
      });
    } catch (error) {
      if (signal.aborted) {
        throw error;
      }

      throw new Error(
        "Could not fetch this image. Its host may block browser access (CORS), or the URL may be unavailable. Download it and use the file picker instead.",
        { cause: error },
      );
    }
    if (!response.ok) {
      throw new Error(`Image request failed (HTTP ${response.status}).`);
    }

    if (Number(response.headers.get("content-length")) > MAX_BYTES) {
      throw new Error("Images must be at most 50 MB.");
    }

    const reader = response.body?.getReader();

    if (reader) {
      const chunks: Uint8Array<ArrayBuffer>[] = [];

      let bytes = 0;

      while (true) {
        const result = await reader.read();

        if (result.done) {
          break;
        }

        bytes += result.value.length;

        if (bytes > MAX_BYTES) {
          await reader.cancel();

          throw new Error("Images must be at most 50 MB.");
        }

        chunks.push(new Uint8Array(result.value));
      }

      blob = new Blob(chunks, {
        type: response.headers.get("content-type") ?? "",
      });
    } else {
      blob = await response.blob();
    }
  } else {
    blob = source;
    name = source.name;
  }

  if (signal.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  if (blob.size > MAX_BYTES) {
    throw new Error("Images must be at most 50 MB.");
  }

  if (!blob.size) {
    throw new Error("The image is empty.");
  }

  if (
    blob.type &&
    !blob.type.startsWith("image/") &&
    blob.type !== "application/octet-stream"
  ) {
    throw new Error("Choose an image, not a document or web page.");
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(blob);
  } catch (error) {
    throw new Error(
      "This image could not be decoded. Use a supported PNG, JPEG, WebP, GIF, or AVIF image.",
      { cause: error },
    );
  }
  const { width, height } = bitmap;

  bitmap.close();

  if (width * height > MAX_PIXELS) {
    throw new Error(
      "This image exceeds the 16-megapixel safety limit. No resizing is performed; choose a smaller image.",
    );
  }

  if (signal.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  return {
    url: URL.createObjectURL(blob),
    name,
    width,
    height,
    blob,
  };
}

async function readPixels(image: LoadedImage): Promise<ArrayBuffer> {
  const bitmap = await createImageBitmap(image.blob);
  const canvas = document.createElement("canvas");

  canvas.width = image.width;
  canvas.height = image.height;

  try {
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
      colorSpace: "srgb",
    });

    if (!context) {
      throw new Error("Your browser cannot create an image-analysis canvas.");
    }

    context.drawImage(bitmap, 0, 0);

    return context.getImageData(0, 0, image.width, image.height).data
      .buffer as ArrayBuffer;
  } finally {
    bitmap.close();

    canvas.width = 0;
    canvas.height = 0;
  }
}

export { loadImage, readPixels };
