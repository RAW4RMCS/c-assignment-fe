import { LoginDto } from 'api/api';
import { apiClient } from 'api/apiClient';
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface IAuthenticationContext {
	login: (data: LoginDto) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

export const AuthenticationContext = createContext<IAuthenticationContext>(undefined);

export default function AuthenticationContextProvider({ children }: PropsWithChildren<React.ReactNode>) {
	const [state, setState] = useState<IAuthenticationContext>({
		login,
		logout,
		isAuthenticated: false,
	});

	useEffect(() => {
		if (localStorage.getItem('jwt')) {
			setAuthentication(true);
		} else {
			setAuthentication(false);
		}
	}, []);

	function setAuthentication(value: boolean) {
		setState(prevState => ({ ...prevState, isAuthenticated: value }));
	}

	async function login(data: LoginDto) {
		try {
			const response = await apiClient.login(data);
			// Basic authentication is only based on the presence of the JWT in the local storage
			localStorage.setItem('jwt', response.payload);
			setAuthentication(true);
		} catch (error) {
			console.log(error);
			setAuthentication(false);
		}
	}

	function logout() {
		localStorage.removeItem('jwt');
		setAuthentication(false);
	}

	return <AuthenticationContext.Provider value={state}>{children}</AuthenticationContext.Provider>;
}
