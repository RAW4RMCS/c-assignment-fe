import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { LoginDto } from 'api/api';
import { AuthenticationContext } from 'Context/AuthenticationContext';
import React, { useContext, useState } from 'react';

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		height: 64,
		paddingLeft: theme.spacing(4),
		alignItems: 'center',
		background: theme.palette.primary.main,
	},
	title: {
		color: '#e5e5e5',
		flexGrow: 1,
	},
	textField: {
		background: '#e5e5e5',
		marginRight: theme.spacing(2),
		borderRadius: theme.shape.borderRadius,
		height: 48,
	},
	button: {
		height: 48,
		marginRight: theme.spacing(2),
	},
}));

export default function TopBar() {
	const classes = useStyles();
	const [loginData, setLoginData] = useState<LoginDto>({ username: 'Remco', password: 'TesterDeTest1!' });
	const { login, logout, isAuthenticated } = useContext(AuthenticationContext);

	return (
		<div className={classes.container}>
			<Typography variant='h6' className={classes.title}>
				Accounts overview
			</Typography>
			<div>
				<div>
					{!isAuthenticated && (
						<>
							<TextField
								variant='outlined'
								className={classes.textField}
								value={loginData.username}
								onChange={e => setLoginData(prevState => ({ ...prevState, username: e.target.value }))}
							/>
							<TextField
								variant='outlined'
								className={classes.textField}
								value={loginData.password}
								type='password'
								onChange={e => setLoginData(prevState => ({ ...prevState, password: e.target.value }))}
							/>
						</>
					)}
					<Button
						color='secondary'
						variant='contained'
						className={classes.button}
						onClick={isAuthenticated ? logout : () => login(loginData)}
					>
						{isAuthenticated ? 'logout' : 'Login'}
					</Button>
				</div>
			</div>
		</div>
	);
}
