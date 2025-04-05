export default class User {

    private email: string;
    private password: string;

    constructor() {
        this.email = "";
        this.password = "";
    }

    public getEmail(): string {
        return this.email;
    }

}
