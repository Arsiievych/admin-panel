import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly appTitle = 'Game Dev Console';

  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const routeTitle = this.getDeepestTitle(snapshot.root);
    this.title.setTitle(routeTitle ? `${routeTitle} | ${this.appTitle}` : this.appTitle);
  }

  private getDeepestTitle(route: ActivatedRouteSnapshot): string | undefined {
    let currentRoute: ActivatedRouteSnapshot | null = route;
    let title: string | undefined;

    while (currentRoute) {
      if (typeof currentRoute.title === 'string') {
        title = currentRoute.title;
      }

      currentRoute = currentRoute.firstChild;
    }

    return title;
  }
}
