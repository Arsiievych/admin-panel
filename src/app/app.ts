import {Component} from "@angular/core";
import {Header} from "./header/header";
import {Navigation} from "./navigation/navigation";

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Navigation,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
