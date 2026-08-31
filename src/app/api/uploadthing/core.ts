import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/**
 * Upload endpoints for the site. Only the quote-form reference design for now.
 * The client uploads straight to UploadThing, then submits the returned URL
 * with the rest of the quote form.
 */
export const ourFileRouter = {
  quoteReference: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    blob: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .onUploadError(({ error }) => {
      throw new UploadThingError(error.message);
    })
    .onUploadComplete(({ file }) => {
      // Runs on our server after the file lands. Return value is forwarded to
      // the client's onClientUploadComplete callback.
      return { url: file.ufsUrl, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
