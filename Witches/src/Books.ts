import { Book } from "./Book";

export type BookNullable = Book | null;

export class Books {
  books: Book[] = [];

  reset() {
    this.books = [];
  }

  add(id: string, gems: number[], tomeIndex: number) {
    this.books.push(new Book(id, gems, tomeIndex));
  }

  getAvailable(): Book[] {
    return this.books.slice(0, 6);
  }
}
