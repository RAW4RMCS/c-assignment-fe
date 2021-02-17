import { AccountDto, AddAccountDto, EditAccountDto } from 'api/api';
import { v4 as uuidV4 } from 'uuid';

export class AccountsLogic {
	static createEmptyAccountDto(): AccountDto {
		return {
			id: uuidV4(),
			name: '',
			favoriteQuote: '',
			iban: '',
		};
	}

	static mapAccountDtoToEditAccountDto(account: AccountDto): EditAccountDto {
		return {
			iban: account.iban,
			name: account.name,
			favoriteQuote: account.favoriteQuote,
		};
	}

	static mapAccountDtoToAddAccountDto(account: AccountDto): AddAccountDto {
		return {
			id: account.id,
			iban: account.iban,
			name: account.name,
			favoriteQuote: account.favoriteQuote,
		};
	}
}
