import { IGemmable } from "./interfaces/IGemmable";
import { Store } from "./Store";
import { ALL_COLOR, BLUE_COLOR } from "./utils";

export class Book extends IGemmable {
  public id: string;
  public tomeIndex: number;

  constructor(id: string, gems: number[], tomeIndex: number) {
    super();
    this.id = id;
    this.tomeIndex = tomeIndex;
    this.set(gems);
  }

  isLearnable(store: Store): boolean {
    if (store.at(BLUE_COLOR) < this.tomeIndex) return false;

    return true;
  }
}

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
