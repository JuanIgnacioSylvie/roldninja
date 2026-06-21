import type { Readable } from "node:stream";

export interface StoredFile {
  url: string;
  filename: string;
}

export interface FileStorage {
  /** Persiste un archivo con la extension dada y devuelve su URL publica. */
  save(extension: string, data: Readable): Promise<StoredFile>;
}
