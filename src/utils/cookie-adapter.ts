const length$ = Symbol("document.cookie.length");

export class CookieAdapter extends Storage {
  private cookieObject: Record<string, string> & { [length$]: number } = { [length$]: 0 };

  constructor() {
    super();

    document.cookie
      .split(";")
      .map((c) => c.trim())
      .map((c) => c.split("="))
      .forEach(([key, value]) => {
        this.cookieObject[key] = value || "";

        this.cookieObject[length$]++;
      });
  }

  get length() {
    return this.cookieObject[length$];
  }

  setItem(key: string, value: string): void {
    this.cookieObject[key] = value || "";
    this.cookieObject[length$]++;
    this.save();
  }

  getItem(key: string): string {
    return this.cookieObject[key];
  }

  removeItem(key: string): void {
    delete this.cookieObject[key];
    this.save();
  }

  clear(): void {
    this.cookieObject = { [length$]: 0 };
    this.save();
  }

  key(index: number): string {
    throw new Error("Doesn't implemented yet. Try another variant");
  }

  private save() {
    document.cookie = Object.entries(this.cookieObject).reduce(
      (acc, [key, value], idx) => (acc += `${idx === 0 ? "" : ";"}${key}=${value}`),
      ""
    );
  }
}
