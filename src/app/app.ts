import {Component} from "@angular/core";
import {Header} from "./header/header";
import {NavBar} from "./nav-bar/nav-bar";
import {Dashboard} from "./dashboard/dashboard";

@Component({
  selector: 'app-root',
  imports: [
    Header,
    NavBar,
    Dashboard
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
