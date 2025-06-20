export default new (class Auth {
    getUser() {
        try {
           
            const value = window.localStorage.getItem("user");
            if (value) {
                return JSON.parse(value);
            }
        } catch (err) {
            return "";
        }
    }

    getHeader() {
        const user = this.getUser();
        return { Authorization: `Bearer ${user.token}` };
    }
})();