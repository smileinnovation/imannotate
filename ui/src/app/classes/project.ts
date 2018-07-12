export class Project {
  id: string;
  name: string;
  owner: string;
  description: string;
  tags: Array<String>;
  imageProvider: string;
  imageProviderOptions: any;

  constructor() {
    this.id = "";
    this.name = "";
    this.owner = "";
    this.description = "";
    this.tags = new Array<string>();
    this.imageProvider = "";
    this.imageProviderOptions = {};
  }
}
