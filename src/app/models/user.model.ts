class User {
    public studenId: string;
    public phone: string;
    public name: string;
    public pass: string;
    public birthDate: Date;
    constructor(id: string, phone: string, name: string, pass: string, birth: Date) {
        this.studenId = id;
        this.phone = phone;
        this.name = name;
        this.pass = pass;
        this.birthDate = birth;
    }
}
export default User;

