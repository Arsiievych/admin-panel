import { Component } from '@angular/core';
import { CurrentUser } from './current-user/current-user';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-header',
  imports: [
    Logo,
    CurrentUser,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
