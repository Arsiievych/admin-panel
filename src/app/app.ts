import {Component} from "@angular/core";
import {Header} from "./header/header";
import {Navigation} from "./navigation/navigation";
import {Item} from "./navigation/item/item";

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Navigation,
    Item,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
