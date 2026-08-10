import React, { useContext } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppContext, AppProvider } from './AppContext';

const Harness = () => {
  const context = useContext(AppContext);
  return (
    <>
      <button onClick={() => context.addTransaction('', 125, 'PIX', 'Cliente Teste')}>add custom</button>
      <button onClick={() => context.cancelAppointment('ap1')}>cancel appointment</button>
      <button onClick={() => context.deletePatient('1')}>delete patient</button>
      <output data-testid="state">{JSON.stringify({
        financials: context.financials,
        appointments: context.appointments,
        prescriptions: context.prescriptions,
        notifications: context.notifications,
        chats: context.chats,
      })}</output>
    </>
  );
};

const readState = () => JSON.parse(screen.getByTestId('state').textContent ?? '{}');

describe('AppContext domain integrity', () => {
  it('keeps the custom client name in financial entries', () => {
    render(<AppProvider><Harness /></AppProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'add custom' }));

    expect(readState().financials[0].patientName).toBe('Cliente Teste');
  });

  it('keeps cancelled appointments in history', () => {
    render(<AppProvider><Harness /></AppProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'cancel appointment' }));

    expect(readState().appointments.find((item: { id: string }) => item.id === 'ap1').status).toBe('Cancelada');
  });

  it('removes records linked by patient id', () => {
    render(<AppProvider><Harness /></AppProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'delete patient' }));
    const state = readState();

    expect(state.appointments.some((item: { patientId: string }) => item.patientId === '1')).toBe(false);
    expect(state.prescriptions.some((item: { patientId: string }) => item.patientId === '1')).toBe(false);
    expect(state.notifications.some((item: { patientId: string }) => item.patientId === '1')).toBe(false);
    expect(state.chats['1']).toBeUndefined();
  });
});
