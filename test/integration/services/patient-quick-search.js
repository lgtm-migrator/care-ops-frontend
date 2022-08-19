import _ from 'underscore';
import patientFixture from 'fixtures/collections/patients.json';
import { getRelationship, getIncluded } from 'helpers/json-api';

context('Patient Quick Search', function() {
  beforeEach(function() {
    const patients = _.map(_.sample(patientFixture, 10), (patient, index) => {
      patient.id = `${ index }`;
      patient.first_name = 'Test';
      patient.last_name = `${ index } Patient`;
      return patient;
    });

    const data = _.map(patients, patient => {
      const { id, first_name, last_name, birth_date } = patient;

      return {
        id,
        type: 'patient-search-results',
        attributes: {
          first_name,
          last_name,
          birth_date,
        },
        relationships: {
          patient: {
            data: getRelationship(patient, 'patients'),
          },
        },
      };
    });

    cy
      .intercept({
        method: 'GET',
        url: 'api/patients?filter*',
      }, req => {
        if (req.url.includes('None')) {
          req.reply({ data: [] });
          req.alias = 'routeEmptyPatientSearch';
          return;
        }
        req.reply({
          data,
          includes: getIncluded([], patients, 'patients'),
        });
        req.alias = 'routePatientSearch';
      });
  });

  specify('Legacy Modal', function() {
    cy
      .routeSettings(fx => {
        fx.data = _.reject(fx.data, { id: 'patient_search_settings' });

        return fx;
      })
      .routeFlows(_.identity, 1)
      .routePatient()
      .routePatientActions()
      .routeAction()
      .routeActionActivity()
      .visit('/')
      .wait('@routeFlows');

    cy
      .get('.app-frame__nav')
      .find('.js-search')
      .as('search')
      .click();

    cy
      .get('@search')
      .should('have.class', 'is-active');

    cy
      .get('.modal')
      .as('searchModal')
      .should('contain', 'Search by')
      .find('.patient-search__input')
      .should('have.attr', 'placeholder', 'Search for patients')
      .type('Test');

    cy
      .wait('@routePatientSearch')
      .itsUrl()
      .its('search')
      .should('contain', 'filter[search]=Te');

    cy
      .get('@searchModal')
      .find('.js-picklist-item')
      .should('have.length', 10);

    cy
      .get('@searchModal')
      .find('.patient-search__input')
      .type(' 2')
      .wait('@routePatientSearch')
      .wait(100); // wait for debounce

    cy
      .get('@searchModal')
      .find('.js-picklist-item strong')
      .contains('2')
      .click();

    cy
      .url()
      .should('contain', 'patient/dashboard/2');

    cy
      .get('@search')
      .click();

    cy
      .get('@searchModal')
      .find('.patient-search__input')
      .type('None')
      .wait('@routeEmptyPatientSearch');

    cy
      .get('@searchModal')
      .should('contain', 'No results match your query');

    cy
      .get('@searchModal')
      .find('.patient-search__input')
      .clear();

    cy
      .get('@searchModal')
      .should('contain', 'Search by');

    cy
      .get('@searchModal')
      .find('.js-close')
      .click();

    cy
      .get('@searchModal')
      .should('not.exist');

    cy
      .get('.app-nav__header')
      .should('contain', 'Cypress Clinic')
      .as('mainNav')
      .click();

    cy
      .get('.picklist')
      .contains('Programs')
      .click();

    cy
      .get('@mainNav')
      .click();

    cy
      .get('.picklist')
      .contains('Workspace')
      .click()
      .wait('@routeFlows');

    cy
      .get('body')
      .type('/');

    cy
      .get('@searchModal')
      .should('contain', 'Search by');

    cy
      .go('back');
  });

  specify('Modal', function() {
    cy
      .routeFlows(_.identity, 1)
      .routePatient()
      .routePatientActions()
      .routeAction()
      .routeActionActivity()
      .visit('/')
      .wait('@routeFlows');

    cy
      .get('.app-frame__nav')
      .find('.js-search')
      .as('search')
      .click();

    cy
      .get('@search')
      .should('have.class', 'is-active');

    cy
      .get('.modal')
      .as('searchModal')
      .should('contain', 'Search by')
      .find('.patient-search__input')
      .should('have.attr', 'placeholder', 'Search for patients')
      .type('Test');

    cy
      .wait('@routePatientSearch')
      .itsUrl()
      .its('search')
      .should('contain', 'filter[search]=Te');

    cy
      .get('@searchModal')
      .find('.js-picklist-item')
      .should('have.length', 10);

    cy
      .get('@searchModal')
      .find('.patient-search__input')
      .type(' 2')
      .wait('@routePatientSearch')
      .wait(100); // wait for debounce

    cy
      .get('@searchModal')
      .find('.js-picklist-item strong')
      .contains('2')
      .click();

    cy
      .url()
      .should('contain', 'patient/dashboard/2');

    cy
      .get('@search')
      .click();

    cy
      .get('@searchModal')
      .find('.patient-search__input')
      .type('None')
      .wait('@routeEmptyPatientSearch');

    cy
      .get('@searchModal')
      .should('contain', 'No results match your query');

    cy
      .get('@searchModal')
      .find('.patient-search__input')
      .clear();

    cy
      .get('@searchModal')
      .should('contain', 'Search by');

    cy
      .get('@searchModal')
      .find('.js-close')
      .click();

    cy
      .get('@searchModal')
      .should('not.exist');

    cy
      .get('.app-nav__header')
      .should('contain', 'Cypress Clinic')
      .as('mainNav')
      .click();

    cy
      .get('.picklist')
      .contains('Programs')
      .click();

    cy
      .get('@mainNav')
      .click();

    cy
      .get('.picklist')
      .contains('Workspace')
      .click()
      .wait('@routeFlows');

    cy
      .get('body')
      .type('/');

    cy
      .get('@searchModal')
      .should('contain', 'Search by');

    cy
      .go('back');
  });
});
