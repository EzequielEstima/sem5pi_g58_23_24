export interface IUserPersistence {
	domainId: number,
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	salt: string,
	role: string
  }