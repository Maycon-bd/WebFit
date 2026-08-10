import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppContext, AppProvider } from './AppContext';
import { AuthProvider } from './AuthContext';
import { WorkspaceProvider } from './WorkspaceContext';

const Harness = () => {
  const context = useContext(AppContext);
  return <output data-testid="state">{JSON.stringify({
    patients: context.patients,
    appointments: context.appointments,
    financials: context.financials,
    prescriptions: context.prescriptions,
    notifications: context.notifications,
    plannerTasks: context.plannerTasks,
    chats: context.chats,
    recipes: context.recipes,
    myFoods: context.myFoods,
    messageTemplates: context.messageTemplates,
    profile: context.userProfile,
  })}</output>;
};

describe('AppContext without demo fixtures', () => {
  it('starts with clean business data', () => {
    render(
      <AuthProvider>
        <WorkspaceProvider>
          <AppProvider><Harness /></AppProvider>
        </WorkspaceProvider>
      </AuthProvider>,
    );

    const state = JSON.parse(screen.getByTestId('state').textContent ?? '{}');
    expect(state.patients).toEqual([]);
    expect(state.appointments).toEqual([]);
    expect(state.financials).toEqual([]);
    expect(state.prescriptions).toEqual([]);
    expect(state.notifications).toEqual([]);
    expect(state.plannerTasks).toEqual([]);
    expect(state.chats).toEqual({});
    expect(state.profile.name).toBe('Profissional');
  });
});
