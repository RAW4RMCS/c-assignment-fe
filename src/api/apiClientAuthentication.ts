export default class ApiClientAuthentication {
	public transformOptions = async (options: RequestInit): Promise<RequestInit> => {
		const jwt = localStorage.getItem('jwt');

		if (jwt) {
			options.headers = new Headers({
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${jwt}`,
			});
		}
		return options;
	};
}
