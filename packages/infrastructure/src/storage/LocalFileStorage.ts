import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { join } from "node:path";
import type { Readable } from "node:stream";
import type { FileStorage, StoredFile } from "@roldninja/application";

/** Almacenamiento en disco local; expone los archivos bajo `/uploads/`. */
export class LocalFileStorage implements FileStorage {
  constructor(
    private readonly dir: string,
    private readonly publicPrefix = "/uploads",
  ) {}

  async save(extension: string, data: Readable): Promise<StoredFile> {
    await mkdir(this.dir, { recursive: true });
    const filename = `${randomUUID()}${extension}`;
    await pipeline(data, createWriteStream(join(this.dir, filename)));
    return { url: `${this.publicPrefix}/${filename}`, filename };
  }
}
