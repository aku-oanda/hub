import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mocked } from 'ts-jest/utils';

import { API } from '../../../api';
import UserInvitation from './UserInvitation';
jest.mock('../../../api');

const defaultProps = {
  orgToConfirm: 'orgTest',
};

describe('UserInvitation', () => {
  it('creates snapshot', async () => {
    mocked(API).confirmOrganizationMembership.mockResolvedValue(null);

    const result = render(
      <Router>
        <UserInvitation {...defaultProps} />
      </Router>
    );

    await waitFor(() => {
      expect(result.asFragment()).toMatchSnapshot();
    });
  });

  it('when org name is valid', async () => {
    mocked(API).confirmOrganizationMembership.mockResolvedValue(null);

    const { getByText } = render(
      <Router>
        <UserInvitation {...defaultProps} />
      </Router>
    );

    await waitFor(() => {
      expect(getByText('You have accepted the invitation to join the organization.')).toBeInTheDocument();
    });
  });

  it('does not render component when email code is undefined', () => {
    const { queryByTestId } = render(
      <Router>
        <UserInvitation />
      </Router>
    );

    expect(queryByTestId('userInvitationModal')).toBeNull();
  });

  describe('when email code is invalid', () => {
    it('error 400', async () => {
      mocked(API).confirmOrganizationMembership.mockRejectedValue({
        status: 400,
        message: 'Error 400',
      });

      const { getByText } = render(
        <Router>
          <UserInvitation {...defaultProps} />
        </Router>
      );

      await waitFor(() => {
        expect(getByText('Error 400')).toBeInTheDocument();
      });
    });

    it('error 401', async () => {
      mocked(API).confirmOrganizationMembership.mockRejectedValue({
        status: 401,
      });

      const { getByText } = render(
        <Router>
          <UserInvitation {...defaultProps} />
        </Router>
      );

      await waitFor(() => {
        expect(
          getByText(
            'Please sign in to accept the invitation to join the organization. You can accept it from the Control Panel, in the organizations tab, or from the link you received in the invitation email.'
          )
        ).toBeInTheDocument();
      });
    });

    it('default error message', async () => {
      mocked(API).confirmOrganizationMembership.mockRejectedValue({
        status: 500,
      });

      const { getByText } = render(
        <Router>
          <UserInvitation {...defaultProps} />
        </Router>
      );

      await waitFor(() => {
        expect(
          getByText('An error occurred accepting your invitation, please contact us about this issue.')
        ).toBeInTheDocument();
      });
    });
  });
});
