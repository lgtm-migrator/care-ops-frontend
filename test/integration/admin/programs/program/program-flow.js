import _ from 'underscore';
import moment from 'moment';

const now = moment.utc();

context('program flow page', function() {
  specify('context trail', function() {
    cy
      .server()
      .routeProgramFlow(fx => {
        fx.data.id = '1';

        fx.data.attributes.name = 'Test Flow';
        fx.data.attributes.updated_at = now.format();

        return fx;
      })
      .routeProgramFlowActions(_.identity, '1')
      .routeProgramByProgramFlow(fx => {
        fx.data.id = '1';
        fx.data.attributes.name = 'Test Program';

        return fx;
      })
      .visit('/program-flow/1')
      .wait('@routeProgramFlow')
      .wait('@routeProgramFlowActions')
      .wait('@routeProgramByProgramFlow');

    cy
      .get('.program-flow__context-trail')
      .contains('Test Program')
      .click();

    cy
      .url()
      .should('contain', 'program/1');

    cy
      .go('back');

    cy
      .get('[data-nav-content-region]')
      .contains('Programs')
      .click()
      .go('back');

    cy
      .get('.program-flow__context-trail')
      .contains('Back to List')
      .click();

    cy
      .url()
      .should('contain', 'programs');
  });

  specify('program sidebar', function() {
    cy
      .server()
      .routeProgramFlow()
      .routeProgramFlowActions()
      .routeProgramByProgramFlow(fx => {
        fx.data.id = '1';

        fx.data.attributes.name = 'Test Program';
        fx.data.attributes.details = '';
        fx.data.attributes.published = true;

        return fx;
      })
      .visit('/program-flow/1')
      .wait('@routeProgramFlow')
      .wait('@routeProgramFlowActions')
      .wait('@routeProgramByProgramFlow');

    cy
      .get('.program-sidebar')
      .should('contain', 'Test Program')
      .should('contain', 'No description given')
      .should('contain', 'On');

    cy
      .get('.js-menu')
      .click();

    cy
      .get('.picklist')
      .should('contain', 'Update Program')
      .should('contain', 'Edit')
      .click();

    cy
      .get('.programs-sidebar')
      .find('[data-name-region]')
      .contains('Test Program')
      .clear()
      .type('Testing');

    cy
      .get('[data-save-region]')
      .contains('Save')
      .click();

    cy
      .get('.program-flow__context-trail')
      .should('contain', 'Testing');
  });

  specify('flow header', function() {
    cy
      .server()
      .routeProgramFlow(fx => {
        fx.data.id = '1';

        fx.data.attributes.name = 'Test Flow';
        fx.data.attributes.details = 'Test Flow Details';
        fx.data.attributes.status = 'draft';
        fx.data.attributes.updated_at = now.format();

        _.each(fx.data.relationships['program-flow-actions'].data, (programFlowAction, index) => {
          programFlowAction.id = index + 1;
        });

        return fx;
      })
      .routeProgramFlowActions(fx => {
        _.each(fx.data, (programFlowAction, index) => {
          programFlowAction.id = index + 1;
        });

        fx.included.forEach(action => {
          action.attributes.status = 'draft';
        });

        return fx;
      }, '1')
      .routeProgramByProgramFlow()
      .visit('/program-flow/1')
      .wait('@routeProgramByProgramFlow')
      .wait('@routeProgramFlow')
      .wait('@routeProgramFlowActions');

    cy
      .route({
        status: 204,
        method: 'PATCH',
        url: '/api/program-flows/1',
        response: {},
      })
      .as('routePatchFlow');

    cy
      .get('.program-flow__header')
      .as('flowHeader')
      .find('.program-flow__name')
      .contains('Test Flow');

    cy
      .get('@flowHeader')
      .find('.program-flow__details')
      .contains('Test Flow Details');

    cy
      .get('@flowHeader')
      .find('.program-action--draft')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__info')
      .contains('A flow requires published actions before the flow can be published.');

    cy
      .get('.picklist')
      .find('.picklist__item')
      .contains('Draft')
      .click();

    cy
      .get('@flowHeader')
      .find('[data-owner-region]')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__item')
      .contains('Nurse')
      .click();

    cy
      .wait('@routePatchFlow')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.owner.data.id).to.equal('22222');
        expect(data.relationships.owner.data.type).to.equal('roles');
      });

    cy
      .get('@flowHeader')
      .find('[data-owner-region]')
      .contains('NUR');

    cy
      .get('.program-flow__list')
      .find('.table-list__item')
      .first()
      .find('[data-published-region] button')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__item')
      .contains('Published')
      .click();

    cy
      .get('@flowHeader')
      .find('.program-action--draft')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__info')
      .should('not.exist');

    cy
      .get('.picklist')
      .find('.picklist__item')
      .contains('Published')
      .click();

    cy
      .wait('@routePatchFlow')
      .its('request.body')
      .should(({ data }) => {
        expect(data.attributes.status).to.equal('published');
      });

    cy
      .get('@flowHeader')
      .find('.program-action--published');

    cy
      .get('.program-flow__list')
      .find('.table-list__item .table-list__cell')
      .first()
      .click();

    cy
      .get('.program-action-sidebar')
      .find('[data-published-region]')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__item')
      .contains('Draft')
      .click();

    cy
      .get('@flowHeader')
      .find('.program-action--published')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__info')
      .contains('A flow requires published actions before the flow can be published.');

    cy
      .get('@flowHeader')
      .find('.program-action--published')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__item')
      .contains('Draft')
      .click();

    cy
      .get('.program-action-sidebar')
      .find('[data-published-region]')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__item')
      .contains('Published')
      .click();

    cy
      .get('@flowHeader')
      .find('.program-action--draft')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__info')
      .should('not.exist');

    cy
      .get('.program-action-sidebar')
      .find('.js-menu')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__item')
      .contains('Delete')
      .click();

    cy
      .get('@flowHeader')
      .find('.program-action--draft')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__info')
      .contains('A flow requires published actions before the flow can be published.');
  });

  specify('Flow does not exist', function() {
    cy
      .server()
      .routeProgramByProgramFlow()
      .route({
        url: '/api/program-flows/1',
        status: 404,
        response: {
          errors: [{
            id: '1',
            status: '404',
            title: 'Not Found',
            detail: 'Cannot find action',
            source: { parameter: 'flowId' },
          }],
        },
      })
      .as('routeFlow404')
      .visit('/program-flow/1')
      .wait('@routeProgramByProgramFlow')
      .wait('@routeFlow404');

    cy
      .url()
      .should('contain', '404');
  });

  specify('flow actions list', function() {
    cy
      .server()
      .routeProgramFlow(fx => {
        fx.data.id = '1';
        fx.data.attributes.status = 'draft';

        _.each(fx.data.relationships['program-flow-actions'].data, (programFlowAction, index) => {
          programFlowAction.id = index + 1;
        });

        return fx;
      })
      .routeProgramFlowActions(fx => {
        fx.data = _.first(fx.data, 3);

        _.each(fx.data, (programFlowAction, index) => {
          programFlowAction.id = index + 1;
        });

        fx.included = _.first(fx.included, 3);

        fx.data[0].attributes.sequence = 0;
        fx.data[0].relationships['program-action'].data.id = '1';
        fx.included[0].id = '1';
        fx.included[0].attributes.name = 'First In List';
        fx.included[0].attributes.updated_at = moment.utc().format();
        fx.included[0].attributes.status = 'draft';
        fx.included[0].relationships.owner.data = null;
        fx.included[0].relationships.forms = {
          data: [
            {
              id: '11111',
              name: 'Test Form',
            },
          ],
        };

        fx.data[1].attributes.sequence = 2;
        fx.included[1].attributes.name = 'Third In List';
        fx.included[1].attributes.status = 'draft';

        fx.data[2].attributes.sequence = 1;
        fx.included[2].attributes.name = 'Second In List';
        fx.included[2].attributes.status = 'draft';

        return fx;
      }, '1')
      .routeProgramByProgramFlow()
      .routeProgramAction(fx => {
        fx.data.id = '1';

        fx.data.attributes.name = 'First In List';
        fx.data.attributes.status = 'draft';

        return fx;
      })
      .visit('/program-flow/1')
      .wait('@routeProgramFlow')
      .wait('@routeProgramFlowActions')
      .wait('@routeProgramByProgramFlow');

    cy
      .route({
        status: 204,
        method: 'PATCH',
        url: '/api/program-actions/1',
        response: {},
      })
      .as('routePatchAction');

    cy
      .route({
        status: 201,
        method: 'POST',
        url: '/api/program-actions',
        response: {
          data: {
            id: '98765',
            attributes: {
              name: 'Test Name',
              created_at: now.format(),
              updated_at: now.format(),
            },
          },
        },
      })
      .as('routePostAction');

    cy
      .route({
        status: 201,
        method: 'POST',
        url: '/api/program-flows/1/relationships/actions',
        response: {},
      })
      .as('routePostFlowAction');

    cy
      .route({
        status: 201,
        method: 'PATCH',
        url: '/api/program-flows/1/relationships/actions',
        response: {},
      });

    cy
      .get('.program-flow__list')
      .as('actionList')
      .find('.table-list__item')
      .first()
      .should('contain', 'First In List')
      .next()
      .should('contain', 'Second In List')
      .next()
      .should('contain', 'Third In List');

    cy
      .get('.program-flow__header')
      .find('[data-published-region]')
      .click();

    cy
      .get('.picklist')
      .find('.program-action--published')
      .should('have.class', 'is-disabled');

    cy
      .get('@actionList')
      .contains('First In List')
      .click();

    cy
      .get('@actionList')
      .find('.is-selected')
      .find('[data-published-region]')
      .click();

    cy
      .get('.picklist')
      .contains('Published')
      .click();

    cy
      .wait('@routePatchAction')
      .its('request.body')
      .should(({ data }) => {
        expect(data.attributes.status).to.equal('published');
      });

    cy
      .get('.program-flow__header')
      .find('[data-published-region]')
      .click();

    cy
      .get('.picklist')
      .find('.program-action--published')
      .should('not.have.class', 'is-disabled');

    cy
      .get('.program-action-sidebar')
      .as('actionSidebar')
      .find('.program-action--published');

    cy
      .get('@actionList')
      .find('.is-selected')
      .find('[data-owner-region]')
      .find('button')
      .should('have.class', 'is-icon-only')
      .click();

    cy
      .get('.picklist')
      .contains('Nurse')
      .click();

    cy
      .wait('@routePatchAction')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.owner.data.id).to.equal('22222');
        expect(data.relationships.owner.data.type).to.equal('roles');
      });

    cy
      .get('@actionSidebar')
      .find('[data-owner-region]')
      .contains('Nurse');

    cy
      .get('@actionList')
      .find('.is-selected')
      .find('[data-owner-region]')
      .contains('NUR');

    cy
      .get('@actionList')
      .find('.is-selected')
      .find('[data-due-region]')
      .click();

    cy
      .get('.picklist')
      .contains('Same Day')
      .click();

    cy
      .get('@actionSidebar')
      .find('[data-due-region]')
      .contains('Same Day');

    cy
      .wait('@routePatchAction')
      .its('request.body')
      .should(({ data }) => {
        expect(data.attributes.days_until_due).to.equal(0);
      });

    cy
      .get('@actionSidebar')
      .find('[data-attachment-region]')
      .should('contain', 'Test Form')
      .click();

    cy
      .get('@actionList')
      .find('.is-selected')
      .find('[data-due-region]')
      .click();

    cy
      .get('.picklist')
      .contains('Clear Selection')
      .click();

    cy
      .get('@actionList')
      .find('.is-selected')
      .find('[data-due-region]')
      .find('button')
      .should('have.class', 'is-icon-only');

    cy
      .get('@actionSidebar')
      .find('.js-close')
      .click();

    cy
      .get('@actionList')
      .find('.is-selected')
      .should('not.exist');

    cy
      .get('.js-add-action')
      .click();

    cy
      .get('@actionList')
      .find('.is-selected')
      .contains('New Flow Action')
      .click();

    cy
      .get('@actionSidebar')
      .find('[data-name-region] .js-input')
      .type('Test Name');

    cy
      .get('@actionSidebar')
      .find('.js-save')
      .click();

    cy
      .wait('@routePostAction')
      .its('request.body')
      .should(({ data }) => {
        expect(data.attributes.name).to.equal('Test Name');
      });

    cy
      .get('.table-list__item')
      .first()
      .find('.flow-action--attachment');

    cy
      .get('.table-list__item')
      .first()
      .next()
      .find('.flow-action--attachment')
      .should('not.exist');
  });
});
