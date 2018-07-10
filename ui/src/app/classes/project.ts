export class Project {
  name: string;
  owner: string;
  description: string;
  tags: Array<String>;
  constructor() {
    this.name = "";
    this.owner = "";
    this.description = "";
    this.tags = new Array<string>();
  }
}
