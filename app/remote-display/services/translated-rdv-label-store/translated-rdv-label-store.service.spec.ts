import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateTestingModule } from 'ngx-translate-testing';

import { TranslatedRDVLabelStoreService } from './translated-rdv-label-store.service';
import { TranslatedRDVLabels } from '@remote-display/rdv.enums';

const TRANSLATIONS_FR = require('../../../../assets/i18n/fleet/fr.json');

const FRENCH_TRANSLATIONS = {
  PAGE_RDV: {
    DISPLAY: 'Affichage à distance',
    END: "Fermer la session d'affichage à distance",
    END_TXT: "Voulez-vous vraiment fermer la session d'affichage à distance ?",
    FULL: 'Autre session déjà ouverte',
    SESSION: "Session d'affichage à distance",
    SUB_INACTIVE: 'Abonnement inactif',
    SUB_INACTIVE_TITLE: "Votre abonnement à la fonction d'affichage à distance est inactif.",
    SUB_INACTIVE_TUTORIAL: "Vous pouvez l'activer via le lien suivant",
    TERMINATION_CLIENT: "La session d'affichage à distance a été fermée.",
    TERMINATION_HOST: "La session d'affichage à distance a été fermée depuis le véhicule.",
    TIME_LEFT: 'Temps restant',
    TW_HOWTO:
      "Vous devez télécharger l'application TeamViewer pour pouvoir utiliser la fonction d'affichage à distance.",
    TW_HOWTO_2: 'Vous pouvez la télécharger via le lien suivant',
    TW_NOT_INSTALLED: 'TeamViewer pas installé',
    CTA: {
      END_SESSION: 'fermer session',
      RETRY: 'réessayer'
    },
    MESSAGES: {
      ERROR_1: "car la session n'a pas été acceptée.",
      ERROR_2: 'car la connexion a été perdue.',
      ERROR_3: 'car la session a expiré.',
      ERROR_4: "Impossible de démarrer la session d'affichage à distance.",
      ERROR_5: "ECHEC CONNEXION Impossible de démarrer la session d'affichage à distance.",
      FAILED: 'ECHEC CONNEXION',
      RUNNING: 'SESSION EN COURS',
      WAITING: 'EN ATTENTE DE CONNEXION'
    }
  }
};

describe('TranslatedRdvLabelStoreService', () => {
  let rdvLabelStore: TranslatedRDVLabelStoreService;
  let http: HttpTestingController;

  beforeEach(() => {
    const translateModule = TranslateTestingModule.withTranslations('fr', { FRENCH_TRANSLATIONS });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateTestingModule],
      providers: [translateModule.providers, TranslatedRDVLabelStoreService]
    });

    http = TestBed.get(HttpTestingController);
    rdvLabelStore = TestBed.get(TranslatedRDVLabelStoreService);
  });

  it('#should be created', () => expect(rdvLabelStore).toBeTruthy());

  it("#should translate TERMINATION_CLIENT into La session d'affichage à distance a été fermée.", fakeAsync(() => {
    expect(rdvLabelStore.getLabel(TranslatedRDVLabels['PAGE_RDV.TERMINATION_CLIENT'])).toEqual(
      FRENCH_TRANSLATIONS.PAGE_RDV.TERMINATION_CLIENT
    );
  }));
});
