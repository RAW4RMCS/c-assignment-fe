import {
	Avatar,
	Button,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	makeStyles,
	Paper,
	Typography,
} from '@material-ui/core';
import { AccountDto } from 'api/api';
import { apiClient } from 'api/apiClient';
import { replaceItem } from 'Helpers/ArrayHelper';
import { orderBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import AccountDetailsDialog from './Components/AccountDetailsDialog/AccountDetailsDialog';
import EditAccountDialog from './Components/EditAccountDialog/EditAccountDialog';

const useStyles = makeStyles(theme => ({
	paper: {
		margin: theme.spacing(2),
	},
}));

export default function AccountsOverview() {
	const classes = useStyles();
	const [accounts, setAccounts] = useState<AccountDto[]>([]);
	const [selectedAccountId, setSelectedAccountId] = useState<string>(undefined);
	const [accountDetailsDialogOpen, setAccountDetailsDialogOpen] = useState(false);
	const [editAccountDialogOpen, setEditAccountDialogOpen] = useState(false);

	useEffect(() => {
		initialize();
	}, []);

	async function initialize() {
		try {
			const accounts = await apiClient.getAccounts();
			const orderedAccounts = orderBy(accounts, a => a.name.toLowerCase(), 'asc');
			setAccounts(orderedAccounts);
		} catch (error) {
			// Error handling with a snackbar for example
			console.log(error);
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

	if (accounts.length === 0) {
		return <>There are no accounts :(</>;
	}

	return (
		<>
			<Paper className={classes.paper}>
				<List>
					<ListSubheader>
						<Typography variant='h6'>Accounts</Typography>
						<ListItemSecondaryAction>
							<Button variant='contained' color='primary' onClick={() => setEditAccountDialogOpen(true)}>
								Add new account
							</Button>
						</ListItemSecondaryAction>
					</ListSubheader>
					{accounts.map(renderAccount)}
				</List>
			</Paper>
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
