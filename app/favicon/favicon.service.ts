import { Inject } from '@angular/core';
import { InjectionToken } from '@angular/core';

export interface FaviconsConfig {
  icons: IconsConfig;
  cacheBusting?: boolean;
}

export interface IconsConfig {
  [name: string]: IconConfig;
}

export interface IconConfig {
  type: string;
  href: string;
  isDefault?: boolean;
}

export let BROWSER_FAVICONS_CONFIG = new InjectionToken<FaviconsConfig>('Favicons Configuration');

export class FaviconService {
  private elementId: string;
  private icons: IconsConfig;
  private useCacheBusting: boolean;

  constructor(@Inject(BROWSER_FAVICONS_CONFIG) config: FaviconsConfig) {
    this.elementId = 'favicons-service-injected-node';
    this.icons = Object.assign(Object.create(null), config.icons);
    this.useCacheBusting = config.cacheBusting || false;

    this.removeExternalLinkElements();
  }

  public activate(name: string): void {
    if (!this.icons[name]) {
      throw new Error(`Favicon for [ ${name} ] not found.`);
    }

    this.setNode(this.icons[name].type, this.icons[name].href);
  }

  // use this for incase of default
  public reset(): void {
    for (const name of Object.keys(this.icons)) {
      const icon = this.icons[name];

      if (icon.isDefault) {
        this.setNode(icon.type, icon.href);
        return;
      }
    }
    this.removeNode();
  }

  private addNode(type: string, href: string): void {
    const linkElement = document.createElement('link');
    linkElement.setAttribute('id', this.elementId);
    linkElement.setAttribute('rel', 'icon');
    linkElement.setAttribute('href', href);
    document.head.appendChild(linkElement);
  }

  private cacheBustHref(href: string): string {
    const augmentedHref =
      href.indexOf('?') === -1
        ? `${href}?faviconCacheBust=${Date.now()}`
        : `${href}&faviconCacheBust=${Date.now()}`;

    return augmentedHref;
  }

  private removeExternalLinkElements(): void {
    // tslint:disable-next-line:quotemark
    const linkElements = document.querySelectorAll("link[ rel ~= 'icon' i]");

    for (const linkElement of Array.from(linkElements)) {
      linkElement.parentNode.removeChild(linkElement);
    }
  }

  private removeNode(): void {
    const linkElement = document.head.querySelector('#' + this.elementId);

    if (linkElement) {
      document.head.removeChild(linkElement);
    }
  }

  private setNode(type: string, href: string): void {
    const augmentedHref = this.useCacheBusting ? this.cacheBustHref(href) : href;

    this.removeNode();
    this.addNode(type, augmentedHref);
  }
}
