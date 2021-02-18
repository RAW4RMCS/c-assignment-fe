import TopBar from 'Components/TopBar/TopBar';
import AuthenticationContextProvider from 'Context/AuthenticationContext';
import AccountsOverview from 'Modules/Accounts/Scenes/AccountsOverview/AccountsOverview';
import React from 'react';

export default function App() {
	return (
		<AuthenticationContextProvider>
			<TopBar />
			<AccountsOverview />
		</AuthenticationContextProvider>
	);
}
