import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	makeStyles,
	TextField,
	Typography,
	LinearProgress,
	Divider,
} from '@material-ui/core';
import { AccountDto, EditAccountDto } from 'api/api';
import { apiClient } from 'api/apiClient';
import { AccountsLogic } from 'Logic/AccountsLogic';
import React, { useEffect, useState } from 'react';

interface IProps {
	open: boolean;
	account?: AccountDto;
	onClose: () => void;
	onValidSubmit: (accountId: string, update?: boolean) => void;
}

const useStyles = makeStyles(theme => ({
	content: {
		margin: theme.spacing(2),
		display: 'flex',
		flexGrow: 1,
	},
	imageContainer: {
		display: 'flex',
		margin: theme.spacing(2),
		justifyContent: 'center',
		alignItems: 'center',
	},
	detailsContainer: {
		flexGrow: 1,
	},
	randomFactContainer: {
		display: 'flex',
		flexGrow: 1,
	},
	randomFact: {
		flexGrow: 1,
	},
	textInput: {
		margin: theme.spacing(1),
	},
	errorMessage: {
		marginTop: theme.spacing(2),
		display: 'flex',
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));

export default function EditAccountDialog(props: IProps) {
	const { open, onClose, onValidSubmit, account } = props;
	const [editAccount, setEditAccount] = useState<AccountDto>(AccountsLogic.createEmptyAccountDto);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		setErrorMessage('');
		setEditAccount(account ?? AccountsLogic.createEmptyAccountDto);
	}, [account]);

	if (!open) {
		return null;
	}

	function updateAccount(delta: Partial<EditAccountDto>) {
		setEditAccount(prevState => ({ ...prevState, ...delta }));
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			setIsLoading(true);
			if (!editAccount.name || editAccount.name.length <= 3) {
				setErrorMessage('Name should have a minimum of 3 characters');
				return;
			}

			if (!editAccount.iban || editAccount.iban.length <= 10) {
				setErrorMessage('Iban should have a minimum of 10 characters');
				return;
			}

			if (account) {
				await apiClient.updateAccount(account.id, AccountsLogic.mapAccountDtoToEditAccountDto(editAccount));
			} else {
				await apiClient.addAccount(AccountsLogic.mapAccountDtoToAddAccountDto(editAccount));
			}

			onValidSubmit(editAccount.id, Boolean(account));
			setEditAccount(AccountsLogic.createEmptyAccountDto);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	// usually i would use Yup for form validation
	function renderAccountDetails() {
		return (
			<>
				<TextField
					fullWidth
					variant='outlined'
					value={editAccount.name}
					label='Name'
					className={classes.textInput}
					onChange={e => updateAccount({ name: e.target.value })}
				/>
				<TextField
					fullWidth
					variant='outlined'
					value={editAccount.iban}
					label='Iban'
					className={classes.textInput}
					onChange={e => updateAccount({ iban: e.target.value })}
				/>
				<TextField
					fullWidth
					variant='outlined'
					value={editAccount.favoriteQuote}
					label='Favorite quote'
					className={classes.textInput}
					onChange={e => updateAccount({ favoriteQuote: e.target.value })}
				/>
				<Divider />
				<div className={classes.errorMessage}>
					<Typography variant='body1' color='error'>
						{errorMessage}
					</Typography>
				</div>
			</>
		);
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<form onSubmit={handleSubmit}>
				<DialogTitle>Add new account</DialogTitle>
				<div className={classes.content}>
					<div className={classes.detailsContainer}>{renderAccountDetails()}</div>
				</div>
				<DialogActions>
					<Button type='submit'>save</Button>
				</DialogActions>
				{isLoading && <LinearProgress color='secondary' />}
			</form>
		</Dialog>
	);
}
