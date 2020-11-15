import { Book } from "./Book";
import { ActionAvailable } from "./interfaces/ActionAvailable";

export type BookNullable = Book | null;

export class Books {
  books: Book[] = [];

  reset() {
    this.books = [];
  }

  add(id: string, gems: number[], tomeIndex: number, taxCount: number) {
    this.books.push(new Book(id, gems, tomeIndex, taxCount));
  }

  first(): Book {
    return this.books[0];
  }

  getBookAvailable(): ActionAvailable {
    const bookAvailable: ActionAvailable = {};

    this.books.forEach((book) => {
      bookAvailable[book.id] = true;
    });

    return bookAvailable;
  }

  getById(id: string): Book | undefined {
    return this.books.find((book) => book.id === id);
  }
}
