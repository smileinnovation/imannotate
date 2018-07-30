import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  list: Array<string>;

  constructor() {
    this.list = [
      "Cerulean",
      "Cosmo",
      "Cyborg",
      "Darkly",
      "Flatly",
      "Journal",
      "Litera",
      "Lumen",
      "Lux",
      "Materia",
      "Minty",
      "Pulse",
      "Sandstone",
      "Simplex",
      "Sketchy",
      "Slate",
      "Solar",
      "Spacelab",
      "Superhero",
      "United",
      "Yeti",
    ];
  }

  get theme() {
    return localStorage.getItem("theme");
  }

  changeTheme(theme: string) {
    localStorage.setItem("theme", theme);
    this.setTheme();
  }

  setTheme() {
    let theme = localStorage.getItem("theme");
    if (!theme) {
      theme = "lux";
    }

    const link = document.createElement("link");
    link.setAttribute("href", `https://bootswatch.com/4/${theme.toLowerCase()}/bootstrap.min.css`)
    link.setAttribute("rel", "stylesheet")
    link.setAttribute("media", "screen")
    link.setAttribute("type", "text/css")
    link.setAttribute("id", "theme");

    try {
      document.querySelector("#theme").remove();
    }catch(e) {}

    document.head.appendChild(link);

  }
}
