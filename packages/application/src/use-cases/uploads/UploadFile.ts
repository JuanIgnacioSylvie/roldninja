import { ValidationError } from "@roldninja/domain";
import type { Readable } from "node:stream";
import type { FileStorage, StoredFile } from "../../ports/FileStorage.js";

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".map"]);

export interface UploadFileInput {
  filename: string;
  data: Readable;
}

export class UploadFile {
  constructor(private readonly storage: FileStorage) {}

  async execute({ filename, data }: UploadFileInput): Promise<StoredFile> {
    const ext = extname(filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      throw new ValidationError(`Extension no permitida: ${ext}`);
    }
    return this.storage.save(ext, data);
  }
}

function extname(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i) : "";
}
