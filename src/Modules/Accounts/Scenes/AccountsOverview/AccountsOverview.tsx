import {
	Avatar,
	Button,
	CircularProgress,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core';
import { AccountDto } from 'api/api';
import { apiClient } from 'api/apiClient';
import { AuthenticationContext } from 'Context/AuthenticationContext';
import { replaceItem } from 'Helpers/ArrayHelper';
import { orderBy } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import AccountDetailsDialog from './Components/AccountDetailsDialog/AccountDetailsDialog';
import EditAccountDialog from './Components/EditAccountDialog/EditAccountDialog';

const useStyles = makeStyles(theme => ({
	paper: {
		margin: theme.spacing(2),
	},
	container: {
		display: 'flex',
		flexGrow: 1,
		alignItems: 'center',
		height: 64,
		padding: theme.spacing(1, 2, 0, 0),
	},
	pusher: {
		flexGrow: 1,
	},
	centerContainer: {
		display: 'flex',
		flexGrow: 1,
		height: 'calc(100vh - 64px)',
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
	},
}));

export default function AccountsOverview() {
	const classes = useStyles();
	const [accounts, setAccounts] = useState<AccountDto[]>([]);
	const [selectedAccountId, setSelectedAccountId] = useState<string>(undefined);
	const [accountDetailsDialogOpen, setAccountDetailsDialogOpen] = useState(false);
	const [editAccountDialogOpen, setEditAccountDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { isAuthenticated } = useContext(AuthenticationContext);

	useEffect(() => {
		initialize();
	}, []);

	async function initialize() {
		try {
			setIsLoading(true);
			const accounts = await apiClient.getAccounts();
			const orderedAccounts = orderBy(accounts, a => a.name.toLowerCase(), 'asc');
			setAccounts(orderedAccounts);
		} catch (error) {
			// Error handling with a snackbar for example
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	async function getRandomFact(accountId: string) {
		try {
			const newFact = await apiClient.updateRandomFact(accountId);

			setAccounts(prevState =>
				replaceItem(
					prevState,
					{ ...prevState.find(p => p.id === accountId), randomFact: newFact.text },
					p => p.id === accountId
				)
			);
		} catch (error) {
			console.log(error);
		}
	}

	async function getAddedAccount(accountId: string, update: boolean) {
		try {
			const account = await apiClient.getAccountById(accountId);
			let newAccounts: AccountDto[] = [];

			if (update) {
				newAccounts = replaceItem(accounts, account, a => a.id === accountId);
			} else {
				newAccounts = [...accounts, account];
			}

			setAccounts(orderBy(newAccounts, a => a.name.toLowerCase(), 'asc'));
			setEditAccountDialogOpen(false);
			setSelectedAccountId(undefined);
		} catch (error) {
			console.log(error);
		}
	}

	async function handleDeleteAccount(accountId: string) {
		try {
			await apiClient.deleteAccount(accountId);
			setAccounts(accounts.filter(a => a.id !== accountId));
		} catch (error) {
			console.log(error);
		}
	}

	function handleEditAccount(accountId: string) {
		setEditAccountDialogOpen(true);
		setSelectedAccountId(accountId);
	}

	function handleAccountDetailsDialog(accountId: string) {
		setAccountDetailsDialogOpen(true);
		setSelectedAccountId(accountId);
	}

	function handleClose() {
		setEditAccountDialogOpen(false);
		setAccountDetailsDialogOpen(false);
		setSelectedAccountId(undefined);
	}

	function getAccountCredentials(name: string) {
		const nameParts = name.split(' ');
		const firstLetterFirstPart = nameParts[0][0].toUpperCase();
		const firstLetterLastPart = nameParts[nameParts.length - 1][0].toUpperCase();

		return firstLetterFirstPart + firstLetterLastPart;
	}

	function renderAccount(account: AccountDto) {
		return (
			<ListItem key={account.id} button onClick={() => handleAccountDetailsDialog(account.id)}>
				<ListItemAvatar>
					<Avatar>{getAccountCredentials(account.name)}</Avatar>
				</ListItemAvatar>
				<ListItemText primary={account.name} secondary={account.iban} />
				<ListItemSecondaryAction>
					<Button onClick={() => handleEditAccount(account.id)}>Edit</Button>
					<Button onClick={() => handleDeleteAccount(account.id)}>Delete</Button>
				</ListItemSecondaryAction>
			</ListItem>
		);
	}

	function renderEmptyState() {
		return (
			<div className={classes.centerContainer}>
				<Typography style={{ paddingBottom: 8 }} variant='h6'>
					There are no accounts yet!
				</Typography>
				{isAuthenticated && (
					<Button variant='contained' color='secondary' onClick={() => setEditAccountDialogOpen(true)}>
						Add account
					</Button>
				)}
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className={classes.centerContainer}>
				<CircularProgress size={128} color='primary' />
			</div>
		);
	}

	return (
		<>
			{!isLoading && accounts.length === 0 ? (
				renderEmptyState()
			) : (
				<>
					<div className={classes.container}>
						<div className={classes.pusher} />
						<div>
							<Button variant='contained' color='primary' onClick={() => setEditAccountDialogOpen(true)}>
								Add new account
							</Button>
						</div>
					</div>
					<Paper className={classes.paper}>
						<List>{accounts.map(renderAccount)}</List>
					</Paper>
				</>
			)}

			<AccountDetailsDialog
				account={accounts.find(a => a.id === selectedAccountId)}
				open={accountDetailsDialogOpen}
				onClose={handleClose}
				onGetRandomFact={getRandomFact}
			/>

			<EditAccountDialog
				account={accounts.find(a => a.id === selectedAccountId)}
				open={editAccountDialogOpen}
				onClose={handleClose}
				onValidSubmit={getAddedAccount}
			/>
		</>
	);
}
