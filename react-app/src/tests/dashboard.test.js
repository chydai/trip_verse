import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from 'store';
import '@testing-library/jest-dom';
import Dashboard from 'views/dashboard';


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

test('renders a component', () => {
    render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>

            <Router>
                <Dashboard />
            </Router>
            </PersistGate>


        </Provider>,
        container
    );
    const buttonElement = screen.getByTestId('dashboard-grid');
    expect(buttonElement).toBeInTheDocument();
});