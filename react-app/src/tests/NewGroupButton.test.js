import React from 'react';
import { render, screen } from '@testing-library/react';
import NewGroupButton from '../views/dashboard/GroupCard/NewGroupButton';
import { unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from 'store';
import '@testing-library/jest-dom';

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test('renders a button', () => {
    render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NewGroupButton />
            </PersistGate>

        </Provider>,
        container
    );
    // render(<NewGroupButton />, container);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
});