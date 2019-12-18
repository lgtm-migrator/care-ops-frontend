import _ from 'underscore';
import moment from 'moment';
import 'js/utils/formatting';
import formatDate from 'helpers/format-date';

const local = moment();

const testGroups = [
  {
    id: '1',
    name: 'Group One',
  },
  {
    id: '2',
    name: 'Another Group',
  },
  {
    id: '3',
    name: 'Third Group',
  },
];

context('worklist page', function() {
  specify('action list', function() {
    cy
      .server()
      .routeGroupActions(fx => {
        fx.data = _.sample(fx.data, 3);
        fx.data[0] = {
          id: '1',
          type: 'actions',
          attributes: {
            name: 'First In List',
            details: null,
            duration: 0,
            due_date: null,
            updated_at: moment.utc().format(),
          },
          relationships: {
            clinician: { data: null },
            role: { data: { id: '11111' } },
            state: { data: { id: '22222' } },
            patient: { data: { id: '1' } },
          },
        };

        fx.data[1].relationships.state = { data: { id: '55555' } };
        fx.data[1].attributes.name = 'Last In List';
        fx.data[1].attributes.due_date = moment.utc().add(5, 'days').format('YYYY-MM-DD');
        fx.data[1].attributes.updated_at = moment.utc().subtract(2, 'days').format();

        fx.data[2].relationships.state = { data: { id: '55555' } };
        fx.data[2].relationships.patient = { data: { id: '1' } };
        fx.data[2].id = '2';
        fx.data[2].attributes.name = 'Second In List';
        fx.data[2].attributes.due_date = moment.utc().add(3, 'days').format('YYYY-MM-DD');
        fx.data[2].attributes.updated_at = moment.utc().subtract(1, 'days').format();

        fx.included.push({
          id: '1',
          type: 'patients',
          attributes: {
            first_name: 'Test',
            last_name: 'Patient',
          },
        });

        return fx;
      }, '1')
      .routePatient()
      .routePatientActions()
      .routeAction()
      .routeActionActivity()
      .visit('/worklist/owned-by-me')
      .wait('@routeGroupActions');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .first()
      .should('contain', 'First In List')
      .next()
      .should('contain', 'Second In List')
      .next()
      .should('contain', 'Last In List');


    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .first()
      .as('firstRow')
      .click();

    cy
      .url()
      .should('contain', 'patient/1/action/1')
      .wait('@routePatientActions');

    cy
      .get('.patient__layout')
      .find('.patient__tab--selected')
      .contains('Dashboard');

    cy
      .go('back')
      .wait('@routeGroupActions');

    cy
      .get('@firstRow')
      .contains('Test Patient')
      .click();

    cy
      .url()
      .should('contain', 'patient/dashboard/1')
      .wait('@routePatientActions');

    cy
      .go('back')
      .wait('@routeGroupActions');

    cy
      .get('@firstRow')
      .next()
      .click();

    cy
      .url()
      .should('contain', 'patient/1/action/2')
      .wait('@routePatientActions');

    cy
      .get('.patient__layout')
      .find('.patient__tab--selected')
      .contains('Data & Events');

    cy
      .go('back')
      .wait('@routeGroupActions');

    cy
      .route({
        status: 204,
        method: 'PATCH',
        url: '/api/actions/1',
        response: {},
      })
      .as('routePatchAction');

    cy
      .get('@firstRow')
      .find('.action--queued')
      .click();

    cy
      .get('.picklist')
      .contains('In Progress')
      .click();

    cy
      .wait('@routePatchAction')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.state.data.id).to.equal('33333');
      });

    cy
      .get('@firstRow')
      .find('[data-owner-region]')
      .should('contain', 'CO')
      .click();

    cy
      .get('.picklist')
      .contains('Nurse')
      .click();

    cy
      .wait('@routePatchAction')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.role.data.id).to.equal('22222');
      });

    cy
      .get('@firstRow')
      .find('[data-due-region]')
      .click();

    cy
      .get('.datepicker')
      .contains('Today')
      .click();

    cy
      .get('@firstRow')
      .find('[data-due-region]')
      .should('contain', formatDate(moment(), 'SHORT'));

    cy
      .wait('@routePatchAction')
      .its('request.body')
      .should(({ data }) => {
        expect(data.attributes.due_date).to.equal(moment().format('YYYY-MM-DD'));
      });

    cy
      .get('@firstRow')
      .next()
      .find('.action--done')
      .should('not.be.disabled');

    cy
      .get('@firstRow')
      .next()
      .find('[data-owner-region] button')
      .should('be.disabled');

    cy
      .get('@firstRow')
      .next()
      .find('[data-due-region] button')
      .should('be.disabled');

    cy
      .get('.worklist-list__filter')
      .click();

    cy
      .get('.picklist')
      .contains('Last Updated: Oldest - Newest')
      .click();

    cy
      .get('@firstRow')
      .find('[data-due-region] button')
      .should('contain', formatDate(moment(local).add(5, 'days'), 'SHORT'));

    cy
      .get('@firstRow')
      .next()
      .find('[data-due-region] button')
      .should('contain', formatDate(moment(local).add(3, 'days'), 'SHORT'));

    cy
      .get('.worklist-list__filter')
      .click();

    cy
      .get('.picklist')
      .contains('Due Date: Oldest - Newest')
      .click();

    cy
      .get('@firstRow')
      .find('[data-due-region] button')
      .should('contain', formatDate(moment(local), 'SHORT'));

    cy
      .get('@firstRow')
      .next()
      .find('[data-due-region] button')
      .should('contain', formatDate(moment(local).add(3, 'days'), 'SHORT'));

    cy
      .get('.worklist-list__filter')
      .click();

    cy
      .get('.picklist')
      .contains('Due Date: Newest - Oldest')
      .click();

    cy
      .get('@firstRow')
      .find('[data-due-region] button')
      .should('contain', formatDate(moment(local).add(5, 'days'), 'SHORT'));

    cy
      .get('@firstRow')
      .next()
      .find('[data-due-region] button')
      .should('contain', formatDate(moment(local).add(3, 'days'), 'SHORT'));
  });

  specify('group filtering', function() {
    cy
      .server()
      .routeGroupsBootstrap(_.indentity, testGroups)
      .routeGroupActions()
      .visit('/worklist/owned-by-me')
      .wait('@routeGroupActions')
      .its('url')
      .should('contain', 'filter[group]=1,2,3')
      .should('contain', 'filter[clinician]=11111')
      .should('contain', 'filter[status]=queued,started');

    cy
      .get('.list-page__filters')
      .contains('All Groups')
      .click();

    cy
      .get('.picklist__item')
      .contains('Another Group')
      .click()
      .wait('@routeGroupActions')
      .its('url')
      .should('contain', 'filter[group]=2')
      .should('contain', 'filter[clinician]=11111')
      .should('contain', 'filter[status]=queued,started');

    cy
      .get('.list-page__filters')
      .contains('Another Group');
  });

  specify('group filtering - new actions', function() {
    cy
      .server()
      .routeGroupsBootstrap(_.indentity, testGroups)
      .routeGroupActions()
      .visit('/worklist/new-actions')
      .wait('@routeGroupActions')
      .its('url')
      .should('contain', 'filter[group]=1,2,3')
      .should('contain', 'filter[created_since]=')
      .should('contain', 'filter[status]=queued,started');

    cy
      .get('.list-page__filters')
      .contains('All Groups')
      .click();

    cy
      .get('.picklist__item')
      .contains('Another Group')
      .click()
      .wait('@routeGroupActions')
      .its('url')
      .should('contain', 'filter[group]=2')
      .should('contain', 'filter[created_since]=')
      .should('contain', 'filter[status]=queued,started');
  });

  specify('clinician in only one group', function() {
    cy
      .server()
      .routeGroupsBootstrap(_.indentity, [testGroups[0]])
      .routeGroupActions()
      .visit('/worklist/owned-by-me')
      .wait('@routeGroupActions')
      .its('url')
      .should('contain', 'filter[group]=1');

    cy
      .get('[data-filters-region]')
      .should('be.empty');
  });
});
