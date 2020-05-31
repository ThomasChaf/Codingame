type OpMap = {
  [key: string]: (index: number) => number;
};

type Result = {
  solved: boolean;
  value?: number;
  operation: string;
  arg1: string;
  arg2: string;
};

type Results = {
  [key: number]: Result;
};

const parseArg = (arg: string): [boolean, number] => {
  const values: string[] | null = arg.match(/(\$?)(-?\d+)/);

  if (values === null) throw new Error(`Error: malformatted argument: ${arg}`);

  return [values[1] === "$", parseInt(values[2])];
};

export class Spreadsheet {
  private N: number;
  private results: Results = {};
  private opMap: OpMap;

  constructor(N: number) {
    this.N = N;
    this.opMap = {
      VALUE: this.op_VALUE.bind(this),
      ADD: this.op_ADD.bind(this),
      SUB: this.op_SUB.bind(this),
      MULT: this.op_MULT.bind(this),
    };
  }

  op_VALUE(index: number): number {
    const res = this.results[index];
    const [isRef1, value1] = parseArg(res.arg1);

    if (isRef1) return this.solve(value1);

    return value1;
  }

  op_ADD(index: number): number {
    const res = this.results[index];
    const [isRef1, value1] = parseArg(res.arg1);
    const [isRef2, value2] = parseArg(res.arg2);

    return (isRef1 ? this.solve(value1) : value1) + (isRef2 ? this.solve(value2) : value2);
  }

  op_SUB(index: number): number {
    const res = this.results[index];
    const [isRef1, value1] = parseArg(res.arg1);
    const [isRef2, value2] = parseArg(res.arg2);

    return (isRef1 ? this.solve(value1) : value1) - (isRef2 ? this.solve(value2) : value2);
  }

  op_MULT(index: number): number {
    const res = this.results[index];
    const [isRef1, value1] = parseArg(res.arg1);
    const [isRef2, value2] = parseArg(res.arg2);

    return (isRef1 ? this.solve(value1) : value1) * (isRef2 ? this.solve(value2) : value2);
  }

  solve(index: number): number {
    const { operation, solved, arg1, arg2 } = this.results[index];

    if (!solved) {
      const value = this.opMap[operation](index) || 0; // Prevent negative zero

      this.results[index] = {
        solved: true,
        operation,
        arg1,
        arg2,
        value,
      };
    }

    return this.results[index].value as number;
  }

  addOperation(index: number, operation: string, arg1: string, arg2: string) {
    this.results[index] = {
      solved: false,
      operation,
      arg1,
      arg2,
    };
  }
}
