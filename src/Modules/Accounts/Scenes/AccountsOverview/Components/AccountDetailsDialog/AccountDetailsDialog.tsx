import { Button, Dialog, DialogTitle, makeStyles, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { AccountDto } from 'api/api';

interface IProps {
	account: AccountDto;
	open: boolean;
	onClose: () => void;
	onGetRandomFact: (accountId: string) => void;
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
		margin: theme.spacing(2),
	},
	randomFactContainer: {
		display: 'flex',
		flexGrow: 1,
	},
	randomFact: {
		flexGrow: 1,
	},
}));

export default function AccountDetailsDialog(props: IProps) {
	const { account, open, onClose, onGetRandomFact } = props;
	const classes = useStyles();

	if (!open) {
		return null;
	}

	function renderImage() {
		if (!account.imageUrl) {
			return (
				<img src='https://www.heemsteder.nl/wp-content/themes/fearless/images/missing-image-640x360.png' width={256} />
			);
		}
	}

	function renderGetRandomFact() {
		const buttonText = account.randomFact ? 'Get new fact!' : 'Get fact';
		return (
			<>
				<div className={classes.randomFactContainer}>
					<div className={classes.randomFact}>{account.randomFact ?? '-'}</div>
					<div>
						<Button variant='contained' color='primary' onClick={() => onGetRandomFact(account.id)}>
							{buttonText}
						</Button>
					</div>
				</div>
			</>
		);
	}

	function renderAccountDetails() {
		return (
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Id</TableCell>
						<TableCell>{account.id}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Iban</TableCell>
						<TableCell>{account.iban}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Favorite quote</TableCell>
						<TableCell>{account.favoriteQuote}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Random fact</TableCell>
						<TableCell>{renderGetRandomFact()}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		);
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
			<DialogTitle>{account.name}</DialogTitle>
			<div className={classes.content}>
				<div className={classes.detailsContainer}>{renderAccountDetails()}</div>
				<div className={classes.imageContainer}>{renderImage()}</div>
			</div>
		</Dialog>
	);
}
