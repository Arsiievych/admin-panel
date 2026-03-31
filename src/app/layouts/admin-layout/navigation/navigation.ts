import { Component } from '@angular/core';
import {NavigationItem} from "./navigation-item/navigation-item";

@Component({
  selector: 'app-navigation',
  imports: [
    NavigationItem
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {

}
